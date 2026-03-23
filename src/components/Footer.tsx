'use client';

import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="bg-brand-navy border-t border-gray-800 pt-16 pb-8">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold font-heading mb-4 text-white">
              HOT <span className="text-brand-orange">WAVE</span>
            </h3>
            <p className="text-gray-400 font-sans leading-relaxed mb-6">
              {t('brand_desc')}
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-brand-navy-light text-gray-400 flex items-center justify-center hover:bg-brand-orange hover:text-white transition-colors border border-gray-800">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-brand-navy-light text-gray-400 flex items-center justify-center hover:bg-brand-orange hover:text-white transition-colors border border-gray-800">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-brand-navy-light text-gray-400 flex items-center justify-center hover:bg-brand-orange hover:text-white transition-colors border border-gray-800">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6">{t('quick_links')}</h4>
            <ul className="space-y-3 font-sans text-gray-400">
              <li><a href="#" className="hover:text-brand-cyan transition-colors">{t('link_home')}</a></li>
              <li><a href="#services" className="hover:text-brand-cyan transition-colors">{t('link_services')}</a></li>
              <li><a href="#" className="hover:text-brand-cyan transition-colors">{t('link_about')}</a></li>
              <li><a href="#" className="hover:text-brand-cyan transition-colors">{t('link_contact')}</a></li>
            </ul>
          </div>

          {/* Adventures */}
          <div>
            <h4 className="text-white font-semibold mb-6">{t('adventures')}</h4>
            <ul className="space-y-3 font-sans text-gray-400">
              <li><a href="#" className="hover:text-brand-orange transition-colors">{t('adv_sea')}</a></li>
              <li><a href="#" className="hover:text-brand-orange transition-colors">{t('adv_safari')}</a></li>
              <li><a href="#" className="hover:text-brand-orange transition-colors">{t('adv_horse')}</a></li>
              <li><a href="#" className="hover:text-brand-orange transition-colors">{t('adv_city')}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-6">{t('contact_us')}</h4>
            <ul className="space-y-4 font-sans text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-cyan shrink-0 mt-0.5" />
                <span>{t('address')}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand-cyan shrink-0" />
                <span>+20 123 456 7890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-cyan shrink-0" />
                <span>info@hotwave-eg.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between text-gray-500 font-sans text-sm">
          <p>&copy; {new Date().getFullYear()} Hot Wave Tourism. {t('rights')}</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">{t('privacy')}</a>
            <a href="#" className="hover:text-white transition-colors">{t('terms')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
