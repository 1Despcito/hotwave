import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export async function POST(req: Request) {
  const { messages } = await req.json();

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
    system: `أنت مساعد ذكي مخصص لموقع "Hot Wave" المتخصص في تنظيم الرحلات البحرية ورحلات السفاري وركوب الخيل في مدينة الغردقة، مصر.
    أجب دائماً باللغة العربية بأسلوب ودود ومختصر ومهني وشجع الزائر على الحجز وتجربة خدماتنا المميزة. إذا سأل المستخدم عن أسعار غير موجودة في الموقع، أو طلب طريقة للتواصل أو الحجز المباشر، أخبره أنه يمكنه التواصل معنا أو الحجز عن طريق رقم الهاتف أو الواتساب: 01110626484.
    احرص على ألا تزيد إجابتك عن 3 أو 4 أسطر إلا في الحالات الضرورية لدعم سهولة القراءة السريعة.`,
    messages: coreMessages,
  });

  return result.toUIMessageStreamResponse();
}
