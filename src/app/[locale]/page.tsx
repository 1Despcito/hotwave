import Hero from '@/components/Hero';
import FeaturedTrips from '@/components/FeaturedTrips';
import Services from '@/components/Services';
import TrustShowcase from '@/components/TrustShowcase';
import About from '@/components/About';
import Testimonials from '@/components/Testimonials';
import { prisma } from '@/lib/prisma';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  // Parallel fetching for performance
  const [settings, dbServices, dbTestimonials, featuredTrips] = await Promise.all([
    prisma.siteSettings.findFirst(),
    prisma.service.findMany({ orderBy: { createdAt: 'asc' }, include: { types: { orderBy: { createdAt: 'asc' } } } }),
    prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.serviceType.findMany({ where: { featured: true }, take: 6 })
  ]);

  const heroTitle = locale === 'ar' ? settings?.heroTitle : settings?.heroTitleEn;
  const heroSubtitle = locale === 'ar' ? settings?.heroSubtitle : settings?.heroSubtitleEn;

  return (
    <main className="min-h-screen bg-brand-navy">
      <Hero 
        title={heroTitle || undefined} 
        subtitle={heroSubtitle || undefined} 
        imageUrl={settings?.heroImageUrl || undefined} 
        whatsappNumber={(settings as any)?.whatsappNumber || undefined}
      />
      
      <FeaturedTrips trips={featuredTrips} />

      <Services initialServices={dbServices} locale={locale} settings={settings} />
      <TrustShowcase />
      <About />
      <Testimonials initialTestimonials={dbTestimonials} locale={locale} />
    </main>
  );
}
