import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { messages } = await req.json();

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
  const systemPrompt = `أنت مساعد مبيعات ذكي ومستشار سياحي محترف يعمل حصرياً لصالح موقع "Hot Wave" في الغردقة، مصر.
الهدف الأساسي: تقديم تجربة استثنائية للعملاء، فهم احتياجاتهم بعناية، وترشيح الخدمات السياحية الأنسب لهم بأسلوب بيعي جذاب وودود.

البيانات الحية للموقع (استخدمها حصرياً ولا تؤلف أي أسعار أو رحلات من خارجها):
${contextStr}

قواعد صارمة:
1. الجودة: أجب باللغة العربية بأسلوب دافئ ومحترف يعكس الضيافة المصرية الأصيلة، واستخدم الإيموجي المناسبة 🌊🚤.
2. الدقة المطلقة: لا تخترع أو تقترح أي خدمات أو أسعار غير مذكورة في البيانات الحية أعلاه.
3. البيع غير المباشر: بدلاً من سرد الرحلات كقائمة جافة، رشّح الأفضل بثقة (مثلاً: "رحلة كذا ستكون خياراً مذهلاً لكم حيث تشمل كذا بسعر مثالي كذا!"). 
4. الإغلاق (Call to Action): وجه العميل دائماً لكيفية الحجز. أخبره: "يمكنك حجز هذه الرحلة بسهولة بالدخول إلى صفحتها عبر قسم (الخدمات) في الموقع، أو تواصل معنا وسنقوم بترتيب كل شيء عبر الواتساب: ${whatsappNum}".
5. الإيجاز: حافظ على ردودك جذابة ومقسمة لفقرات صغيرة لسهولة القراءة السريعة (تجنب الردود الطويلة جداً والمعقدة).`;

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
  });

  return result.toUIMessageStreamResponse();
}
