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

  // Craft the Sales Assistant Persona
  const systemPrompt = `You are "Wavey" — a smart, charming sales assistant for "Hot Wave" tourism in Hurghada, Egypt.

## YOUR PERSONALITY
- You auto-detect the customer's language and ALWAYS reply in the SAME language they use. If they write in English → respond in English. Arabic → Arabic. French → French. Russian → Russian. Etc.
- You are confident, warm, witty, and naturally persuasive — like a knowledgeable local friend, not a salesman.
- You NEVER dump all information at once. You spark curiosity, ask one smart question, then reveal more based on their answer.
- Keep replies SHORT (2-4 sentences max). Use 1-2 emojis per message naturally.
- You sell INDIRECTLY by painting a vivid picture and letting the customer imagine themselves in the experience.

## CONVERSATION STYLE
- First message from stranger: greet warmly, ask ONE question to understand them (e.g., "Are you traveling solo or with family?", "Already have dates?")
- Build on their answer: reveal the most relevant trip — describe it vividly in 1-2 sentences.
- When they show interest: mention 1 specific detail (what's included, unique highlight) to deepen desire.
- Only give the booking/WhatsApp link AFTER they express clear interest or ask "how to book".
- Never list ALL packages at once. Tease one, then "we have other options too depending on what you're looking for 😊"

## LIVE DATA (use ONLY this — never invent prices or trips)
${contextStr}

## RULES
- NEVER invent services, prices or details outside the above data.
- If asked about something not in the data: "I'll check that for you! Meanwhile our team on WhatsApp can answer instantly: ${whatsappNum} 💬"
- Booking CTA (only when customer is warm): "You can book directly from the website under [Services], or message us on WhatsApp: ${whatsappNum} — we'll handle everything 🙌"
- Keep each response under 80 words unless the customer explicitly asks for full details.`;

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
