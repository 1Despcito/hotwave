import { notFound } from 'next/navigation';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { ArrowRight, ArrowLeft, Tag, CheckCircle2 } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import BookingButton from '@/components/BookingButton';

// Fallback data for empty DB
const fallbackServices = {
  'sea-trips': {
    title: 'Sea Trips', titleEn: 'Sea Trips', titleAr: 'الرحلات البحرية',
    description: 'Explore the vibrant coral reefs, swim with dolphins, and relax on pristine islands.',
    descriptionEn: 'Explore the vibrant coral reefs, swim with dolphins, and relax on pristine islands.',
    descriptionAr: 'استكشف الشعاب المرجانية النابضة بالحياة، اسبح مع الدلافين، واسترخ على جزر خلابة في البحر الأحمر.',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070',
    types: [
        { id: '1', name: 'Orange Bay', nameEn: 'Orange Bay', nameAr: 'جزيرة أورانج باي', price: '$35', duration: '8 Hours', includes: ['Lunch', 'Snorkeling Gear', 'Drinks'] },
        { id: '2', name: 'Paradise Island', nameEn: 'Paradise Island', nameAr: 'جزيرة بارادايس', price: '$40', duration: '8 Hours', includes: ['Lunch', 'Snorkeling Gear', 'Drinks', 'Show'] },
        { id: '3', name: 'Diving Experience', nameEn: 'Diving Experience', nameAr: 'تجربة الغوص', price: '$50', duration: '6 Hours', includes: ['Instructor', 'Diving Gear', '2 Dives', 'Drinks'] },
        { id: '4', name: 'Snorkeling Only', nameEn: 'Snorkeling Only', nameAr: 'سنوركلنج فقط', price: '$20', duration: '4 Hours', includes: ['Snorkeling Gear', 'Pick-up'] }
    ]
  },
  'safari-adventures': {
    title: 'Safari Adventures', titleEn: 'Safari Adventures', titleAr: 'رحلات السفاري',
    description: 'Conquer the desert dunes on a quad bike, visit Bedouin villages, and watch the sunset.',
    descriptionEn: 'Conquer the desert dunes on a quad bike, visit Bedouin villages, and watch the sunset.',
    descriptionAr: 'انطلق في مغامرات السفاري بالبيتش باجي، قم بزيارة القرى البدوية، وشاهد أجمل غروب للشمس في الصحراء.',
    image: 'https://images.unsplash.com/photo-1548574505-12caf0050b5b?auto=format&fit=crop&q=80&w=1000',
    types: [
        { id: '1', name: 'Quad Biking', nameEn: 'Quad Biking', nameAr: 'بيتش باجي', price: '$25', duration: '3 Hours', includes: ['Guide', 'Tea', 'Transfer'] },
        { id: '2', name: 'Bedouin Dinner', nameEn: 'Bedouin Dinner', nameAr: 'عشاء بدوي', price: '$45', duration: '5 Hours', includes: ['Dinner', 'Show', 'Stargazing'] },
        { id: '3', name: 'Jeep Safari', nameEn: 'Jeep Safari', nameAr: 'سفاري بالجيب', price: '$35', duration: '4 Hours', includes: ['4x4 Jeep', 'Bedouin Village', 'Tea'] }
    ]
  },
  'horseback-riding': {
    title: 'Horseback Riding', titleEn: 'Horseback Riding', titleAr: 'ركوب الخيل',
    description: 'Ride along the beach or through the desert trails, suitable for all experience levels.',
    descriptionEn: 'Ride along the beach or through the desert trails, suitable for all experience levels.',
    descriptionAr: 'استمتع بركوب الخيل على شاطئ البحر أو عبر المسارات الصحراوية، مناسب لجميع مستويات الخبرة.',
    image: 'https://images.unsplash.com/photo-1534142491173-0975608bfa79?auto=format&fit=crop&q=80&w=1000',
    types: [
        { id: '1', name: 'Beach Ride', nameEn: 'Beach Ride', nameAr: 'ركوب على الشاطئ', price: '$30', duration: '2 Hours', includes: ['Trainer', 'Helmet', 'Water'] },
        { id: '2', name: 'Desert Sunset', nameEn: 'Desert Sunset', nameAr: 'غروب الصحراء بالخيل', price: '$40', duration: '3 Hours', includes: ['Trainer', 'Tea', 'Snacks'] }
    ]
  }
};

