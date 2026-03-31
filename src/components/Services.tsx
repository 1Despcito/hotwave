'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sailboat, Map, Tent, ArrowRight, Tag, Waves, Mountain, Compass, Camera, Ghost, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import BookingButton from '@/components/BookingButton';

// Icon Map for dynamic icons from DB
const iconMap: Record<string, any> = {
  'Sailboat': <Sailboat className="w-8 h-8 text-brand-cyan" />,
  'Map': <Map className="w-8 h-8 text-brand-orange" />,
  'Tent': <Tent className="w-8 h-8 text-yellow-500" />,
  'Waves': <Waves className="w-8 h-8 text-brand-cyan" />,
  'Mountain': <Mountain className="w-8 h-8 text-brand-orange" />,
  'Compass': <Compass className="w-8 h-8 text-brand-cyan" />,
  'Camera': <Camera className="w-8 h-8 text-brand-orange" />,
  'Ghost': <Ghost className="w-8 h-8 text-brand-cyan" />,
};

const defaultServices = [
  {
    title: 'Sea Trips',
    description: 'Explore the vibrant coral reefs, swim with dolphins, and relax on pristine islands.',
    icon: <Sailboat className="w-8 h-8 text-brand-cyan" />,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop',
    color: 'from-brand-cyan/20 to-transparent',
    emoji: '⛵',
    id: 'sea-trips',
    types: [
        { id: '1', name: 'Orange Bay', nameEn: 'Orange Bay', price: '$35' },
        { id: '2', name: 'Paradise Island', nameEn: 'Paradise Island', price: '$40' },
        { id: '3', name: 'Diving', nameEn: 'Diving', price: '$50' },
        { id: '4', name: 'Snorkeling', nameEn: 'Snorkeling', price: '$20' }
    ] as any[],
  },
  {
    title: 'Safari Adventures',
    description: 'Conquer the desert dunes on a quad bike, visit Bedouin villages, and watch the sunset.',
    icon: <Map className="w-8 h-8 text-brand-orange" />,
    image: 'https://images.unsplash.com/photo-1548574505-12caf0050b5b?auto=format&fit=crop&q=80&w=1000',
    color: 'from-brand-orange/20 to-transparent',
    emoji: '🏜️',
    id: 'safari-adventures',
    types: [
        { id: '1', name: 'Quad Biking', nameEn: 'Quad Biking', price: '$25' },
        { id: '2', name: 'Bedouin Dinner', nameEn: 'Bedouin Dinner', price: '$45' },
        { id: '3', name: 'Jeep Safari', nameEn: 'Jeep Safari', price: '$35' }
    ] as any[],
  },
  {
    title: 'Horseback Riding',
    description: 'Ride along the beach or through the desert trails, suitable for all experience levels.',
    icon: <Tent className="w-8 h-8 text-yellow-500" />,
    image: 'https://images.unsplash.com/photo-1534142491173-0975608bfa79?auto=format&fit=crop&q=80&w=1000',
    color: 'from-yellow-500/20 to-transparent',
    emoji: '🐎',
    id: 'horseback-riding',
    types: [
        { id: '1', name: 'Beach Ride', nameEn: 'Beach Ride', price: '$30' },
        { id: '2', name: 'Desert Sunset', nameEn: 'Desert Sunset', price: '$40' }
    ] as any[],
  },
];

