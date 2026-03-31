import { prisma } from "@/lib/prisma";
import { ShieldAlert } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === 'ar' ? 'سياسة الخصوصية | Hot Wave' : 'Privacy Policy | Hot Wave',
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isArabic = locale === 'ar';
  
  const settings = await prisma.siteSettings.findFirst();
  const dynamicPolicy = isArabic ? settings?.privacyPolicy : settings?.privacyPolicyEn;
  const defaultPolicy = isArabic
    ? "نحن نهتم بخصوصيتك. لم يتم تحديث سياسة الخصوصية بعد من قبل الإدارة."
    : "We value your privacy. The privacy policy has not been updated yet by the administration.";
  
  const displayPolicy = dynamicPolicy || defaultPolicy;

  return (
    <main className="min-h-screen bg-brand-navy pt-32 lg:pt-40 pb-20">
      <section className="container mx-auto px-4 max-w-4xl relative">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-orange/10 rounded-full blur-[100px] -z-10" />
        
        <div className="flex flex-col items-center mb-12 text-center">
          <div className="w-16 h-16 bg-brand-orange/10 rounded-full flex items-center justify-center mb-6">
            <ShieldAlert className="w-8 h-8 text-brand-orange" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-heading mb-4">
            {isArabic ? "سياسة الخصوصية" : "Privacy Policy"}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-brand-orange to-brand-cyan mx-auto rounded-full" />
        </div>

        <div className="bg-[#111111] p-8 md:p-12 rounded-3xl border border-gray-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-orange to-brand-cyan" />
          <div className="prose prose-invert prose-orange max-w-none font-sans whitespace-pre-wrap leading-relaxed text-gray-300">
            {displayPolicy}
          </div>
        </div>
      </section>
    </main>
  );
}
