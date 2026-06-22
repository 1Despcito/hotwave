'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';

export function ServicesSearchGrid({ collections, locale, iconMap }: { collections: any; locale: string; iconMap: any }) {
  const isArabic = locale === 'ar';
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCollections = collections.filter((col: any) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    
    const titleMatch = (col.title?.toLowerCase().includes(q) || col.titleEn?.toLowerCase().includes(q) || col.titleAr?.toLowerCase().includes(q));
    const descMatch = (col.description?.toLowerCase().includes(q) || col.descriptionEn?.toLowerCase().includes(q) || col.descriptionAr?.toLowerCase().includes(q));
    
    return titleMatch || descMatch;
  });

  return (
    <section className="container px-4 mx-auto -mt-10 relative z-20">
      
      {/* Search Bar */}
      <div className="max-w-3xl mx-auto mb-16 relative">
        <div className="absolute inset-0 bg-brand-cyan/20 rounded-full blur-md" />
        <div className="relative flex items-center bg-[#0d1627] rounded-full border border-gray-700/50 p-4 shadow-xl h-16">
          <Search className="w-6 h-6 text-gray-400 mx-4 shrink-0" />
          <input
            type="text"
            placeholder={isArabic ? "ابحث عن المجموعات السياحية (مثال: رحلات بحرية)..." : "Search tour collections (e.g. Sea Trips)..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-white placeholder-gray-500 font-sans outline-none text-xl rtl:ps-2 ltr:pe-2"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
        {filteredCollections.length > 0 ? (
          filteredCollections.map((col: any) => {
            const title = isArabic ? (col.titleAr || col.title || col.titleEn) : (col.titleEn || col.title);
            const description = isArabic ? (col.descriptionAr || col.description || col.descriptionEn) : (col.descriptionEn || col.description);
            const imageUrl = (col.images && col.images.length > 0) ? col.images[0] : (col.imageUrl || col.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2070');

            return (
              <Link key={col.id} href={`/${locale}/services/${col.id}`} className="group relative block overflow-hidden rounded-3xl bg-brand-navy-light/80 border border-gray-800 shadow-2xl hover:border-brand-cyan/50 hover:shadow-[0_10px_40px_rgba(0,229,255,0.15)] transition-all duration-500 flex flex-col items-center">
                <div className="relative w-full h-64 overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={title || 'Collection Image'}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/40 to-transparent" />
                </div>
                
                <div className="relative w-full p-8 flex flex-col flex-grow -mt-8">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col gap-2">
                        {col.icon && iconMap[col.icon] && (
                            <div className="w-10 h-10 rounded-xl bg-brand-cyan/20 flex items-center justify-center text-brand-cyan border border-brand-cyan/30 mb-2 shadow-lg">
                                {iconMap[col.icon]}
                            </div>
                        )}
                        <h2 className="text-3xl font-bold text-white font-heading">{title}</h2>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-brand-cyan/10 flex items-center justify-center text-brand-cyan border border-brand-cyan/20 group-hover:bg-brand-cyan group-hover:text-brand-navy transition-colors shrink-0">
                      <ArrowUpRight className="w-5 h-5 rtl:hidden" />
                      <ArrowUpRight className="w-5 h-5 hidden rtl:block rotate-[-90deg]" />
                    </div>
                  </div>
                  
                  <p className="text-gray-400 mb-6 leading-relaxed flex-grow">
                    {description}
                  </p>

                  <div className="flex items-center gap-2 text-brand-cyan font-bold mt-auto group-hover:text-brand-orange transition-colors">
                    {isArabic ? 'استكشف الخدمات' : 'Explore Services'}
                    {isArabic ? <ArrowLeft className="w-4 h-4 ml-2 rtl:hidden group-hover:-translate-x-2 transition-transform" /> : <ArrowRight className="w-4 h-4 rtl:hidden group-hover:translate-x-2 transition-transform" />}
                    {isArabic ? <ArrowLeft className="w-4 h-4 hidden rtl:block rotate-180 group-hover:translate-x-2 transition-transform" /> : null}
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20">
            <Search className="w-20 h-20 text-gray-600 mx-auto mb-6 opacity-30" />
            <h3 className="text-2xl font-bold text-white mb-3">
              {isArabic ? 'لم يتم العثور على أي مجموعات' : 'No collections found'}
            </h3>
            <p className="text-gray-400 font-sans text-lg">
              {isArabic ? 'حاول البحث بكلمات مختلفة مثل بحر، سفاري، غوص...' : 'Try adjusting your search terms like sea, safari, diving...'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
