"use client";

import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import Link from "next/link";

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
  
  let pkgIncludes = ['Guide', 'Water', 'Transfer']; // default mock
  const dbIncludesStr = isArabic ? (pkg.includes || pkg.includesEn) : (pkg.includesEn || pkg.includes);
  if (dbIncludesStr && typeof dbIncludesStr === 'string') {
    pkgIncludes = dbIncludesStr.split(',').map((item: string) => item.trim()).filter(Boolean);
  } else if (Array.isArray(pkg.includes)) {
    pkgIncludes = pkg.includes;
  }

  const pkgDuration = isArabic ? (pkg.duration || pkg.durationEn) : (pkg.durationEn || pkg.duration);

  // WhatsApp message
  const waMessage = isArabic
    ? `أهلاً، أرغب في حجز خدمة "${pkgName}" من مجموعة ${serviceTitle}.`
    : `Hello, I want to book the "${pkgName}" service from the ${serviceTitle} collection.`;

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMessage)}`, "_blank");
  };

  return (
    <>
      <div className="bg-brand-navy border border-gray-700/50 rounded-2xl p-6 hover:border-brand-orange/50 hover:shadow-[0_10px_30px_rgba(255,107,0,0.1)] transition-all flex flex-col h-full">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-bold text-white font-heading">{pkgName}</h3>
          {pkgPrice && (
            <div className="bg-brand-cyan/10 text-brand-cyan px-3 py-1 rounded-full text-sm font-bold border border-brand-cyan/20">
              {pkgPrice}
            </div>
          )}
        </div>

        {pkgDuration && (
          <div className="inline-flex items-center gap-2 text-sm text-gray-400 mb-6 bg-black/20 w-fit px-3 py-1.5 rounded-lg border border-white/5">
            ⏱️ {isArabic ? 'المدة:' : 'Duration:'} <span className="text-white font-medium">{pkgDuration}</span>
          </div>
        )}

        <div className="flex-grow">
          <h4 className="text-sm text-gray-400 mb-3 uppercase tracking-wider font-semibold">
            {isArabic ? 'تشمل:' : 'Includes:'}
          </h4>
          <ul className="space-y-3 mb-8">
            {pkgIncludes.map((item: string, i: number) => (
              <li key={i} className="flex items-center gap-3 text-gray-300 text-sm">
                <CheckCircle2 className="w-4 h-4 text-brand-cyan shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto flex flex-col gap-3">
          {/* Main Book Now Button replaced by View Details */}
          <Link
            href={`/${isArabic ? 'ar' : 'en'}/services/${collectionId}/${pkg.id}`}
            className="w-full py-3.5 bg-gradient-to-r from-brand-orange to-[#ff3300] text-white font-bold rounded-xl shadow-lg hover:shadow-brand-orange/30 border border-brand-orange/50 group/btn flex items-center justify-center gap-2 transition-transform active:scale-95 text-center"
          >
            {isArabic ? 'التفاصيل والحجز' : 'Details & Booking'}
            <ArrowRight className="w-4 h-4 rtl:hidden group-hover/btn:translate-x-1 transition-transform" />
            <ArrowRight className="w-4 h-4 hidden rtl:block rotate-180 group-hover/btn:-translate-x-1 transition-transform" />
          </Link>
          
          {/* Secondary WhatsApp Button */}
          <button
            onClick={handleWhatsApp}
            className="w-full py-3.5 bg-[#25D366]/10 text-[#25D366] font-bold rounded-xl hover:bg-[#25D366]/20 border border-[#25D366]/20 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <MessageCircle className="w-5 h-5" />
            {isArabic ? 'تواصل عبر واتساب' : 'Contact via WhatsApp'}
          </button>
        </div>
      </div>
    </>
  );
}
