"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocale } from "next-intl";

export default function FloatingWhatsAppWidget({ whatsappNumber = "201066060000" }: { whatsappNumber?: string }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const locale = useLocale();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-8 rtl:left-8 ltr:right-8 z-[100] flex flex-col items-end gap-4">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8, x: locale === 'ar' ? -20 : 20 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] max-w-[240px]"
          >
            <button 
              onClick={() => setShowTooltip(false)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-brand-navy rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-orange/20 flex items-center justify-center shrink-0 border border-brand-orange/30">
                <span className="text-lg">👋</span>
              </div>
              <div>
                <p className="text-white font-bold text-sm mb-1">
                  {locale === 'ar' ? 'أهلاً بك في Hot Wave!' : 'Welcome to Hot Wave!'}
                </p>
                <p className="text-white/70 text-xs leading-relaxed">
                  {locale === 'ar' 
                    ? 'كيف يمكننا مساعدتك في التخطيط لرحلتك القادمة؟' 
                    : 'How can we help you plan your next adventure?'}
                </p>
              </div>
            </div>
            {/* Arrow */}
            <div className={`absolute bottom-[-8px] ${locale === 'ar' ? 'left-6' : 'right-6'} w-4 h-4 bg-white/10 backdrop-blur-xl border-r border-b border-white/20 rotate-45 -z-10`} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative group">
        {/* Pulse Ring */}
        <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 group-hover:opacity-40 transition-opacity" />
        
        <motion.a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          className="relative w-16 h-16 rounded-3xl bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center shadow-[0_15px_30px_rgba(37,211,102,0.4)] border border-white/20 overflow-hidden"
          aria-label="Contact us on WhatsApp"
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-[shine_1.5s_infinite]" />
          
          <MessageCircle size={32} className="text-white fill-white/10" />
          
          {/* Status Indicator */}
          <div className="absolute top-3 right-3 w-3 h-3 bg-white rounded-full border-2 border-[#25D366] flex items-center justify-center">
             <div className="w-1.5 h-1.5 bg-[#25D366] rounded-full animate-pulse" />
          </div>
        </motion.a>

        {/* CSS for custom shine animation */}
        <style jsx>{`
          @keyframes shine {
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    </div>
  );
}

