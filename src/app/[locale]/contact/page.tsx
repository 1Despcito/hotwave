import { prisma } from "@/lib/prisma";
import { Mail, Phone, MapPin, Search } from "lucide-react";
import Image from "next/image";
import ContactForm from "@/components/ContactForm";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === 'ar' ? 'تواصل معنا | Hot Wave' : 'Contact Us | Hot Wave',
    description: locale === 'ar' ? 'تواصل مع فريق Hot Wave لحجز رحلتك القادمة في البحر الأحمر.' : 'Contact the Hot Wave team to book your next Red Sea adventure.',
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isArabic = locale === 'ar';
  
  const settings = await prisma.siteSettings.findFirst();

  return (
    <main className="min-h-screen bg-brand-navy pt-32 lg:pt-40 pb-20">
      {/* Header Section */}
      <section className="container mx-auto px-4 text-center mb-16 relative">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-cyan/10 rounded-full blur-[100px] -z-10" />
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-heading mb-6 drop-shadow-lg flex flex-wrap justify-center items-center gap-3">
          <span>{isArabic ? "تواصل" : "Contact"}</span>
          <span className="text-brand-orange">{isArabic ? "معنا" : "Us"}</span>
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto font-sans">
          {isArabic 
            ? "نحن هنا للإجابة على جميع استفساراتك، سواء كنت ترغب في معرفة تفاصيل أكثر عن رحلاتنا أو المساعدة في تنظيم رحلة خاصة بك."
            : "We are here to answer all your questions, whether you want to know more about our trips or need help organizing a custom adventure."}
        </p>
      </section>

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Contact Info & Map */}
          <div className="space-y-12">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Phone Card */}
              <div className="bg-[#111111] p-6 rounded-2xl border border-gray-800 hover:border-brand-orange/50 transition-colors shadow-xl group">
                <div className="w-12 h-12 bg-brand-orange/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6 text-brand-orange" />
                </div>
                <h3 className="text-gray-400 font-medium mb-1 text-sm">{isArabic ? "رقم الهاتف / واتساب" : "Phone / WhatsApp"}</h3>
                <a href={`https://wa.me/${settings?.whatsappNumber || "201110626484"}`} target="_blank" rel="noopener noreferrer" className="text-xl font-bold text-white hover:text-brand-orange transition-colors" dir="ltr">
                  +{settings?.whatsappNumber || "201110626484"}
                </a>
              </div>

              {/* Email Card */}
              <div className="bg-[#111111] p-6 rounded-2xl border border-gray-800 hover:border-brand-cyan/50 transition-colors shadow-xl group">
                <div className="w-12 h-12 bg-brand-cyan/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6 text-brand-cyan" />
                </div>
                <h3 className="text-gray-400 font-medium mb-1 text-sm">{isArabic ? "البريد الإلكتروني" : "Email Address"}</h3>
                <a href={`mailto:${settings?.contactEmail || "info@hotwave-eg.com"}`} className="text-lg font-bold text-white hover:text-brand-cyan transition-colors truncate block">
                  {settings?.contactEmail || "info@hotwave-eg.com"}
                </a>
              </div>
            </div>

            {/* Address / Location */}
            <div className="bg-[#111111] p-6 md:p-8 rounded-2xl border border-gray-800 shadow-xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{isArabic ? "مقر الشركة" : "Our Location"}</h3>
                  <p className="text-gray-400 leading-relaxed max-w-md">
                    {isArabic 
                      ? "نعمل من قلب الغردقة، لتنظيم أروع الرحلات البحرية ورحلات السفاري للمسافرين من جميع أنحاء العالم. مكتبنا متاح للزيارة طوال أيام الأسبوع."
                      : "Operating from the heart of Hurghada, organizing the most spectacular sea trips and safaris for travelers worldwide. Our office is open all week."}
                  </p>
                </div>
              </div>

              {/* Google Maps iFrame */}
              <div className="w-full h-64 md:h-80 rounded-xl overflow-hidden border border-gray-700 shadow-lg relative bg-gray-900 group">
                <div className="absolute inset-0 flex items-center justify-center bg-brand-navy/80 z-10 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
                  <div className="flex flex-col items-center gap-3">
                    <Search className="w-8 h-8 text-brand-cyan opacity-80" />
                    <span className="text-white font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
                      {isArabic ? "تفاعل مع الخريطة" : "Interact with Map"}
                    </span>
                  </div>
                </div>
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112314.93510515152!2d33.81177651016839!3d27.241516086884042!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145287b47b416e75%3A0xeabff5fbe9feacc5!2sHurghada%2C%20Red%20Sea%20Governorate!5e0!3m2!1sen!2seg!4v1709400000000!5m2!1sen!2seg" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(100%)' }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="flex flex-col justify-center h-full">
            <ContactForm isArabic={isArabic} />
          </div>

        </div>
      </div>
    </main>
  );
}
