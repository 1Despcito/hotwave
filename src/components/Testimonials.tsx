'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

const defaultTestimonials = [
  {
    name: 'Sarah Jenkins',
    location: 'United Kingdom',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    text: 'The sea trip to Orange Bay was the highlight of our holiday. The crew was fantastic, the food was great, and the snorkeling was out of this world. Highly recommend Hot Wave!',
    rating: 5,
  },
  {
    name: 'Marco Rossi',
    location: 'Italy',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    text: 'An unforgettable desert safari. Riding the quads at sunset and visiting the Bedouin camp was magical. Very well organized and safe.',
    rating: 5,
  },
  {
    name: 'Elena Schmidt',
    location: 'Germany',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
    text: 'We went horseback riding on the beach for my daughter\'s birthday. The horses were beautiful and well-cared for. Thank you for a beautiful memory.',
    rating: 5,
  },
];

export default function Testimonials({ initialTestimonials = [], locale = 'en' }: { initialTestimonials?: any[], locale?: string }) {
  const t = useTranslations('Testimonials');

  const displayTestimonials = initialTestimonials.length > 0 ? initialTestimonials.map((testm: any, idx) => ({
    name: locale === 'ar' ? (testm.name || testm.nameEn || '') : (testm.nameEn || testm.name || ''),
    location: locale === 'ar' ? (testm.role || testm.roleEn || '') : (testm.roleEn || testm.role || ''),
    text: locale === 'ar' ? (testm.content || testm.contentEn || '') : (testm.contentEn || testm.content || ''),
    image: testm.avatarUrl || defaultTestimonials[idx % defaultTestimonials.length].image,
    rating: 5, // currently DB doesn't have rating maybe? Assuming 5 for now
  })) : defaultTestimonials;

  return (
    <section className="py-24 bg-brand-navy-light relative overflow-hidden" id="testimonials">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-brand-cyan/50 to-transparent opacity-50" />
      
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
          {displayTestimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="bg-brand-navy/60 backdrop-blur-xl border border-gray-800/80 p-8 rounded-[2rem] relative group hover:border-brand-cyan/40 transition-all duration-500 shadow-2xl hover:shadow-[0_20px_50px_rgba(0,186,255,0.1)] rtl:text-right flex flex-col h-full"
            >
              <Quote className={`absolute top-6 ${locale === 'ar' ? 'left-6' : 'right-6'} w-12 h-12 text-gray-800/40 group-hover:text-brand-cyan/20 group-hover:-translate-y-1 transition-all duration-500 ${locale === 'ar' ? 'rotate-180' : ''}`} />
              
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-brand-orange text-brand-orange" />
                ))}
              </div>
              
              <p className="text-gray-300 font-sans leading-relaxed mb-8 relative z-10 flex-grow group-hover:text-white transition-colors duration-300 text-lg">
                &quot;{testimonial.text}&quot;
              </p>
              
              <div className="flex items-center gap-4 mt-auto border-t border-gray-800 pt-6">
                <div className="w-12 h-12 rounded-full overflow-hidden relative border-2 border-brand-navy-light shrink-0">
                  <Image 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-white font-bold font-heading text-base group-hover:text-brand-cyan transition-colors">{testimonial.name}</h4>
                  <span className="text-gray-400 text-xs font-sans tracking-wide uppercase">{testimonial.location}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
