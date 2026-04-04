'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Anchor, MapPin, CalendarDays, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import AIChatWidget from './AIChatWidget';

interface HeroProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  whatsappNumber?: string;
}

export default function Hero({ title, subtitle, imageUrl, whatsappNumber = "201110626484" }: HeroProps) {
  const t = useTranslations('Hero');
  const locale = useLocale();

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
        <div className="flex flex-col items-center justify-center max-w-4xl mx-auto text-center">
          
          {/* Main Content Area */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="pt-10 flex flex-col items-center w-full"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-orange/10 border border-brand-orange/30 backdrop-blur-sm mb-8 w-fit shadow-[0_0_15px_rgba(255,94,0,0.15)]">
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
              <span className="text-sm font-bold text-brand-orange tracking-wide uppercase">
                🔥 Book now and get up to 20% off!
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6 tracking-tight leading-[1.1] whitespace-pre-wrap">
              {displayTitle}
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl font-sans leading-relaxed whitespace-pre-wrap">
              {displaySubtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6 w-full">
              <AIChatWidget 
                customTrigger={(toggle, isOpen) => (
                  <motion.button
                    onClick={(e: React.MouseEvent) => { e.preventDefault(); toggle(); }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-8 py-4 ${isOpen ? 'bg-brand-navy-light/80 border-brand-orange border' : 'bg-gradient-to-r from-[#ff6200] to-[#ff4500]'} text-white font-bold rounded-full flex items-center justify-center gap-3 group shadow-[0_0_30px_rgba(255,107,0,0.4)] hover:shadow-[0_0_40px_rgba(255,107,0,0.6)] transition-all`}
                  >
                    <div className="relative w-8 h-8 shrink-0 rounded-full overflow-hidden border border-white/30" style={{minWidth:'32px',minHeight:'32px'}}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/hotwave-bot.png" alt="" style={{width:'32px',height:'32px',objectFit:'cover',objectPosition:'top center'}} />
                    </div>
                    <div className="flex flex-col items-start leading-tight">
                      <span className="text-xs font-medium opacity-90">Ask our AI Assistant</span>
                      <span className="text-sm">Available 24/7 to help</span>
                    </div>
                  </motion.button>
                )} 
              />
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href={`/${locale}/services`}
                  className="px-8 py-4 bg-brand-navy-light/80 text-white font-semibold rounded-full border border-gray-700 hover:border-brand-cyan transition-colors flex items-center justify-center backdrop-blur-md h-full w-full"
                >
                  {t('explore')}
                </Link>
              </motion.div>
            </div>

            {/* Trust Badges - Conversion boosters */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-gray-300 mb-8 w-full">
               <div className="flex items-center gap-1.5">
                 <CheckCircle2 className="w-4 h-4 text-green-500" />
                 <span>Instant Confirmation</span>
               </div>
               <div className="flex items-center gap-1.5">
                 <CheckCircle2 className="w-4 h-4 text-green-500" />
                 <span>No Hidden Fees</span>
               </div>
               <div className="flex items-center gap-1.5">
                 <CheckCircle2 className="w-4 h-4 text-green-500" />
                 <span>Free Cancellation</span>
               </div>
            </div>

            {/* Stats/Trust row */}
            <div className="flex items-center justify-center gap-8 text-sm font-medium text-gray-400 w-full mb-8">
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
            
            {/* Thematic Element: Live Weather & Sea State Widget */}
            <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               transition={{ delay: 0.5, duration: 0.8 }}
               className="mt-4 p-4 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center gap-6 shadow-2xl max-w-sm w-full mx-auto"
            >
              <div className="flex items-center gap-3">
                <div className="text-4xl">☀️</div>
                <div className="flex flex-col text-left">
                  <span className="text-white font-bold text-xl leading-none">28°C</span>
                  <span className="text-brand-orange text-xs font-medium uppercase tracking-wider">Hurghada Today</span>
                </div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="flex flex-col text-left">
                <span className="text-brand-cyan font-bold text-sm">Sea State</span>
                <span className="text-xs text-gray-300">Perfect for snorkeling 🌊</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Interactive Floating Waves/Blobs */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none scale-110 lg:scale-100">
        <motion.div 
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }} 
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="absolute -top-[20%] -right-[10%] w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-cyan/20 via-transparent to-transparent blur-[120px]" 
        />
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, 30, 0] }} 
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="absolute -bottom-[10%] -left-[10%] w-[100%] h-[100%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-orange/15 via-transparent to-transparent blur-[120px]" 
        />
      </div>

      {/* Modern Wave SVG at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none overflow-hidden h-[200px] md:h-[300px]">
        <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-full opacity-60">
          <motion.path 
            initial={{ d: "M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,133.3C960,149,1056,203,1152,218.7C1248,235,1344,213,1392,202.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" }}
            animate={{ d: [
                "M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,133.3C960,149,1056,203,1152,218.7C1248,235,1344,213,1392,202.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                "M0,192L48,181.3C96,171,192,149,288,144C384,139,480,149,576,165.3C672,181,768,203,864,192C960,181,1056,139,1152,133.3C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                "M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,133.3C960,149,1056,203,1152,218.7C1248,235,1344,213,1392,202.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ]}}
            transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
            fill="url(#wave-gradient)" 
          />
          <defs>
            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#ff5e00" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>

        {/* Second layered wave for depth */}
        <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-full opacity-30 blur-[2px]">
          <motion.path 
             animate={{ d: [
                "M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                "M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,186.7C960,213,1056,235,1152,213.3C1248,192,1344,128,1392,96L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                "M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
             ]}}
             transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
             fill="#0ea5e9"
          />
        </svg>

        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy to-transparent opacity-100" />
      </div>
    </section>
  );
}
