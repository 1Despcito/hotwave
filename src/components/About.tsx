'use client';

import { motion } from 'framer-motion';
import { Compass, Shield, Users, Camera } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function About() {
  const t = useTranslations('About');

  const features = [
    {
      icon: <Compass className="w-6 h-6 text-brand-cyan" />,
      title: t('f1_title'),
      description: t('f1_desc'),
    },
    {
      icon: <Shield className="w-6 h-6 text-brand-orange" />,
      title: t('f2_title'),
      description: t('f2_desc'),
    },
    {
      icon: <Users className="w-6 h-6 text-yellow-500" />,
      title: t('f3_title'),
      description: t('f3_desc'),
    },
    {
      icon: <Camera className="w-6 h-6 text-green-400" />,
      title: t('f4_title'),
      description: t('f4_desc'),
    },
  ];

  return (
    <section className="py-24 bg-brand-navy relative overflow-hidden" id="about">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Image Grid */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-cyan/10 rounded-full blur-[100px] -z-10" />
            
            <div className="grid grid-cols-2 gap-4 rtl:flex-row-reverse">
              <div className="space-y-4 pt-12">
                <div className="relative h-64 rounded-3xl overflow-hidden shadow-2xl shadow-brand-cyan/20">
                  <Image 
                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000" 
                    alt="Snorkeling in Hurghada" 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div className="relative h-48 rounded-3xl overflow-hidden shadow-2xl shadow-brand-orange/20">
                  <Image 
                    src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=1000" 
                    alt="Desert Safari" 
                    fill 
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="relative h-48 rounded-3xl overflow-hidden shadow-2xl shadow-brand-orange/20">
                  <Image 
                    src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=1000" 
                    alt="Sunset over water" 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div className="relative h-64 rounded-3xl overflow-hidden bg-brand-navy-light border border-gray-800 p-6 flex flex-col justify-center">
                  <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-cyan mb-2">10+</div>
                  <div className="text-white font-heading text-xl">{t('years_exp')}</div>
                  <p className="text-gray-400 mt-2 font-sans text-sm">{t('years_exp_desc')}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6 text-white rtl:text-right">
              {t('title')} <span className="text-gradient">{t('subtitle')}</span>
            </h2>
            <p className="text-gray-300 font-sans text-lg mb-10 leading-relaxed rtl:text-right">
              {t('desc')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 rtl:text-right">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4 items-start group rtl:flex-row">
                  <div className="w-14 h-14 rounded-2xl bg-brand-navy-light/80 backdrop-blur flex items-center justify-center shrink-0 border border-gray-800 group-hover:border-brand-cyan/50 group-hover:bg-brand-cyan/10 transition-all shadow-inner">
                    {feature.icon}
                  </div>
                  <div className="rtl:pr-2">
                    <h4 className="text-white font-bold font-heading mb-2 text-lg group-hover:text-brand-cyan transition-colors">{feature.title}</h4>
                    <p className="text-gray-400 font-sans text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <motion.a
              href="#services"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-12 px-8 py-4 bg-brand-navy-light/50 backdrop-blur-md text-white font-bold rounded-2xl border border-gray-700 hover:border-brand-orange hover:bg-brand-orange/10 hover:shadow-[0_0_30px_rgba(255,94,0,0.2)] transition-all flex items-center gap-3 w-fit group"
            >
              {t('learn_more')}
              <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500 text-brand-orange" />
            </motion.a>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
