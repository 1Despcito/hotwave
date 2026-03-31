import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { Sailboat, Map, Tent, ArrowRight, ArrowLeft, ArrowUpRight, Waves, Mountain, Compass, Camera, Ghost } from 'lucide-react';
import { ServicesSearchGrid } from '@/components/ServicesSearchGrid';

const iconMap: Record<string, any> = {
  'Sailboat': <Sailboat className="w-5 h-5" />,
  'Map': <Map className="w-5 h-5" />,
  'Tent': <Tent className="w-5 h-5" />,
  'Waves': <Waves className="w-5 h-5" />,
  'Mountain': <Mountain className="w-5 h-5" />,
  'Compass': <Compass className="w-5 h-5" />,
  'Camera': <Camera className="w-5 h-5" />,
  'Ghost': <Ghost className="w-5 h-5" />,
};

interface ServiceCollection {
  id: string;
  title?: string;
  titleEn?: string;
  titleAr?: string;
  description?: string;
  descriptionEn?: string;
  descriptionAr?: string;
  image?: string;
  imageUrl?: string;
  icon?: string;
}

// Fallback data for empty DB
const fallbackCollections = [
  {
    id: 'sea-trips',
    title: 'Sea Trips', titleEn: 'Sea Trips', titleAr: 'الرحلات البحرية',
    description: 'Explore the vibrant coral reefs, swim with dolphins, and relax on pristine islands.',
    descriptionEn: 'Explore the vibrant coral reefs, swim with dolphins, and relax on pristine islands.',
    descriptionAr: 'استكشف الشعاب المرجانية النابضة بالحياة، اسبح مع الدلافين، واسترخ على جزر خلابة في البحر الأحمر.',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070',
  },
  {
    id: 'safari-adventures',
    title: 'Safari Adventures', titleEn: 'Safari Adventures', titleAr: 'رحلات السفاري',
    description: 'Conquer the desert dunes on a quad bike, visit Bedouin villages, and watch the sunset.',
    descriptionEn: 'Conquer the desert dunes on a quad bike, visit Bedouin villages, and watch the sunset.',
    descriptionAr: 'انطلق في مغامرات السفاري بالبيتش باجي، قم بزيارة القرى البدوية، وشاهد أجمل غروب للشمس في الصحراء.',
    image: 'https://images.unsplash.com/photo-1548574505-12caf0050b5b?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: 'horseback-riding',
    title: 'Horseback Riding', titleEn: 'Horseback Riding', titleAr: 'ركوب الخيل',
    description: 'Ride along the beach or through the desert trails, suitable for all experience levels.',
    descriptionEn: 'Ride along the beach or through the desert trails, suitable for all experience levels.',
    descriptionAr: 'استمتع بركوب الخيل على شاطئ البحر أو عبر المسارات الصحراوية، مناسب لجميع مستويات الخبرة.',
    image: 'https://images.unsplash.com/photo-1534142491173-0975608bfa79?auto=format&fit=crop&q=80&w=1000',
  }
];

export const revalidate = 3600;

export default async function ServicesCollectionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isArabic = locale === 'ar';
  
  // Try fetching from DB first
  const collectionsInDb = await prisma.service.findMany({
    orderBy: { createdAt: 'desc' },
  });
  
  let collections: any = collectionsInDb;

  // If not in DB or empty, use fallback mock data
  if (!collections || collections.length === 0) {
    collections = fallbackCollections;
  }

  const pageTitle = isArabic ? 'المجموعات السياحية' : 'Tour Collections';
  const pageDescription = isArabic 
    ? 'اكتشف مجموعاتنا السياحية المتنوعة من رحلات بحرية وسفاري ومغامرات مصممة خصيصاً لك.' 
    : 'Discover our diverse tour collections, from sea trips to safari adventures tailored just for you.';

  return (
    <main className="min-h-screen bg-brand-navy pb-24">
      {/* Dynamic Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-brand-navy bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-navy-light via-brand-navy to-black" />
          {/* Decorative Elements */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-cyan/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-orange/10 rounded-full blur-[100px] pointer-events-none" />
        </div>
        
        <div className="container relative z-10 px-4 text-center mt-12">
          <Link 
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-brand-cyan hover:text-white mb-8 transition-colors bg-brand-navy/50 px-4 py-2 rounded-full border border-brand-cyan/20 backdrop-blur-sm"
          >
            {isArabic ? <ArrowRight className="w-4 h-4 rtl:ml-2" /> : <ArrowLeft className="w-4 h-4 mr-2" />}
            {isArabic ? 'العودة للرئيسية' : 'Back to Home'}
          </Link>
          <h1 className="text-5xl md:text-7xl font-bold font-heading text-white mb-6 drop-shadow-lg">{pageTitle}</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto font-sans leading-relaxed drop-shadow-md">{pageDescription}</p>
        </div>
      </section>

      {/* Collections Grid Section with Search */}
      <ServicesSearchGrid collections={collections} locale={locale} iconMap={iconMap} />
    </main>
  );
}
