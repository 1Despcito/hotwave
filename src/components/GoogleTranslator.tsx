"use client";

import { useEffect } from 'react';

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

export default function GoogleTranslator() {
  useEffect(() => {
    // Only run if we are in the browser
    if (typeof window === 'undefined') return;

    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,ar,ru,de,fr,it,es,pl',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          'google_translate_element'
        );
      }
    };

    // Add CSS to hide the Google Translate top bar and improve styling
    const style = document.createElement('style');
    style.innerHTML = `
      #google_translate_element {
        display: inline-block;
      }
      .goog-te-gadget-simple {
        background-color: rgba(255, 255, 255, 0.05) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        padding: 4px 8px !important;
        border-radius: 9999px !important;
        font-family: inherit !important;
        display: flex !important;
        align-items: center !important;
        transition: all 0.2s ease-in-out !important;
      }
      .goog-te-gadget-simple:hover {
        background-color: rgba(255, 255, 255, 0.1) !important;
        border-color: rgba(255, 94, 0, 0.4) !important;
      }
      .goog-te-gadget-icon {
        display: none !important;
      }
      .goog-te-menu-value {
        color: #e5e7eb !important;
        font-size: 13px !important;
        font-weight: 500 !important;
        display: flex !important;
        align-items: center !important;
        margin: 0 !important;
      }
      .goog-te-menu-value span {
        color: #e5e7eb !important;
      }
      .goog-te-menu-value:before {
        content: '🌐';
        margin-right: 6px;
        font-size: 14px;
      }
      .skiptranslate.goog-te-gadget {
        margin-top: 4px;
      }
      iframe.goog-te-banner-frame {
        display: none !important;
      }
      body {
        top: 0 !important;
      }
    `;
    document.head.appendChild(style);

    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <div className="google-translate-container">
      <div id="google_translate_element"></div>
    </div>
  );
}
