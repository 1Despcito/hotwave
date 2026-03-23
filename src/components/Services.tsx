'use client';

import { motion } from 'framer-motion';
import { Sailboat, Map, Tent, ArrowRight, Tag } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import BookingButton from '@/components/BookingButton';

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

export default function Services({ initialServices = [], locale = 'en', settings }: { initialServices?: any[], locale?: string, settings?: any }) {
  const t = useTranslations('Services');

  const displayServices = initialServices.length > 0
    ? initialServices.map((srv: any, idx: number) => ({
        title: locale === 'ar' ? (srv.title || srv.titleEn) : (srv.titleEn || srv.title),
        description: locale === 'ar' ? (srv.description || srv.descriptionEn) : (srv.descriptionEn || srv.description),
        icon: defaultServices[idx % defaultServices.length].icon,
        image: srv.imageUrl || defaultServices[idx % defaultServices.length].image,
        color: defaultServices[idx % defaultServices.length].color,
        emoji: defaultServices[idx % defaultServices.length].emoji,
        types: (srv.types || []).map((tp: any) => ({
          id: tp.id,
          name: locale === 'ar' ? (tp.name || tp.nameEn) : (tp.nameEn || tp.name),
          price: tp.price,
        })),
        id: srv.id || defaultServices[idx % defaultServices.length].id,
      }))
    : defaultServices;

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {displayServices.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="group relative rounded-[2rem] overflow-hidden min-h-[480px] flex flex-col justify-end shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(255,107,0,0.15)] rtl:text-right"
            >
              {/* Full Bleed Background Image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover scale-100 group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-brand-navy/60 to-brand-navy/95 group-hover:via-brand-navy/50 transition-colors duration-500" />
              </div>

              {/* Top Badge */}
              <div className="absolute top-6 right-6 z-20 bg-white/10 backdrop-blur-md rounded-full w-14 h-14 flex items-center justify-center text-3xl border border-white/20 shadow-lg rtl:left-6 rtl:right-auto group-hover:rotate-12 transition-transform duration-500">
                {service.emoji}
              </div>

              {/* Card Content (Bottom Aligned) */}
              <div className="p-8 relative z-10 flex flex-col h-full justify-end">
                <div className="mb-4 bg-white/10 backdrop-blur-md w-14 h-14 rounded-2xl flex items-center justify-center border border-white/20 shadow-inner group-hover:-translate-y-20 opacity-0 group-hover:opacity-100 absolute top-10 transition-all duration-500">
                  {service.icon}
                </div>

                <div className="transform transition-transform duration-500 group-hover:-translate-y-4">
                  <h3 className="text-3xl font-bold font-heading mb-3 text-white shadow-black/50 drop-shadow-lg">
                    {service.title}
                  </h3>
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
                  <div className="pt-2 flex flex-col gap-3">
                    <motion.a
                      href={`/${locale}/services/${service.id}`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-2xl flex items-center justify-center gap-3 border border-white/20 hover:bg-white/20 transition-all shadow-lg"
                    >
                      {locale === 'ar' ? 'استكشف الباقات والتفاصيل' : 'View Packages & Details'}
                    </motion.a>
                    
                    <BookingButton
                      serviceName={service.title}
                      whatsappNumber={(settings as any)?.whatsappNumber || "201110626484"}
                      message={`Hello Hot Wave! I'm interested in booking the "${service.title}" adventure.`}
                      className="w-full py-3.5 bg-gradient-to-r from-brand-orange to-[#ff3300] text-white font-bold rounded-2xl gap-3 group/btn shadow-[0_0_30px_rgba(255,94,0,0.3)] hover:shadow-[0_0_40px_rgba(255,94,0,0.6)] border border-white/10"
                    >
                      {locale === 'ar' ? 'احجز سريعاً' : 'Quick Book'}
                      <ArrowRight className="w-5 h-5 rtl:hidden group-hover/btn:translate-x-2 transition-transform duration-300" />
                      <ArrowRight className="w-5 h-5 hidden rtl:block rotate-180 group-hover/btn:-translate-x-2 transition-transform duration-300" />
                    </BookingButton>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
