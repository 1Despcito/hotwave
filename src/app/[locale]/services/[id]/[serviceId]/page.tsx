import { notFound } from 'next/navigation';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { ArrowRight, ArrowLeft, Clock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

// Fallback data for empty DB just in case, similar to previous pages
const fallbackServices = {
  'sea-trips': {
    title: 'Sea Trips', titleEn: 'Sea Trips', titleAr: 'الرحلات البحرية',
    types: [
        { id: '1', name: 'Orange Bay', nameEn: 'Orange Bay', nameAr: 'جزيرة أورانج باي', description: 'Experience the crystal clear waters of Orange Bay...', descriptionAr: 'استمتع بالمياه الصافية في أورانج باي...', price: '$35', duration: '8 Hours', durationAr: '8 ساعات', includes: 'Lunch, Snorkeling Gear, Drinks', includesAr: 'غداء, معدات سنوركلنج, مشروبات', imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070' },
        { id: '2', name: 'Paradise Island', nameEn: 'Paradise Island', nameAr: 'جزيرة بارادايس', description: 'Visit Paradise Island...', descriptionAr: 'زيارة جزيرة بارادايس...', price: '$40', duration: '8 Hours', durationAr: '8 ساعات', includes: 'Lunch, Snorkeling Gear, Drinks, Show', includesAr: 'غداء, معدات, مشروبات, عرض', imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070' },
    ]
  },
  'safari-adventures': {
    title: 'Safari Adventures', titleEn: 'Safari Adventures', titleAr: 'رحلات السفاري',
    types: [
        { id: '1', name: 'Quad Biking', nameEn: 'Quad Biking', nameAr: 'بيتش باجي', description: 'Conquer the desert dunes...', descriptionAr: 'انطلق في مغامرات السفاري بالبيتش باجي...', price: '$25', duration: '3 Hours', durationAr: '3 ساعات', includes: 'Guide, Tea, Transfer', includesAr: 'مرشد, شاي, انتقالات', imageUrl: 'https://images.unsplash.com/photo-1548574505-12caf0050b5b?auto=format&fit=crop&q=80&w=1000' },
    ]
  }
};

export default async function DedicatedServicePage({
  params,
}: {
  params: Promise<{ locale: string; id: string; serviceId: string }>;
}) {
  const { locale, id, serviceId } = await params;
  const isArabic = locale === 'ar';
  
  // Try fetching from DB first
  const [collectionDataInDb, serviceDataInDb, settings] = await Promise.all([
    prisma.service.findUnique({ where: { id: id } }),
    prisma.serviceType.findUnique({ where: { id: serviceId } }),
    prisma.siteSettings.findFirst()
  ]);
  
  let collectionData: any = collectionDataInDb;
  let serviceData: any = serviceDataInDb;

  // If not in DB, try fallback mock data
  if (!collectionData && fallbackServices[id as keyof typeof fallbackServices]) {
    collectionData = fallbackServices[id as keyof typeof fallbackServices];
    serviceData = collectionData?.types.find((t: any) => t.id === serviceId);
  }

  if (!collectionData || !serviceData) {
    notFound();
  }

  // Titles
  const colTitle = isArabic ? (collectionData.titleAr || collectionData.title || collectionData.titleEn) : (collectionData.titleEn || collectionData.title);
  const srvTitle = isArabic ? (serviceData.nameAr || serviceData.name || serviceData.nameEn) : (serviceData.nameEn || serviceData.name);
  
  // Details
  const srvDesc = isArabic ? (serviceData.descriptionAr || serviceData.description || serviceData.descriptionEn) : (serviceData.descriptionEn || serviceData.description);
  const srvDuration = isArabic ? (serviceData.durationAr || serviceData.duration || serviceData.durationEn) : (serviceData.durationEn || serviceData.duration);
  const srvPrice = serviceData.price;
  const imageUrl = serviceData.imageUrl || collectionData.imageUrl || collectionData.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2070';
  
  // Includes Parsing
  let pkgIncludes = ['Guide', 'Water', 'Transfer'];
  const dbIncludesStr = isArabic ? (serviceData.includesAr || serviceData.includes || serviceData.includesEn) : (serviceData.includesEn || serviceData.includes);
  if (dbIncludesStr && typeof dbIncludesStr === 'string') {
    pkgIncludes = dbIncludesStr.split(',').map((item: string) => item.trim()).filter(Boolean);
  } else if (Array.isArray(serviceData.includes)) {
    pkgIncludes = serviceData.includes;
  }

  return (
    <main className="min-h-screen bg-[#050B14] pb-24 font-sans text-gray-200">
      {/* Dynamic Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={imageUrl}
            alt={srvTitle}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050B14] via-[#050B14]/70 to-black/40" />
        </div>
        
        <div className="container relative z-10 px-4 mt-20 flex flex-col items-center md:items-start text-center md:text-start" dir={isArabic ? 'rtl' : 'ltr'}>
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm md:text-base font-medium text-brand-cyan mb-6 bg-brand-navy/60 px-5 py-2.5 rounded-full border border-brand-cyan/20 backdrop-blur-md">
            <Link href={`/${locale}/services`} className="hover:text-white transition-colors">{isArabic ? 'المجموعات' : 'Collections'}</Link>
            <span className="text-gray-500">{isArabic ? '/' : '/'}</span>
            <Link href={`/${locale}/services/${id}`} className="hover:text-white transition-colors">{colTitle}</Link>
            <span className="text-gray-500">{isArabic ? '/' : '/'}</span>
            <span className="text-white">{srvTitle}</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold font-heading text-white mb-6 drop-shadow-2xl leading-tight">
            {srvTitle}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            {srvDuration && (
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-xl border border-white/10 text-white font-medium shadow-lg">
                <Clock className="w-5 h-5 text-brand-orange" />
                <span>{srvDuration}</span>
              </div>
            )}
            {srvPrice && (
              <div className="flex items-center gap-2 bg-brand-cyan/20 backdrop-blur-md px-5 py-2.5 rounded-xl border border-brand-cyan/30 text-brand-cyan font-bold shadow-lg text-lg tracking-wide">
                <span>{srvPrice}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="container px-4 mx-auto mt-12 relative z-20" dir={isArabic ? 'rtl' : 'ltr'}>
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Left Column (Details) */}
          <div className="w-full lg:w-2/3 flex flex-col gap-10">
            {/* Overview Card */}
            <div className="bg-brand-navy border border-gray-800 rounded-3xl p-8 md:p-10 shadow-2xl">
              <h2 className="text-2xl md:text-3xl font-bold text-white font-heading mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-brand-cyan rounded-full"></span>
                {isArabic ? 'نظرة عامة' : 'Overview'}
              </h2>
              <p className="text-gray-300 leading-relaxed text-lg mb-8 whitespace-pre-line">
                {srvDesc || (isArabic ? 'لا يوجد وصف متاح لهذه الخدمة في الوقت الحالي.' : 'No description available for this service right now.')}
              </p>

              <h3 className="text-xl font-bold text-white mb-5">
                {isArabic ? 'ماذا تشمل الرحلة؟' : 'What is Included?'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pkgIncludes.map((item: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 bg-[#0a1120] p-4 rounded-xl border border-gray-800">
                    <CheckCircle2 className="w-5 h-5 text-brand-cyan shrink-0" />
                    <span className="text-gray-300 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (Booking Form / Sticky) */}
          <div className="w-full lg:w-1/3 lg:sticky lg:top-24">
            <div className="bg-brand-navy-light/90 backdrop-blur-2xl border border-gray-700/50 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
              {/* Highlight Orbs */}
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-brand-orange/20 blur-[80px] rounded-full pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-brand-cyan/20 blur-[80px] rounded-full pointer-events-none" />
              
              <div className="relative z-10">
                <h3 className="text-2xl font-bold font-heading text-white mb-2">{isArabic ? 'احجز هذه الخدمة' : 'Book this Service'}</h3>
                <p className="text-sm text-brand-cyan mb-8">{colTitle} - {srvTitle}</p>
                
                {/* Embed Booking Form client component */}
                <BookingFormWidget 
                  serviceName={colTitle} 
                  packageName={srvTitle} 
                  isArabic={isArabic} 
                  whatsappNumber={(settings as any)?.whatsappNumber || "201110626484"}
                />
              </div>
            </div>
          </div>
          
        </div>
      </section>
    </main>
  );
}

// Inline Client Component for the Booking Form so we don't need a separate file if we don't want to,
// but actually Next.js App router allows client components in the same folder or we can just make it inline.
import { BookingFormWidget } from './BookingFormWidget';
