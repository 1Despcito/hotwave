import { BookingFormWidget } from '@/app/[locale]/services/[id]/[serviceId]/BookingFormWidget';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { ImageGallery } from '@/app/[locale]/services/[id]/[serviceId]/ImageGallery';
import { HeroSlider } from '@/app/[locale]/services/[id]/[serviceId]/HeroSlider';
import { PackageReviewsWidget } from '@/components/PackageReviewsWidget';
import { PriceDisplay } from '@/components/PriceDisplay';

export const revalidate = 3600; // 1 hour ISR

// Fallback data for empty DB - English only
const fallbackServices = {
  'sea-trips': {
    title: 'Sea Trips', titleEn: 'Sea Trips',
    types: [
        { id: '1', name: 'Orange Bay', nameEn: 'Orange Bay', description: 'Experience the crystal clear waters of Orange Bay...', price: '$35', duration: '8 Hours', includes: 'Lunch, Snorkeling Gear, Drinks', imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070' },
        { id: '2', name: 'Paradise Island', nameEn: 'Paradise Island', description: 'Visit Paradise Island...', price: '$40', duration: '8 Hours', includes: 'Lunch, Snorkeling Gear, Drinks, Show', imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070' },
    ]
  },
  'safari-adventures': {
    title: 'Safari Adventures', titleEn: 'Safari Adventures',
    types: [
        { id: '1', name: 'Quad Biking', nameEn: 'Quad Biking', description: 'Conquer the desert dunes...', price: '$25', duration: '3 Hours', includes: 'Guide, Tea, Transfer', imageUrl: 'https://images.unsplash.com/photo-1548574505-12caf0050b5b?auto=format&fit=crop&q=80&w=1000' },
    ]
  }
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string; serviceId: string }>;
}): Promise<Metadata> {
  const { id, serviceId } = await params;
  
  const [collectionDataInDb, serviceDataInDb] = await Promise.all([
    prisma.service.findUnique({ where: { id: id } }),
    prisma.serviceType.findUnique({ where: { id: serviceId } })
  ]);
  
  let collectionData: any = collectionDataInDb;
  let serviceData: any = serviceDataInDb;

  if (!collectionData && fallbackServices[id as keyof typeof fallbackServices]) {
    collectionData = fallbackServices[id as keyof typeof fallbackServices];
    serviceData = collectionData?.types.find((t: any) => t.id === serviceId);
  }

  if (!collectionData || !serviceData) {
    return { title: 'Package Not Found' };
  }

  const srvTitle = serviceData.nameEn || serviceData.name || 'Experience';
  const srvDesc = serviceData.descriptionEn || serviceData.description || 'Discover amazing adventures with Hot Wave.';
  
  const displayImages = (serviceData.images && serviceData.images.length > 0)
    ? serviceData.images
    : (serviceData.imageUrl ? [serviceData.imageUrl] : ['https://images.unsplash.com/photo-1551882547-ff43c63e1c04?q=80&w=2070']);

  return {
    title: `${srvTitle} | Hot Wave`,
    description: srvDesc,
    openGraph: {
      title: `${srvTitle} | Hot Wave`,
      description: srvDesc,
      images: [displayImages[0]],
    }
  };
}

