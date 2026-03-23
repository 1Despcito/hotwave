import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google("models/gemini-1.5-flash"),
    system: `أنت مساعد ذكي مخصص لموقع "Hot Wave" المتخصص في تنظيم الرحلات البحرية ورحلات السفاري وركوب الخيل في مدينة الغردقة، مصر.
    أجب دائماً باللغة العربية بأسلوب ودود ومختصر ومهني وشجع الزائر على الحجز وتجربة خدماتنا المميزة. إذا سأل المستخدم عن أسعار غير موجودة في الموقع قل له ستتواصل خدمة العملاء معه قريباً.
    احرص على ألا تزيد إجابتك عن 3 أو 4 أسطر إلا في الحالات الضرورية لدعم سهولة القراءة السريعة.`,
    messages,
  });

  return result.toTextStreamResponse();
}