export default async function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const isArabic = locale === 'ar';
  
  // Try fetching from DB first
  const [serviceDataInDb, settings] = await Promise.all([
    prisma.service.findUnique({
      where: { id },
      include: { types: true },
    }),
    prisma.siteSettings.findFirst()
  ]);
  
  let serviceData: any = serviceDataInDb;

  // If not in DB, use fallback mock data
  if (!serviceData && fallbackServices[id as keyof typeof fallbackServices]) {
    serviceData = fallbackServices[id as keyof typeof fallbackServices];
  }

  if (!serviceData) {
    notFound();
  }

  const title = isArabic ? (serviceData.titleAr || serviceData.title || serviceData.titleEn) : (serviceData.titleEn || serviceData.title);
  const description = isArabic ? (serviceData.descriptionAr || serviceData.description || serviceData.descriptionEn) : (serviceData.descriptionEn || serviceData.description);
  const imageUrl = serviceData.imageUrl || serviceData.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2070';

  return (
    <main className="min-h-screen bg-brand-navy pb-24">
      {/* Dynamic Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/60 to-black/30" />
        </div>
        
        <div className="container relative z-10 px-4 text-center mt-12">
          <Link 
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-brand-cyan hover:text-white mb-8 transition-colors bg-brand-navy/50 px-4 py-2 rounded-full border border-brand-cyan/20 backdrop-blur-sm"
          >
            {isArabic ? <ArrowRight className="w-4 h-4 rtl:ml-2" /> : <ArrowLeft className="w-4 h-4 mr-2" />}
            {isArabic ? 'العودة للرئيسية' : 'Back to Home'}
          </Link>
          <h1 className="text-5xl md:text-7xl font-bold font-heading text-white mb-6 drop-shadow-lg">{title}</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-sans leading-relaxed drop-shadow-md">{description}</p>
        </div>
      </section>

      {/* Packages Section */}
      <section className="container px-4 mx-auto -mt-20 relative z-20">
        <div className="bg-brand-navy-light/80 backdrop-blur-2xl border border-gray-800 rounded-3xl p-8 mb-12 shadow-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-4">
              {isArabic ? 'الباقات المتاحة' : 'Available Packages'}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-brand-orange to-brand-cyan mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceData.types.map((pkg: any, idx: number) => {
              const pkgName = isArabic ? (pkg.nameAr || pkg.name || pkg.nameEn) : (pkg.nameEn || pkg.name);
              const pkgPrice = pkg.price;
              
              // Handle includes parsing (comma separated in DB)
              let pkgIncludes = ['Guide', 'Water', 'Transfer']; // default mock
              const dbIncludesStr = isArabic ? (pkg.includes || pkg.includesEn) : (pkg.includesEn || pkg.includes);
              if (dbIncludesStr && typeof dbIncludesStr === 'string') {
                pkgIncludes = dbIncludesStr.split(',').map(item => item.trim()).filter(Boolean);
              } else if (Array.isArray(pkg.includes)) {
                pkgIncludes = pkg.includes;
              }

              const pkgDuration = isArabic ? (pkg.duration || pkg.durationEn) : (pkg.durationEn || pkg.duration);

              return (
                <div key={pkg.id || idx} className="bg-brand-navy border border-gray-700/50 rounded-2xl p-6 hover:border-brand-orange/50 hover:shadow-[0_10px_30px_rgba(255,107,0,0.1)] transition-all flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-2xl font-bold text-white font-heading">{pkgName}</h3>
                    {pkgPrice && (
                      <div className="bg-brand-cyan/10 text-brand-cyan px-3 py-1 rounded-full text-sm font-bold border border-brand-cyan/20">
                        {pkgPrice}
                      </div>
                    )}
                  </div>

                  {pkgDuration && (
                    <div className="inline-flex items-center gap-2 text-sm text-gray-400 mb-6 bg-black/20 w-fit px-3 py-1.5 rounded-lg border border-white/5">
                      ⏱️ {isArabic ? 'المدة:' : 'Duration:'} <span className="text-white font-medium">{pkgDuration}</span>
                    </div>
                  )}

                  <div className="flex-grow">
                    <h4 className="text-sm text-gray-400 mb-3 uppercase tracking-wider font-semibold">
                      {isArabic ? 'تشمل:' : 'Includes:'}
                    </h4>
                    <ul className="space-y-3 mb-8">
                      {pkgIncludes.map((item: string, i: number) => (
                        <li key={i} className="flex items-center gap-3 text-gray-300 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <BookingButton
                    serviceName={title}
                    packageName={pkgName}
                    whatsappNumber={(settings as any)?.whatsappNumber || "201110626484"}
                    message={`Hello Hot Wave! I want to book the "${pkgName}" package from the ${title} category.`}
                    className="w-full mt-auto py-3.5 bg-gradient-to-r from-brand-orange to-[#ff3300] text-white font-bold rounded-xl shadow-lg hover:shadow-brand-orange/30 border border-brand-orange/50 group/btn"
                  >
                    {isArabic ? 'احجز هذه الباقة' : 'Book This Package'}
                    <ArrowRight className="w-4 h-4 rtl:hidden group-hover/btn:translate-x-1 transition-transform" />
                    <ArrowRight className="w-4 h-4 hidden rtl:block rotate-180 group-hover/btn:-translate-x-1 transition-transform" />
                  </BookingButton>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
