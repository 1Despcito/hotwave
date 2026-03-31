"use client";

import { ArrowRight, CheckCircle2, MessageCircle, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ServicePackageCardProps {
  pkg: any;
  serviceTitle: string; // The Collection title
  collectionId: string;
  whatsappNumber: string;
  isArabic: boolean;
}

export default function ServicePackageCard({
  pkg,
  serviceTitle,
  collectionId,
  whatsappNumber,
  isArabic,
}: ServicePackageCardProps) {

  const pkgName = isArabic ? (pkg.nameAr || pkg.name || pkg.nameEn) : (pkg.nameEn || pkg.name);
  const pkgPrice = pkg.price;
  
  let pkgIncludes = [];
  const dbIncludesStr = isArabic ? (pkg.includesAr || pkg.includes || pkg.includesEn) : (pkg.includesEn || pkg.includes);
  if (dbIncludesStr && typeof dbIncludesStr === 'string') {
    pkgIncludes = dbIncludesStr.split(',').map((item: string) => item.trim()).filter(Boolean);
  } else if (Array.isArray(pkg.includes)) {
    pkgIncludes = pkg.includes;
  }
  
  // Default includes if none provided
  if (pkgIncludes.length === 0) {
    pkgIncludes = isArabic ? ['مرشد سياحي', 'انتقالات', 'مشروبات'] : ['Guide', 'Transfer', 'Drinks'];
  }

  const pkgDuration = isArabic ? (pkg.durationAr || pkg.duration || pkg.durationEn) : (pkg.durationEn || pkg.duration);
  const pkgImage = (pkg.images && pkg.images.length > 0) ? pkg.images[0] : (pkg.imageUrl || null);
  const pkgDesc = isArabic ? (pkg.descriptionAr || pkg.description || pkg.descriptionEn) : (pkg.descriptionEn || pkg.description);

  // WhatsApp message
  const waMessage = isArabic
    ? `أهلاً، أرغب في حجز خدمة "${pkgName}" من مجموعة ${serviceTitle}.`
    : `Hello, I want to book the "${pkgName}" service from the ${serviceTitle} collection.`;

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMessage)}`, "_blank");
  };

  return (
    <div className="group bg-brand-navy border border-gray-700/50 rounded-[2rem] overflow-hidden hover:border-brand-orange/50 hover:shadow-[0_20px_50px_rgba(255,107,0,0.15)] transition-all duration-500 flex flex-col h-full relative">
      {/* Invisible Overlay Link for the entire card */}
      <Link href={`/${isArabic ? 'ar' : 'en'}/services/${collectionId}/${pkg.id}`} className="absolute inset-0 z-10" aria-label={`View details for ${pkgName}`} />

      {/* Top Image (if available) */}
      {pkgImage && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image 
            src={pkgImage} 
            alt={pkgName} 
            fill 
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy to-transparent opacity-60" />
          
          {pkgPrice && (
            <div className="absolute bottom-4 right-4 bg-brand-orange text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg border border-white/20">
              {pkgPrice}
            </div>
          )}
        </div>
      )}

      <div className="p-7 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-bold text-white font-heading leading-tight">{pkgName}</h3>
          {!pkgImage && pkgPrice && (
            <div className="bg-brand-orange/20 text-brand-orange px-3 py-1 rounded-full text-sm font-bold border border-brand-orange/30">
              {pkgPrice}
            </div>
          )}
        </div>

        {pkgDuration && (
          <div className="inline-flex items-center gap-2 text-xs text-gray-400 mb-5 bg-black/30 w-fit px-3 py-1.5 rounded-lg border border-white/5">
            <Clock className="w-3.5 h-3.5 text-brand-cyan" />
            <span className="text-gray-300 font-medium">{pkgDuration}</span>
          </div>
        )}

        {pkgDesc && (
            <p className="text-gray-400 text-sm mb-6 line-clamp-2 italic">
                {pkgDesc}
            </p>
        )}

        <div className="flex-grow">
          <h4 className="text-[10px] text-gray-500 mb-4 uppercase tracking-[0.2em] font-bold border-b border-white/5 pb-2">
            {isArabic ? 'تشمل الرحلة:' : 'What\'s Included:'}
          </h4>
          <ul className="space-y-3 mb-8">
            {pkgIncludes.map((item: string, i: number) => (
              <li key={i} className="flex items-center gap-3 text-gray-300 text-sm group/item">
                <CheckCircle2 className="w-4 h-4 text-brand-cyan shrink-0 transition-transform group-hover/item:scale-110" />
                <span className="group-hover/item:text-white transition-colors">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto flex flex-col gap-3 pt-4 border-t border-white/5 relative z-20">
          <Link
            href={`/${isArabic ? 'ar' : 'en'}/services/${collectionId}/${pkg.id}`}
            className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 flex items-center justify-center gap-2 transition-all active:scale-95 text-center group/link"
          >
            {isArabic ? 'استكشف التفاصيل' : 'View Full Details'}
            <ArrowRight className="w-4 h-4 rtl:hidden group-hover/link:translate-x-1 transition-transform" />
            <ArrowRight className="w-4 h-4 hidden rtl:block rotate-180 group-hover/link:-translate-x-1 transition-transform" />
          </Link>
          
          <button
            onClick={handleWhatsApp}
            className="w-full py-4 bg-gradient-to-r from-brand-orange to-[#ff4500] text-white font-bold rounded-2xl shadow-[0_10px_20px_rgba(255,107,0,0.2)] hover:shadow-[0_15px_30px_rgba(255,107,0,0.3)] flex items-center justify-center gap-3 transition-all active:scale-95"
          >
            <MessageCircle className="w-5 h-5" />
            {isArabic ? 'حجز عبر واتساب' : 'Book on WhatsApp'}
          </button>
        </div>
      </div>
    </div>
  );
}
