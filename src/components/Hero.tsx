'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Anchor, MapPin, CalendarDays } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface HeroProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
}

export default function Hero({ title, subtitle, imageUrl }: HeroProps) {
  const t = useTranslations('Hero');

  const displayTitle = title || "Experience Hurghada Like Never Before";
  const displaySubtitle = subtitle || "Dive into crystal clear waters, conquer the desert dunes, and ride into the sunset. The ultimate Red Sea experience curated just for you.";
  const displayImageUrl = imageUrl || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2070&auto=format&fit=crop";

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Dynamic Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={displayImageUrl}
          alt="Hurghada Red Sea Background"
          fill
          className="object-cover opacity-30"
          priority
        />
        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/90 via-brand-navy/60 to-brand-navy" />
      </div>

      {/* ... [Rest of ornaments] ... */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-orange/30 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-1000" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-cyan/20 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <div className="container relative z-10 px-4 pt-20 pb-16 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Content Area */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-7 pt-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-navy-light/50 border border-brand-cyan/30 backdrop-blur-sm mb-8 rtl:flex-row-reverse w-fit">
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
              <span className="text-sm font-medium text-brand-cyan tracking-wide uppercase rtl:tracking-normal">Your Next Adventure Awaits</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6 tracking-tight leading-[1.1] whitespace-pre-wrap">
              {displayTitle}
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl font-sans leading-relaxed whitespace-pre-wrap">
              {displaySubtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-brand-orange to-[#ff3300] text-white font-bold rounded-full flex items-center justify-center gap-2 group shadow-[0_0_30px_rgba(255,94,0,0.5)] hover:shadow-[0_0_40px_rgba(255,94,0,0.7)] transition-all"
              >
                {t('book')}
                <ArrowRight className="w-5 h-5 rtl:hidden group-hover:translate-x-1 transition-transform" />
                <ArrowRight className="w-5 h-5 hidden rtl:block rotate-180 group-hover:-translate-x-1 transition-transform" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-brand-navy-light/80 text-white font-semibold rounded-full border border-gray-700 hover:border-brand-cyan transition-colors flex items-center justify-center backdrop-blur-md"
              >
                {t('explore')}
              </motion.button>
            </div>

            {/* Stats/Trust row */}
            <div className="flex items-center gap-8 text-sm font-medium text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-brand-cyan/10 flex items-center justify-center text-brand-cyan">
                  ⭐
                </div>
                <span>4.9/5 Rating</span>
              </div>
              <div className="w-px h-8 bg-gray-800" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                  👥
                </div>
                <span>10k+ Guests</span>
              </div>
            </div>
          </motion.div>

          {/* Visual/Booking Widget Area */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="lg:col-span-5 relative hidden md:block"
          >
            {/* The Logo Centerpiece integrated into a glass card */}
            <div className="relative w-full max-w-md mx-auto aspect-square group">
                {/* Rotating glow ring */}
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-orange to-brand-cyan rounded-full animate-spin-slow opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500" />
                
                <div className="absolute inset-4 bg-brand-navy-light/40 backdrop-blur-xl rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] p-8 flex flex-col items-center justify-center overflow-hidden">
                  
                  {/* Subtle Background pattern inside card */}
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />

                  <div className="relative w-48 h-48 drop-shadow-[0_0_30px_rgba(255,94,0,0.8)] z-10 mb-6 group-hover:scale-105 transition-transform duration-500">
                    <div className="absolute inset-0 bg-brand-navy rounded-full flex items-center justify-center text-white font-bold text-3xl overflow-hidden border-2 border-brand-orange/50">
                      <div className="w-full h-full bg-gradient-to-tr from-brand-orange to-brand-cyan flex items-center justify-center text-center leading-tight shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                        HOT<br/>WAVE
                      </div>
                    </div>
                  </div>

                  {/* Quick features inside the visual card */}
                  <div className="w-full space-y-3 z-10 relative">
                    <div className="flex items-center gap-3 bg-brand-navy/50 p-3 rounded-2xl border border-white/5 backdrop-blur-sm">
                       <MapPin className="w-5 h-5 text-brand-cyan" />
                       <span className="text-sm font-medium text-gray-300">Hurghada, Red Sea</span>
                    </div>
                    <div className="flex items-center gap-3 bg-brand-navy/50 p-3 rounded-2xl border border-white/5 backdrop-blur-sm">
                       <Anchor className="w-5 h-5 text-brand-orange" />
                       <span className="text-sm font-medium text-gray-300">Sea & Desert Trips</span>
                    </div>
                  </div>

                </div>
            </div>
            
            {/* Floating Decals */}
            <motion.div 
              animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }} 
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -top-4 -left-8 text-5xl opacity-80 drop-shadow-xl"
            >
              ⛵
            </motion.div>
            <motion.div 
              animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute top-1/2 -right-12 text-5xl opacity-80 drop-shadow-xl"
            >
              🐪
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* Decorative Wave at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-navy to-transparent z-20" />
    </section>
  );
}
