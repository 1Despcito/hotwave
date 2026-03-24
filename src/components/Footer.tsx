'use client';

import { Facebook, Instagram, MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

export default function Footer({ settings }: { settings?: any }) {
  const t = useTranslations('Footer');
  const locale = useLocale();

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
              <a href={(settings as any)?.facebookUrl || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-brand-navy-light text-gray-400 flex items-center justify-center hover:bg-brand-orange hover:text-white transition-colors border border-gray-800">
                <Facebook className="w-5 h-5" />
              </a>
              <a href={(settings as any)?.instagramUrl || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-brand-navy-light text-gray-400 flex items-center justify-center hover:bg-brand-orange hover:text-white transition-colors border border-gray-800">
                <Instagram className="w-5 h-5" />
              </a>
              <a href={(settings as any)?.tiktokUrl || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-brand-navy-light text-gray-400 flex items-center justify-center hover:bg-brand-orange hover:text-white transition-colors border border-gray-800">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 15.68a6.34 6.34 0 006.27 6.36 6.33 6.33 0 006.25-6.36V7.94a8.09 8.09 0 005.66 2.13V6.62a5.44 5.44 0 01-3.59-1.93z" /></svg>
              </a>
              <a href={`https://wa.me/${(settings as any)?.whatsappNumber || "201110626484"}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-brand-navy-light text-gray-400 flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors border border-gray-800" aria-label="WhatsApp">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6">{t('quick_links')}</h4>
            <ul className="space-y-3 font-sans text-gray-400">
              <li><Link href={`/${locale}`} className="hover:text-brand-cyan transition-colors">{t('link_home')}</Link></li>
              <li><Link href={`/${locale}/#services`} className="hover:text-brand-cyan transition-colors">{t('link_services')}</Link></li>
              <li><Link href={`/${locale}/about`} className="hover:text-brand-cyan transition-colors">{t('link_about')}</Link></li>
              <li><Link href={`/${locale}/contact`} className="hover:text-brand-cyan transition-colors">{t('link_contact')}</Link></li>
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
                <a href={`tel:${(settings as any)?.whatsappNumber || "201110626484"}`} className="hover:text-brand-cyan transition-colors" dir="ltr">
                  {(settings as any)?.whatsappNumber ? `+${(settings as any).whatsappNumber}` : "+201110626484"}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-cyan shrink-0" />
                <a href={`mailto:${(settings as any)?.contactEmail || "info@hotwave-eg.com"}`} className="hover:text-brand-cyan transition-colors">
                  {(settings as any)?.contactEmail || "info@hotwave-eg.com"}
                </a>
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
