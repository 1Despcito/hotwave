'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import GoogleTranslator from './GoogleTranslator';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const t = useTranslations('Nav');
  const tHero = useTranslations('Hero');
  const locale = useLocale();

  const navLinks = [
    { name: t('home'), href: `/${locale}` },
    { name: t('services'), href: `/${locale}/services` },
    { name: t('about'), href: `/${locale}/about` },
    { name: t('testimonials'), href: `/${locale}/#testimonials` },
    { name: 'Contact Us', href: `/${locale}/contact` }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-brand-navy/80 backdrop-blur-md border-b border-gray-800 py-4 shadow-lg' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Brand */}
        <Link href={`/${locale}`} className="flex items-center gap-2 group">
          <img 
            src="/logo.png" 
            alt="Hot Wave Logo" 
            className="h-14 md:h-16 w-auto object-contain transition-transform group-hover:scale-105" 
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="font-sans text-sm font-medium text-gray-300 hover:text-white transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-cyan transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>
          
          <div className="hidden md:block w-px h-6 bg-gray-700" />

          {/* Re-added Google Translator */}
          <div className="scale-75 md:scale-100 origin-right">
            <GoogleTranslator />
          </div>

          <motion.a
            href="https://wa.me/201110626484"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden sm:inline-block px-5 py-2.5 bg-brand-orange text-white font-semibold rounded-full text-sm shadow-[0_0_15px_rgba(255,94,0,0.3)] hover:shadow-[0_0_20px_rgba(255,94,0,0.5)] transition-shadow"
          >
            {tHero('book')}
          </motion.a>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-brand-navy border-b border-gray-800 overflow-hidden"
          >
            <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="font-sans text-lg font-medium text-gray-300 hover:text-brand-cyan transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <a 
                href="https://wa.me/201110626484"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 px-6 py-3 bg-brand-orange text-white font-semibold rounded-full w-full text-center shadow-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {tHero('book')}
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