export default function Services({ initialServices = [], locale = 'en', settings, showSearch = false }: { initialServices?: any[], locale?: string, settings?: any, showSearch?: boolean }) {
  const t = useTranslations('Services');
  const [searchQuery, setSearchQuery] = useState("");

  const displayServices = initialServices.length > 0
    ? initialServices.map((srv: any, idx: number) => {
        const dbIcon = srv.icon && iconMap[srv.icon] ? iconMap[srv.icon] : null;
        return {
          title: locale === 'ar' ? (srv.title || srv.titleEn) : (srv.titleEn || srv.title),
          description: locale === 'ar' ? (srv.description || srv.descriptionEn) : (srv.descriptionEn || srv.description),
          icon: dbIcon || defaultServices[idx % defaultServices.length].icon,
          image: (srv.images && srv.images.length > 0) ? srv.images[0] : (srv.imageUrl || defaultServices[idx % defaultServices.length].image),
          color: defaultServices[idx % defaultServices.length].color,
          emoji: defaultServices[idx % defaultServices.length].emoji,
          types: (srv.types || []).map((tp: any) => ({
            id: tp.id,
            name: locale === 'ar' ? (tp.name || tp.nameEn) : (tp.nameEn || tp.name),
            price: tp.price,
          })),
          id: srv.id || defaultServices[idx % defaultServices.length].id,
        };
      })
    : defaultServices;

  const filteredServices = displayServices.filter((srv: any) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const titleMatch = srv.title?.toLowerCase().includes(q) || false;
    const descMatch = srv.description?.toLowerCase().includes(q) || false;
    const tpMatch = srv.types?.some((tp: any) => tp.name?.toLowerCase().includes(q));
    return titleMatch || descMatch || tpMatch;
  });

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <section className="py-24 bg-brand-navy-light relative overflow-hidden" id="services">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-cyan/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3" />

      <div className="container px-4 mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold font-heading mb-4 text-white"
          >
            {t('title')} <span className="text-gradient">{t('title_gradient')}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto font-sans text-lg"
          >
            {t('subtitle')}
          </motion.p>
        </div>

        {showSearch && (
          <div className="max-w-2xl mx-auto mb-16 relative z-20 px-4">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative group w-full"
            >
              <div className="absolute inset-0 bg-brand-cyan/20 rounded-full blur-md group-hover:bg-brand-cyan/30 transition-all duration-300" />
              <div className="relative flex items-center bg-[#0d1627] rounded-full border border-gray-700/50 p-3 shadow-xl h-14">
                <Search className="w-5 h-5 text-gray-400 mx-4 shrink-0" />
                <input
                  type="text"
                  placeholder={locale === 'ar' ? "ابحث عن رحلة بحرية، سفاري، أورانج باي..." : "Search for sea trips, safari, orange bay..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-white placeholder-gray-500 font-sans outline-none text-lg rtl:ps-2 ltr:pe-2"
                />
              </div>
            </motion.div>
          </div>
        )}

        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto perspective-1000">
          {filteredServices.length > 0 ? (
            filteredServices.map((service: any, index: number) => (
              <CinematicCard 
                key={index}
                index={index}
                service={service}
                locale={locale}
                settings={settings}
                scrollYProgress={scrollYProgress}
              />
            ))
          ) : (
            <div className="col-span-1 md:col-span-3 text-center py-16">
              <Search className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold text-gray-300 mb-2">
                {locale === 'ar' ? 'لم يتم العثور على أي نتائج' : 'No results found'}
              </h3>
              <p className="text-gray-500 font-sans">
                {locale === 'ar' ? 'حاول البحث بكلمات مختلفة أو تعديل الفلاتر' : 'Try adjusting your search keywords'}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function CinematicCard({ service, index, locale, settings, scrollYProgress }: any) {
  // Staggered cinematic entrance and parallax scrolling
  // Middle items move slightly differently for depth
  const yOffset = index % 3 === 1 ? -60 : -20;
  
  const y = useTransform(scrollYProgress, [0, 0.4, 1], [150, 0, yOffset]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.4, 1], [0.85, 1, 1]);
  // Parallax for the background image
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);

  return (
    <motion.div
      style={{ y, opacity, scale }}
      className="group bg-[#111827] border border-gray-800/80 rounded-[2rem] overflow-hidden flex flex-col shadow-2xl transition-all duration-500 hover:shadow-[0_30px_60px_rgba(255,107,0,0.15)] hover:border-brand-orange/30 rtl:text-right relative"
    >
      {/* Invisible Overlay Link for the entire card */}
      <Link href={`/${locale}/services/${service.id}`} className="absolute inset-0 z-20" aria-label={`View details for ${service.title}`} />
      
      {/* Top Image Section - Clear and Unobstructed */}
      <div className="relative h-[260px] w-full overflow-hidden shrink-0">
        <motion.div style={{ scale: imageScale }} className="absolute inset-0 w-full h-full origin-bottom">
           <div className="w-full h-full transform transition-transform duration-700 ease-out group-hover:scale-110">
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover"
              />
           </div>
        </motion.div>
        
        {/* Soft bottom fade to blend with card */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#111827] to-transparent" />
        
        {/* Top Badge */}
        <div className="absolute top-4 right-4 z-10 bg-black/40 backdrop-blur-md rounded-full w-12 h-12 flex items-center justify-center text-2xl border border-white/20 shadow-lg rtl:left-4 rtl:right-auto group-hover:rotate-12 transition-transform duration-500">
          {service.emoji}
        </div>
      </div>

      {/* Card Content Content */}
      <div className="p-6 relative z-10 flex flex-col grow">
        <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-3xl font-bold font-heading text-white shadow-black/50 drop-shadow-lg">
                      {service.title}
                    </h3>
                    {index === 0 && (
                      <div className="flex flex-col items-end shrink-0">
                        <span className="text-[10px] bg-red-500/90 backdrop-blur-sm text-white font-bold uppercase tracking-widest px-2 py-1 rounded-md mb-1 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.6)] border border-red-400">🔥 {locale === 'ar' ? 'مطلوب بشدة' : 'High Demand'}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mb-3">
                     <div className="flex text-brand-orange text-sm drop-shadow-md">★★★★★</div>
                     <span className="text-xs text-brand-cyan font-bold bg-brand-navy-light/50 px-2 py-0.5 rounded-full border border-brand-cyan/20">
                        {locale === 'ar' ? '+2,400 مغامر سعيد' : '+2,400 Happy Bookers'}
                     </span>
                  </div>
                  <p className="text-gray-300 font-sans leading-relaxed mb-6 line-clamp-3 group-hover:line-clamp-none transition-all">
                    {service.description}
                  </p>

                  {/* Sub-items (Service Types) */}
                  {service.types && service.types.length > 0 && (
                    <div className="mb-6 flex flex-wrap gap-2">
                      {service.types.slice(0, 3).map((type: any) => (
                        <span
                          key={type.id}
                          className="inline-flex items-center gap-1.5 text-xs bg-black/40 backdrop-blur border border-white/10 text-gray-200 px-3 py-1.5 rounded-full"
                        >
                          <Tag className="w-3.5 h-3.5 text-brand-orange" />
                          {type.name}
                        </span>
                      ))}
                      {service.types.length > 3 && (
                        <span className="inline-flex items-center text-xs text-gray-400 px-2 py-1.5">
                          +{service.types.length - 3} {locale === 'ar' ? 'المزيد' : 'more'}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Main Call to Action Button */}
                  <div className="pt-2 flex flex-col gap-3 relative z-30">
                    <Link
                      href={`/${locale}/services/${service.id}`}
                      className="w-full py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-2xl flex items-center justify-center gap-3 border border-white/20 hover:bg-white/20 transition-all shadow-lg hover:scale-102 active:scale-95"
                    >
                      {locale === 'ar' ? 'استكشف الباقات والتفاصيل' : 'View Packages & Details'}
                    </Link>
                    
                    <BookingButton
                      serviceName={service.title}
                      whatsappNumber={(settings as any)?.whatsappNumber || "201110626484"}
                      message={`Hello Hot Wave! I'm interested in booking the "${service.title}" adventure.`}
                      className="w-full py-3.5 bg-gradient-to-r from-brand-orange to-[#ff3300] text-white font-bold rounded-2xl gap-3 group/btn shadow-[0_0_30px_rgba(255,94,0,0.3)] hover:shadow-[0_0_40px_rgba(255,94,0,0.6)] border border-white/10"
                    >
                      {locale === 'ar' ? 'احجز سريعاً' : 'Quick Book'}
                      <ArrowRight className="w-5 h-5 rtl:hidden group-hover/btn:translate-x-2 transition-transform duration-300" />
                    </BookingButton>
                  </div>
                </div>
              </div>
    </motion.div>
  );
}
