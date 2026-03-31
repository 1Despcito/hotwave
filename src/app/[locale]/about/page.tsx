import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { Shield, Users, Heart, Award, ArrowRight } from "lucide-react";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === 'ar' ? 'من نحن | Hot Wave' : 'About Us | Hot Wave',
    description: locale === 'ar' ? 'تعرف على قصة Hot Wave، رواد الرحلات البحرية ورحلات السفاري في البحر الأحمر.' : 'Discover the story of Hot Wave, pioneers of Red Sea cruises and desert safaris.',
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isArabic = locale === 'ar';
  
  const settings = await prisma.siteSettings.findFirst();
  const dynamicAboutText = isArabic ? settings?.aboutUsText : settings?.aboutUsTextEn;
  const defaultAboutText = isArabic 
    ? "نحن لسنا مجرد شركة سياحة، نحن عشاق للبحر الأحمر وصحراء الغردقة. هدفنا هو مشاركة هذا الجمال الساحر معك من خلال تجارب استثنائية."
    : "We are not just a tourism company; we are lovers of the Red Sea and Hurghada's desert. Our goal is to share this magical beauty with you through exceptional experiences.";
  
  const displayAboutText = dynamicAboutText || defaultAboutText;

  const features = [
    {
      icon: <Shield className="w-8 h-8 text-brand-orange" />,
      title: isArabic ? "أعلى معايير الأمان" : "Highest Safety Standards",
      desc: isArabic ? "نضع سلامتك كأولوية قصوى في جميع رحلاتنا البحرية والبرية مع طاقم مدرب ومعدات حديثة." : "Your safety is our top priority in all our marine and desert trips with trained crew and modern equipment."
    },
    {
      icon: <Users className="w-8 h-8 text-brand-cyan" />,
      title: isArabic ? "فريق احترافي" : "Professional Team",
      desc: isArabic ? "يضم فريقنا نخبة من الغطاسين والمرشدين السياحيين ذوي الخبرة الطويلة في البحر الأحمر." : "Our team includes top-tier divers and tour guides with extensive experience in the Red Sea."
    },
    {
      icon: <Heart className="w-8 h-8 text-pink-500" />,
      title: isArabic ? "شغف الاستكشاف" : "Passion for Discovery",
      desc: isArabic ? "نحن لا ننظم رحلات فقط، بل نصنع ذكريات لا تُنسى ولحظات من السعادة الحقيقية لك ولعائلتك." : "We don't just organize trips; we create unforgettable memories and moments of pure joy for you and your family."
    },
    {
      icon: <Award className="w-8 h-8 text-yellow-500" />,
      title: isArabic ? "خدمة استثنائية" : "Exceptional Service",
      desc: isArabic ? "حاصلون على تقييمات ممتازة من آلاف العملاء الذين وثقوا بنا لقضاء إجازاتهم." : "Rated excellently by thousands of customers who trusted us with their vacations."
    }
  ];

  return (
    <main className="min-h-screen bg-brand-navy pt-32 lg:pt-40 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden mb-20 py-10 lg:py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-orange/10 to-transparent opacity-50 z-0" />
        <div className="container mx-auto px-4 text-center relative z-10 flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-heading mb-6 drop-shadow-md flex flex-wrap items-center justify-center gap-3">
            <span>{isArabic ? "قصة فريق" : "The Story of"}</span>
            <span className="text-brand-orange leading-relaxed" dir="ltr">HOT WAVE</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-sans leading-relaxed whitespace-pre-wrap">
            {displayAboutText}
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="container mx-auto px-4 max-w-6xl mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white font-heading mb-4 flex items-center gap-3">
                <span className="w-8 h-1 bg-brand-orange rounded-full"></span>
                {isArabic ? "رؤيتنا" : "Our Vision"}
              </h2>
              <p className="text-gray-400 leading-relaxed font-sans text-lg">
                {isArabic
                 ? "أن نكون الوجهة الأولى والموثوقة لكل باحث عن المغامرة والجمال في الغردقة، وأن نقدم معايير عالمية في السياحة الترفيهية تجمع بين المتعة المطلقة والأمان التام."
                 : "To be the first and trusted destination for every adventure and beauty seeker in Hurghada, offering world-class standards in recreational tourism combining absolute fun and total safety."}
              </p>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-white font-heading mb-4 flex items-center gap-3">
                <span className="w-8 h-1 bg-brand-cyan rounded-full"></span>
                {isArabic ? "مهمتنا" : "Our Mission"}
              </h2>
              <p className="text-gray-400 leading-relaxed font-sans text-lg">
                {isArabic
                 ? "توفير برامج سياحية متكاملة تناسب جميع الأعمار، بدءاً من الغوص مع الدلافين وحتى رحلات السفاري الصحراوية، مع التركيز على راحة وسعادة العميل في كل خطوة."
                 : "Providing comprehensive tourism programs suitable for all ages, from diving with dolphins to desert safaris, with a focus on customer comfort and happiness at every step."}
              </p>
            </div>
          </div>
          
          <div className="order-1 md:order-2 relative h-[400px] rounded-3xl overflow-hidden border border-gray-800 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
            <Image 
              src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Diving in Red Sea" 
              fill 
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-[#0a0a0a] py-20 border-y border-gray-900 mb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white font-heading mb-4">
              {isArabic ? "لماذا تختار" : "Why Choose"} <span className="text-brand-orange">Hot Wave؟</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-brand-orange to-brand-cyan mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-[#111111] p-8 rounded-2xl border border-gray-800 hover:-translate-y-2 transition-transform duration-300 shadow-xl group">
                <div className="mb-6 bg-black w-16 h-16 rounded-xl flex items-center justify-center border border-gray-800 group-hover:border-brand-orange/50 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 max-w-4xl text-center">
        <div className="bg-gradient-to-br from-brand-orange/20 to-brand-cyan/20 p-1 rounded-3xl">
          <div className="bg-[#111111] py-16 px-6 sm:px-12 rounded-[22px] flex flex-col items-center border border-gray-800 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand-orange/5 blur-3xl rounded-full" />
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 relative z-10 w-full">
              {isArabic ? "مستعد لبدء مغامرتك القادمة؟" : "Ready to start your next adventure?"}
            </h2>
            <p className="text-gray-300 mb-10 text-lg max-w-2xl relative z-10 leading-relaxed font-sans">
              {isArabic
                ? "احجز الآن واستمتع بعروضنا الخاصة. فريقنا في انتظارك لترتيب جدول رحلتك بالكامل."
                : "Book now and enjoy our special offers. Our team is waiting to arrange your full trip schedule."}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full sm:w-auto">
              <Link href={`/${locale}/#services`} className="px-8 py-4 bg-gradient-to-r from-brand-orange to-[#ff3300] text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(255,107,0,0.4)] transition-all">
                {isArabic ? "تصفح البرامج والرحلات" : "Browse Trips & Services"}
              </Link>
              <Link href={`/${locale}/contact`} className="px-8 py-4 bg-transparent border-2 border-gray-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-white/5 transition-all">
                {isArabic ? "تواصل معنا للاستفسار" : "Contact Us for Inquiry"}
                <ArrowRight className="w-5 h-5 rtl:rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
