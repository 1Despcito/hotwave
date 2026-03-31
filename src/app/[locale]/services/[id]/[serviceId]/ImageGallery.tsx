"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageGalleryProps {
  images: string[];
  title: string;
  isArabic: boolean;
}

export function ImageGallery({ images, title, isArabic }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex]);

  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedIndex]);

  const handleNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % images.length);
  };

  const handlePrev = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
        <span className="w-1.5 h-6 bg-brand-orange rounded-full"></span>
        {isArabic ? "معرض الصور" : "Photo Gallery"}
      </h3>

      <div className="flex overflow-x-auto gap-4 pb-6 snap-x snap-mandatory hide-scrollbar rtl:space-x-reverse" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {images.map((img, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedIndex(idx)}
            className="relative flex-none w-[70vw] sm:w-72 md:w-80 h-48 md:h-64 rounded-2xl overflow-hidden border border-white/10 group cursor-pointer shadow-lg hover:border-brand-cyan/50 transition-all snap-center"
          >
            <Image
              src={img}
              alt={`${title} ${idx + 1}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 70vw, 320px"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                <Maximize2 className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal (Using Portal at root) */}
      {mounted && createPortal(
        <AnimatePresence>
          {selectedIndex !== null && (
            <div className="fixed inset-0 flex items-center justify-center p-4 md:p-8" style={{ zIndex: 9999999 }}>
              {/* Backing Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedIndex(null)}
                className="absolute inset-0 bg-black/90 backdrop-blur-xl"
              />

              {/* Close Button - Outside the card for clarity */}
              <button
                onClick={() => setSelectedIndex(null)}
                className="absolute top-8 right-8 z-[10000000] p-4 rounded-full bg-white/10 text-white hover:bg-brand-orange hover:scale-110 transition-all border border-white/20 shadow-2xl group"
                aria-label="Close"
              >
                <X className="w-8 h-8 group-hover:rotate-90 transition-transform" />
              </button>

              {/* Popup Content Box */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-5xl aspect-video md:aspect-[16/10] bg-brand-navy rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center z-[9999999]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Navigation Buttons */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                      className="absolute left-6 top-1/2 -translate-y-1/2 z-[10000000] p-4 rounded-full bg-black/40 text-white hover:bg-brand-cyan/50 hover:scale-110 transition-all border border-white/10 shadow-2xl backdrop-blur-md"
                    >
                      <ChevronLeft className="w-8 h-8" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleNext(); }}
                      className="absolute right-6 top-1/2 -translate-y-1/2 z-[10000000] p-4 rounded-full bg-black/40 text-white hover:bg-brand-orange/50 hover:scale-110 transition-all border border-white/10 shadow-2xl backdrop-blur-md"
                    >
                      <ChevronRight className="w-8 h-8" />
                    </button>
                  </>
                )}

                {/* Counter & Title Info */}
                <div className="absolute top-10 right-1/2 translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-[10000001]">
                  <div className="text-white font-extrabold bg-brand-orange px-6 py-2 rounded-full shadow-2xl tracking-widest text-base">
                    {selectedIndex + 1} <span className="text-black/50 mx-2">/</span> {images.length}
                  </div>
                </div>

                <div className="relative w-full h-full p-2 md:p-8 flex items-center justify-center overflow-hidden">
                  <AnimatePresence mode="popLayout" custom={selectedIndex}>
                    <motion.div
                      key={selectedIndex}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.2}
                      onDragEnd={(e, { offset, velocity }) => {
                        const swipe = Math.abs(offset.x) * velocity.x;
                        const rtlDir = isArabic ? -1 : 1;
                        if (swipe < -10000 || offset.x < -50) rtlDir === 1 ? handleNext() : handlePrev();
                        else if (swipe > 10000 || offset.x > 50) rtlDir === 1 ? handlePrev() : handleNext();
                      }}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="absolute w-full h-full p-2 md:p-8 flex items-center justify-center"
                    >
                      <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-black/20 touch-none">
                        <Image
                          src={images[selectedIndex]}
                          alt={title}
                          fill
                          className="object-contain pointer-events-none"
                          priority
                          sizes="80vw"
                        />
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
