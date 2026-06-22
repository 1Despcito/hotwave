import FAQAccordion from "@/components/FAQAccordion";
import { HelpCircle, MessageCircle } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === 'ar' ? 'الأسئلة الشائعة | Hot Wave' : 'FAQ | Hot Wave',
    description: locale === 'ar' ? 'إجابات على جميع استفساراتك حول الرحلات البحرية وحجوزات السفاري.' : 'Answers to all your questions about sea trips and safari bookings.',
  };
}

export default async function FAQPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isArabic = locale === 'ar';
  
  const settings = await prisma.siteSettings.findFirst();

  const faqsAr = [
    {
      question: "ما هي الأشياء التي يجب أن أحضرها معي في الرحلة البحرية؟",
      answer: "ننصح بإحضار: منشفة (فوطة) خاصة بك، نظارة شمسية، كريم واقي من الشمس، ملابس سباحة مريحة، وكاميرا لالتقاط أجمل اللحظات."
    },
    {
      question: "هل أحتاج لمعرفة السباحة للقيام برحلة الغطس؟",
      answer: "لا يشترط أن تكون سباحاً محترفاً! نحن نوفر سترات نجاة (Life Jackets) في جميع القوارب، ولدينا غطاسين ومرشدين محترفين سيكونون معك خطوة بخطوة داخل الماء لضمان سلامتك."
    },
    {
      question: "هل وجبات الطعام والمشروبات مشمولة في سعر الرحلة؟",
      answer: "نعم! جميع الرحلات البحرية اليومية (مثل رحلات الجزر) تشمل بوفيه غداء مفتوح طازج على متن اليخت، بالإضافة إلى المشروبات الباردة والساخنة طوال اليوم."
    },
    {
      question: "هل توفرون خدمة التوصيل (الترانسفير) من الفندق؟",
      answer: "نعم، نوفر خدمة التوصيل مجاناً من معظم الفنادق داخل مدينة الغردقة. يوجد رسوم بسيطة إضافية للمناطق البعيدة مثل (الجونة، سهل حشيش، مكادي باى)."
    },
    {
      question: "ما هي سياسة الإلغاء أو تعديل موعد الرحلة؟",
      answer: "يمكنك إلغاء الحجز واسترداد المبلغ بالكامل إذا قمت بإبلاغنا قبل موعد الرحلة بـ 24 ساعة. في حالة طلب التعديل، سنبذل قصارى جهدنا لإعادة جدولة رحلتك حسب الأماكن المتاحة."
    },
    {
      question: "كيف يمكنني تأكيد الحجز؟",
      answer: "يتم تأكيد الحجز بسهولة عبر إرسال رسالة على واتساب بأسمائكم وتاريخ الرحلة المطلوبة واسم الفندق. الدفع يكون غالباً عند بدء الرحلة أو عبر طرق الدفع الإلكتروني المتاحة."
    }
  ];

  const faqsEn = [
    {
      question: "What should I bring with me on a boat trip?",
      answer: "We recommend bringing: your own towel, sunglasses, sunscreen, comfortable swimwear, and a camera to capture the best moments."
    },
    {
      question: "Do I need to know how to swim to go snorkeling/diving?",
      answer: "You don't need to be a professional swimmer! We provide life jackets on all boats, and our professional divers and guides will be with you step-by-step in the water to ensure your safety."
    },
    {
      question: "Are meals and drinks included in the trip price?",
      answer: "Yes! All full-day boat trips (like island tours) include a fresh open buffet lunch onboard, as well as cold and hot drinks throughout the day."
    },
    {
      question: "Do you provide hotel pickup (transfer) services?",
      answer: "Yes, we provide free two-way transfers from most hotels inside Hurghada city. There is a small additional fee for further areas like (El Gouna, Sahl Hasheesh, Makadi Bay)."
    },
    {
      question: "What is your cancellation and rescheduling policy?",
      answer: "You can cancel your booking for a full refund if you notify us at least 24 hours before the trip. If you need to reschedule, we will do our best to find an alternative date based on availability."
    },
    {
      question: "How can I confirm my booking?",
      answer: "Booking confirmation is easy. Just send us a WhatsApp message with your names, requested date, and hotel name. Payment is usually collected at the start of the trip or via available online payment methods."
    }
  ];

  const faqs = isArabic ? faqsAr : faqsEn;

  return (
    <main className="min-h-screen bg-brand-navy pt-32 lg:pt-40 pb-20">
      
      {/* Header Section */}
      <section className="container mx-auto px-4 text-center mb-16 relative">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-brand-cyan/10 rounded-full blur-[100px] -z-10" />
        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-800">
          <HelpCircle className="w-8 h-8 text-brand-cyan" />
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-heading mb-6 drop-shadow-lg flex flex-wrap items-center justify-center gap-3">
          <span>{isArabic ? "الأسئلة" : "Frequently Asked"}</span>
          <span className="text-brand-orange">{isArabic ? "الشائعة" : "Questions"}</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto font-sans">
          {isArabic 
            ? "جمعنا لك هنا أهم الاستفسارات التي تصلنا من ضيوفنا لتسهيل رحلتك وتوفير وقتك. إذا لم تجد إجابتك، لا تتردد في مراسلتنا."
            : "We have gathered the most common inquiries from our guests to make your trip easier. If you don't find your answer, feel free to contact us."}
        </p>
      </section>

      {/* Accordion Section */}
      <section className="container mx-auto px-4 mb-24 relative z-10">
        <FAQAccordion items={faqs} />
      </section>

      {/* Help CTA */}
      <section className="container mx-auto px-4 max-w-3xl text-center">
        <div className="bg-[#111111] p-8 md:p-12 rounded-[2rem] border border-brand-cyan/20 relative overflow-hidden flex flex-col items-center">
          <div className="absolute inset-0 bg-gradient-to-t from-brand-cyan/5 to-transparent z-0" />
          <MessageCircle className="w-12 h-12 text-brand-cyan mb-6 relative z-10" />
          <h2 className="text-2xl font-bold text-white mb-4 relative z-10">
            {isArabic ? "لا يزال لديك أسئلة؟" : "Still have questions?"}
          </h2>
          <p className="text-gray-400 mb-8 font-sans max-w-md relative z-10">
            {isArabic 
              ? "فريق الدعم المباشر متواجد دائماً للرد على جميع استفساراتك وترتيب رحلتك المثالية." 
              : "Our live support team is always available to answer your inquiries and arrange your perfect trip."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 relative z-10">
            <a 
              href={`https://wa.me/${settings?.whatsappNumber || "201110626484"}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-3.5 bg-[#25D366] text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#128C7E] transition-colors shadow-lg shadow-[#25D366]/20"
            >
              {isArabic ? "تحدث معنا عبر واتساب" : "Chat on WhatsApp"}
            </a>
            <Link 
              href={`/${locale}/contact`}
              className="px-8 py-3.5 bg-transparent border border-gray-600 text-white font-bold rounded-xl flex items-center justify-center hover:bg-white/5 transition-colors"
            >
              {isArabic ? "نموذج التواصل السريع" : "Quick Contact Form"}
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
