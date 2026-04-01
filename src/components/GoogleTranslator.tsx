'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

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
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-gray-500 uppercase tracking-widest hidden lg:block">Translate</span>
        <div id="google_translate_element" className="google-translate-container min-h-[40px] min-w-[140px]" />
      </div>
    </>
  );
}

