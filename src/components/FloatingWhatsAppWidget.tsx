"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import Image from "next/image";

export default function FloatingWhatsAppWidget({ whatsappNumber = "201066060000" }: { whatsappNumber?: string }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes wa-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes wa-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(37, 211, 102, 0.4), 0 0 40px rgba(37, 211, 102, 0.2); }
          50% { box-shadow: 0 0 30px rgba(37, 211, 102, 0.6), 0 0 60px rgba(37, 211, 102, 0.3); }
        }
        .wa-float { animation: wa-float 3s ease-in-out infinite; }
        .wa-glow { animation: wa-pulse 2s ease-in-out infinite; }
      `}} />

      <div className="fixed bottom-6 rtl:right-6 rtl:left-auto ltr:left-6 ltr:right-auto z-50">
        <div className="relative">
          <motion.a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className={`relative w-[65px] h-[65px] rounded-full flex items-center justify-center transition-all duration-500 wa-glow overflow-visible wa-float bg-[#25D366] text-white shadow-2xl`}
            aria-label="تواصل معنا عبر واتساب"
          >
            <MessageCircle size={32} className="fill-current" />
          </motion.a>
        </div>
      </div>
    </>
  );
}
