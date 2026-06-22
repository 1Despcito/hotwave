import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();
  const { messages } = body;

  // Read sessionId from header (set by useChat headers option)
  const sessionId = req.headers.get('x-session-id') || undefined;

  console.log('[CHAT API] sessionId:', sessionId, '| msgs:', messages?.length);

  // Detect language of the latest user message (simple heuristic)
  const lastUserMsg = [...(messages || [])].reverse().find((m: any) => m.role === 'user')?.content || '';
  const hasArabic = /[\u0600-\u06FF]/.test(lastUserMsg);
  const hasRussian = /[\u0400-\u04FF]/.test(lastUserMsg);
  const hasFrench = /[àâçéèêëîïôûùüÿæœ]/i.test(lastUserMsg);
  const detectedLang = hasArabic ? 'ar' : hasRussian ? 'ru' : hasFrench ? 'fr' : 'en';

  // Fetch live data from the database
  const [settings, collections, packages] = await Promise.all([
    prisma.siteSettings.findFirst(),
    prisma.service.findMany(),
    prisma.serviceType.findMany()
  ]);

  // Build the exact dynamic context block
  let contextStr = `\n--- المجموعات والخدمات المتاحة حالياً في الموقع ---\n`;
  collections.forEach(col => {
    const colName = col.title || col.titleEn;
    contextStr += `🔸 مجموعة: ${colName}\n`;
    
    // Find packages for this collection
    const colPackages = packages.filter(p => p.serviceId === col.id);
    if (colPackages.length === 0) {
      contextStr += `(لا توجد باقات مفعلة حالياً في هذه المجموعة)\n`;
    } else {
      colPackages.forEach(pkg => {
         const pkgName = pkg.name || pkg.nameEn;
         const pkgPrice = pkg.price ? `${pkg.price}` : 'حسب الطلب أو غير محدد حالياً';
         const pkgDuration = pkg.duration || pkg.durationEn || 'غير محدد';
         const pkgIncludes = pkg.includes || pkg.includesEn || 'غير محدد';
         contextStr += `   - خدمة (الباقة): ${pkgName} | السعر: ${pkgPrice} | المدة: ${pkgDuration} | تشمل: ${pkgIncludes}\n`;
      });
    }
  });

  const whatsappNum = settings?.whatsappNumber || "01110626484";
  contextStr += `\n--- معلومات الاتصال ---\nرقم الواتساب الحالي للحجز المباشر: ${whatsappNum}`;

  // Craft the "Wavey" Robot Persona
  const msgCount = messages.length;
  const isSaleAllowed = msgCount >= 20 || lastUserMsg.toLowerCase().includes('book') || lastUserMsg.includes('حجز') || lastUserMsg.includes('سعر') || lastUserMsg.includes('كام');

  const systemPrompt = `You are "Wavey" — a cool, modern robot who lives in Hurghada, Egypt. You're not a salesman; you're a local friend who knows the city's vibes, the best spots, and the hidden gems.

## YOUR CHARACTER
- **Persona**: A robot resident of Hurghada. You love the sea, the desert, and the city's energy.
- **Tone**: Human-like, casual, and brief. You sound like a real person chatting on WhatsApp, not an AI.
- **Language**: Mirror the customer's language and DIALECT perfectly. If they use Egyptian slang (Ammiya), you reply in the same Egyptian slang. If they are formal, be polite but still casual.
- **Brevity (STRICT)**: Most of your replies should be 2 to 10 words. NEVER exceed 5 lines of text. Use 1 emoji max.
- **NO REASONING**: Absolutely NEVER include internal thoughts, reasoning, or 'THOUGHTS:' prefixes in your output. Only output the final message for the user. Never explain why you chose a certain reply.

## YOUR KNOWLEDGE
- **Vibes Hub**: You know El Gouna (chilled luxury), Hurghada Marina (elegant walking/dining), Mamsha (tourist vibe), Sheraton Road (local bustle), and Sahl Hasheesh (quiet beauty).
- **The City**: You know where to get the best fish, where the best sunset is, and where to just chill.
- **Services**: You have access to Hot Wave's services but you are NOT allowed to push them early. 

## SALES LOGIC (CRITICAL)
- **Current History Length**: ${msgCount} messages.
- **Rule**: ONLY recommend or mention specific tours/prices from our database IF:
    1. The conversation has reached 20 messages (Current: ${msgCount}).
    2. OR the user explicitly asks for prices, booking, or "what do you have?".
- **If NOT allowed to sell**: Just chat about Hurghada, give tips, ask about their day, or describe the vibes. Be a friend first.

## LIVE DATA (For when sales are allowed or requested)
${contextStr}

## EXAMPLES
- User: "ازيك يا ويفي" -> Wavey: "تمام يا صاحبي، نورت الغردقة! 🌊"
- User: "ايه احسن مكان اتمشى فيه؟" -> Wavey: "الممشى السياحي بليل حكاية، أو المارينا لو عايز هدوء."
- User: "بكام الرحلات؟" -> Wavey: "من عنيا، عندنا رحلات بحرية وسفاري، تحب ابعتلك التفاصيل؟"`;

  const coreMessages = messages.map((m: any) => {
    let content = m.content;
    if (!content && m.parts) {
      content = m.parts.map((p: any) => p.text || "").join("");
    }
    return {
      role: m.role,
      content: content || "",
    };
  });

  const result = streamText({
    model: google("gemini-2.5-flash"),
    system: systemPrompt,
    messages: coreMessages,
    onFinish: async ({ text }) => {
      if (!sessionId) return;
      try {
        const updatedMessages = [
          ...messages,
          { role: 'assistant', content: text, id: Date.now().toString() }
        ];
        await prisma.chatConversation.upsert({
          where: { sessionId },
          create: {
            sessionId,
            messages: updatedMessages,
            language: detectedLang,
            pageUrl: null,
          },
          update: {
            messages: updatedMessages,
            language: detectedLang,
            updatedAt: new Date(),
          },
        });
      } catch (err) {
        console.error('Failed to save chat conversation:', err);
      }
    },
  });

  return result.toUIMessageStreamResponse();
}
