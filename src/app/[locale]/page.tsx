import Hero from '@/components/Hero';
import Services from '@/components/Services';
import About from '@/components/About';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';
import AIChatWidget from '@/components/AIChatWidget';
import { prisma } from '@/lib/prisma';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  // Parallel fetching for performance
  const [settings, dbServices, dbTestimonials] = await Promise.all([
    prisma.siteSettings.findFirst(),
    prisma.service.findMany({ orderBy: { createdAt: 'asc' }, include: { types: { orderBy: { createdAt: 'asc' } } } }),
    prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } })
  ]);

  const heroTitle = locale === 'ar' ? settings?.heroTitle : settings?.heroTitleEn;
  const heroSubtitle = locale === 'ar' ? settings?.heroSubtitle : settings?.heroSubtitleEn;

  return (
    <main className="min-h-screen bg-brand-navy">
      <Hero 
        title={heroTitle || undefined} 
        subtitle={heroSubtitle || undefined} 
        imageUrl={settings?.heroImageUrl || undefined} 
      />
      <About />
      <Services initialServices={dbServices} locale={locale} />
      <Testimonials initialTestimonials={dbTestimonials} locale={locale} />
      <Footer />
      <AIChatWidget />
    </main>
  );
}
