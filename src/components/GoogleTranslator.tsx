'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { Languages } from 'lucide-react';

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

export default function GoogleTranslator() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Prepare the init function ON THE WINDOW before script loads
    window.googleTranslateElementInit = () => {
      // Robust check for the constructor
      if (typeof window.google?.translate?.TranslateElement === 'function') {
        new window.google.translate.TranslateElement({
          pageLanguage: 'en',
          layout: window.google.translate.InlineLayout?.SIMPLE || 0,
          multilanguagePage: true,
          autoDisplay: false
        }, 'google_translate_element');
      } else {
        // If not ready, wait and retry
        setTimeout(() => {
          if (window.googleTranslateElementInit) window.googleTranslateElementInit();
        }, 100);
      }
    };
  }, []);

  if (!mounted) return null;

  return (
    <>
      <Script
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center gap-0.5 group">
          <Languages className="w-4 h-4 text-brand-cyan group-hover:text-brand-orange transition-colors duration-300" />
          <span className="text-[8px] text-gray-500 uppercase tracking-tighter hidden lg:block group-hover:text-white transition-colors">Translate</span>
        </div>
        <div id="google_translate_element" className="google-translate-container min-h-[32px] min-w-[130px] border-l border-gray-800 pl-3" />
      </div>
    </>
  );
}

