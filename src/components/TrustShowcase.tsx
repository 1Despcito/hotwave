'use client';

import { motion } from 'framer-motion';
import { MapPin, Anchor, ShieldCheck, Flame } from 'lucide-react';
import { useLocale } from 'next-intl';

export default function TrustShowcase() {
  const locale = useLocale();
  const isArabic = locale === 'ar';

  return (
    <section className="py-24 bg-brand-navy relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-cyan/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3" />

      <div className="container px-4 mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-16">
        
        {/* Left Side: Text and Trust Signals */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-orange/10 border border-brand-orange/30 backdrop-blur-sm mb-6 rtl:flex-row-reverse w-fit shadow-[0_0_15px_rgba(255,94,0,0.15)]">
            <Flame className="w-4 h-4 text-brand-orange animate-pulse" />
            <span className="text-sm font-bold text-brand-orange tracking-wide uppercase rtl:tracking-normal">
              {isArabic ? 'التجربة رقم #1 في الغردقة' : '#1 Rated Experience in Hurghada'}
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6 text-white leading-tight">
            {isArabic ? 'لماذا يختارنا أكثر من ' : 'Why over '}
            <span className="text-brand-cyan">10,000</span>
            {isArabic ? ' مغامر سعيد؟' : ' Happy Adventurers Choose Us?'}
          </h2>
          
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            {isArabic 
              ? 'نحن لا نقدم مجرد رحلات، بل نصنع ذكريات تدوم. مع فريقنا المحترف وأسطولنا الحديث وتفانينا في تقديم الأفضل، نضمن لك تجربة لا تُنسى في البحر الأحمر وصحراء الغردقة الساحرة.' 
              : 'We don’t just offer trips; we craft lifelong memories. With our highly trained professionals, top-tier equipment, and dedication to excellence, your adventure in the Red Sea is guaranteed to be unforgettable.'}
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-brand-navy-light/40 p-4 rounded-2xl border border-white/5">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h4 className="font-bold text-white text-lg">{isArabic ? 'أمان تام وموثوقية' : '100% Safe & Reliable'}</h4>
                <p className="text-gray-400 text-sm">{isArabic ? 'مرشدون معتمدون ومعدات على أعلى مستوى.' : 'Certified guides and top-quality equipment.'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-brand-navy-light/40 p-4 rounded-2xl border border-white/5">
              <div className="w-12 h-12 rounded-full bg-brand-orange/20 flex items-center justify-center shrink-0">
                <Flame className="w-6 h-6 text-brand-orange" />
              </div>
              <div>
                <h4 className="font-bold text-white text-lg">{isArabic ? 'عروض لا تُنافس الحين' : 'Unbeatable Hot Deals'}</h4>
                <p className="text-gray-400 text-sm">{isArabic ? 'أفضل الأسعار بدون رسوم مخفية مفاجئة.' : 'Best prices guaranteed with zero hidden fees.'}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: The Visual Glass Card extracted from Hero */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2 relative flex justify-center w-full"
        >
          {/* Floating Decals */}
          <motion.div 
            animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }} 
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -top-10 -left-4 text-5xl opacity-80 drop-shadow-xl z-20"
          >
            ⛵
          </motion.div>
          <motion.div 
            animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }} 
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-10 -right-4 text-5xl opacity-80 drop-shadow-xl z-20"
          >
            🐪
          </motion.div>

          <div className="relative w-full max-w-sm aspect-square group">
              {/* Rotating glow ring */}
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-orange to-brand-cyan rounded-full animate-spin-slow opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500" />
              
              <div className="absolute inset-4 bg-brand-navy-light/40 backdrop-blur-xl rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] p-8 flex flex-col items-center justify-center overflow-hidden transition-transform duration-500 hover:scale-105">
                
                {/* Subtle Background pattern inside card */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />

                {/* Logo Centerpiece */}
                <div className="relative w-32 h-32 z-10 mb-8 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                  {/* Glowing Effect Background */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand-orange to-brand-cyan rounded-full blur-3xl opacity-25 animate-pulse" />
                  
                  {/* The Container Circle */}
                  <div className="relative w-full h-full bg-brand-navy-light/30 backdrop-blur-2xl rounded-full border border-white/10 flex items-center justify-center shadow-2xl overflow-hidden p-6 hover:shadow-[0_0_40px_rgba(0,229,255,0.4)] transition-shadow">
                    <img 
                      src="/logo.png" 
                      alt="Hot Wave Logo" 
                      className="w-full h-full object-contain filter drop-shadow-xl" 
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Quick features inside the visual card */}
                <div className="w-full space-y-3 z-10 relative">
                  <div className="flex items-center gap-3 bg-brand-navy/50 p-3 rounded-2xl border border-white/5 backdrop-blur-sm group-hover:border-brand-cyan/20 transition-all">
                     <MapPin className="w-5 h-5 text-brand-cyan" />
                     <span className="text-sm font-medium text-gray-300">Hurghada, Red Sea</span>
                  </div>
                  <div className="flex items-center gap-3 bg-brand-navy/50 p-3 rounded-2xl border border-white/5 backdrop-blur-sm group-hover:border-brand-orange/20 transition-all">
                     <Anchor className="w-5 h-5 text-brand-orange" />
                     <span className="text-sm font-medium text-gray-300">Sea & Desert Trips</span>
                  </div>
                </div>

              </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