export default async function DedicatedServicePage({
  params,
}: {
  params: Promise<{ locale: string; id: string; serviceId: string }>;
}) {
  const { id, serviceId } = await params;
  
  // Try fetching from DB first
  const [collectionDataInDb, serviceDataInDb, settings] = await Promise.all([
    prisma.service.findUnique({ where: { id: id } }),
    prisma.serviceType.findUnique({ 
      where: { id: serviceId },
      include: {
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: 'desc' },
        }
      }
    }),
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

  // Titles - Strict English
  const colTitle = collectionData.titleEn && collectionData.titleEn.trim() !== "" ? collectionData.titleEn : "Service Collection";
  const srvTitle = serviceData.nameEn && serviceData.nameEn.trim() !== "" ? serviceData.nameEn : "Experience Details";
  
  // Details - Strict English
  const srvDesc = serviceData.descriptionEn && serviceData.descriptionEn.trim() !== "" ? serviceData.descriptionEn : "A detailed description of this experience will be available in English soon.";
  const srvDuration = serviceData.durationEn && serviceData.durationEn.trim() !== "" ? serviceData.durationEn : (serviceData.duration || "Full Day");
  const srvPrice = serviceData.price;
  const dbImages = (serviceData.images && serviceData.images.length > 0) ? serviceData.images : (serviceData.imageUrl ? [serviceData.imageUrl] : []);
  const heroImage = dbImages.length > 0 ? dbImages[0] : (collectionData.imageUrl || collectionData.image || 'https://images.unsplash.com/photo-1551882547-ff43c63e1c04?q=80&w=2070');
  const images = dbImages.length > 0 ? dbImages : [heroImage];
  
  // Includes Parsing - Filter out Arabic
  let pkgIncludes = ['Guide', 'Water', 'Transfer'];
  const dbIncludesStr = serviceData.includesEn || serviceData.includes;
  if (dbIncludesStr && typeof dbIncludesStr === 'string' && !/[\u0600-\u06FF]/.test(dbIncludesStr)) {
    pkgIncludes = dbIncludesStr.split(',').map((item: string) => item.trim()).filter(Boolean);
  } else if (Array.isArray(serviceData.includes)) {
    pkgIncludes = serviceData.includes.filter((item: any) => typeof item === 'string' && !/[\u0600-\u06FF]/.test(item));
  }
  if (pkgIncludes.length === 0) pkgIncludes = ['Professional Guide', 'Insurance', 'Bottled Water'];

  // Not Includes Parsing
  let pkgNotIncludes: string[] = [];
  const dbNotIncludesStr = serviceData.notIncludesEn || serviceData.notIncludes;
  if (dbNotIncludesStr && typeof dbNotIncludesStr === 'string' && !/[\u0600-\u06FF]/.test(dbNotIncludesStr)) {
    pkgNotIncludes = dbNotIncludesStr.split(',').map((item: string) => item.trim()).filter(Boolean);
  }

  return (
    <main className="min-h-screen bg-[#050B14] pb-24 font-sans text-gray-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: srvTitle,
            description: srvDesc,
            image: images,
            offers: {
              "@type": "Offer",
              price: typeof srvPrice === 'number' ? srvPrice : (srvPrice?.toString().replace(/[^0-9.]/g, '') || "0"),
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
            }
          })
        }}
      />
      {/* Dynamic Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <HeroSlider images={images} title={srvTitle as string} />
        
        <div className="container relative z-10 px-4 mt-20 flex flex-col items-center md:items-start text-center md:text-start" dir="ltr">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm md:text-base font-medium text-brand-cyan mb-6 bg-brand-navy/60 px-5 py-2.5 rounded-full border border-brand-cyan/20 backdrop-blur-md">
            <Link href={`/en/services`} className="hover:text-white transition-colors">Collections</Link>
            <span className="text-gray-500">/</span>
            <Link href={`/en/services/${id}`} className="hover:text-white transition-colors">{colTitle}</Link>
            <span className="text-gray-500">/</span>
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
            {srvPrice != null && (
              <div className="flex items-center gap-2 bg-brand-cyan/20 backdrop-blur-md px-5 py-2.5 rounded-xl border border-brand-cyan/30 text-brand-cyan font-bold shadow-lg text-lg tracking-wide">
                <PriceDisplay price={srvPrice} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="container px-4 mx-auto mt-12 relative z-20" dir="ltr">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Left Column (Details) */}
          <div className="w-full lg:w-2/3 flex flex-col gap-10">
            {/* Overview Card */}
            <div className="bg-brand-navy border border-gray-800 rounded-3xl p-8 md:p-10 shadow-2xl">
              <h2 className="text-2xl md:text-3xl font-bold text-white font-heading mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-brand-cyan rounded-full"></span>
                Overview
              </h2>
              <p className="text-gray-300 leading-relaxed text-lg mb-8 whitespace-pre-line">
                {srvDesc}
              </p>

              <h3 className="text-xl font-bold text-white mb-5">
                What is Included?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pkgIncludes.map((item: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 bg-[#0a1120] p-4 rounded-xl border border-gray-800">
                    <CheckCircle2 className="w-5 h-5 text-brand-cyan shrink-0" />
                    <span className="text-gray-300 font-medium">{item}</span>
                  </div>
                ))}
              </div>

              {pkgNotIncludes.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-red-500 rounded-full"></span>
                    What is NOT Included?
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {pkgNotIncludes.map((item: string, i: number) => (
                      <div key={i} className="flex items-center gap-3 bg-red-500/5 p-4 rounded-xl border border-red-500/10 hover:bg-red-500/10 transition-colors">
                        <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                        <span className="text-gray-400 font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic Image Gallery */}
              <ImageGallery 
                images={images} 
                title={srvTitle as string} 
              />
            </div>
          </div>

          {/* Right Column (Booking Form / Sticky) */}
          <div className="w-full lg:w-1/3 lg:sticky lg:top-24">
            <div className="bg-brand-navy-light/90 backdrop-blur-2xl border border-gray-700/50 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
              {/* Highlight Orbs */}
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-brand-orange/20 blur-[80px] rounded-full pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-brand-cyan/20 blur-[80px] rounded-full pointer-events-none" />
              
              <div className="relative z-10">
                <h3 className="text-2xl font-bold font-heading text-white mb-2">Book this Service</h3>
                <p className="text-sm text-brand-cyan mb-8">{colTitle} - {srvTitle}</p>
                
                {/* Embed Booking Form client component */}
                <BookingFormWidget 
                  serviceName={colTitle} 
                  packageName={srvTitle} 
                  whatsappNumber={(settings as any)?.whatsappNumber || "201110626484"}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Reviews Section */}
        <PackageReviewsWidget 
          serviceTypeId={serviceId}
          isArabic={false}
          initialReviews={serviceData.reviews || []}
        />

        {/* Related Tours Section */}
        {(() => {
          const relatedTours = collectionData.types?.filter((t: any) => t.id !== serviceId).slice(0, 3) || [];
          if (relatedTours.length === 0) return null;
          
          return (
            <div className="mt-20 pt-16 border-t border-gray-800/50">
              <h3 className="text-3xl font-bold font-heading text-white mb-8">
                Other Tours You Might Like
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedTours.map((tour: any) => {
                  const rTitle = tour.nameEn && tour.nameEn.trim() !== "" ? tour.nameEn : "Discover More";
                  const rPrice = tour.price;
                  const rDuration = tour.durationEn && tour.durationEn.trim() !== "" ? tour.durationEn : (tour.duration || "Contact us");
                  const dbImgs = (tour.images && tour.images.length > 0) ? tour.images : (tour.imageUrl ? [tour.imageUrl] : []);
                  const rColImgs = (collectionData.images && collectionData.images.length > 0) ? collectionData.images : (collectionData.imageUrl ? [collectionData.imageUrl] : ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070']);
                  const rImage = dbImgs.length > 0 ? dbImgs[0] : rColImgs[0];
                  
                  return (
                    <Link key={tour.id} href={`/en/services/${id}/${tour.id}`} className="group block rounded-2xl overflow-hidden bg-brand-navy-light/50 border border-gray-800 hover:border-brand-cyan/40 transition-all duration-300 hover:shadow-lg hover:shadow-brand-cyan/10">
                      <div className="relative h-48 w-full overflow-hidden">
                        <Image src={rImage} alt={rTitle} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 to-transparent" />
                      </div>
                      <div className="p-5 relative z-10 -mt-8">
                        <h4 className="text-xl font-bold text-white mb-2 font-heading">{rTitle}</h4>
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-gray-400 text-sm flex items-center gap-1"><Clock className="w-4 h-4 text-brand-cyan" /> {rDuration}</span>
                          <span className="text-brand-orange font-bold font-heading text-lg bg-brand-orange/10 px-3 py-1 rounded-full border border-brand-orange/20">{rPrice}</span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          );
        })()}

      </section>
    </main>
  );
}
