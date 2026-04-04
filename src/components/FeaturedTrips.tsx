"use client";

import { motion } from "framer-motion";
import { Star, Clock, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

interface FeaturedTripsProps {
  trips: any[];
}

export default function FeaturedTrips({ trips }: FeaturedTripsProps) {
  const locale = useLocale();
  const t = useTranslations("Index");

  if (!trips || trips.length === 0) return null;

  return (
    <section className="py-24 bg-brand-navy relative overflow-hidden" id="featured">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-cyan/5 rounded-full blur-[120px] -z-10" />

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white font-heading mb-4">
              Most Requested Trips 🔥
            </h2>
            <p className="text-gray-400 text-lg">
              Hand-picked experiences loved by thousands of our guests. Get ready for adventure!
            </p>
          </div>
          <Link 
            href={`/${locale}/services`} 
            className="text-brand-cyan font-bold flex items-center gap-2 hover:gap-3 transition-all group"
          >
            View All Trips
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trips.map((trip, idx) => {
            const tripUrl = `/${locale}/services/${trip.serviceId}/${trip.id}`;
            
            // Align image prioritization with the detail page
            const tripImages = trip.images && trip.images.length > 0 ? trip.images : (trip.imageUrl ? [trip.imageUrl] : []);
            const serviceImages = trip.service?.images && trip.service.images.length > 0 ? trip.service.images : (trip.service?.imageUrl ? [trip.service.imageUrl] : []);
            
            const displayImage = tripImages.length > 0 
              ? tripImages[0] 
              : (serviceImages.length > 0 ? serviceImages[0] : "/placeholder-trip.jpg");
            
            const tripName = trip.nameEn && trip.nameEn.trim() !== "" ? trip.nameEn : "Adventurous Trip";
            const tripDesc = trip.descriptionEn && trip.descriptionEn.trim() !== "" ? trip.descriptionEn : "Discover the magic of Hurghada with us.";
            const tripDur = trip.durationEn && trip.durationEn.trim() !== "" ? trip.durationEn : (trip.duration || "-");

            return (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-brand-navy-light/30 border border-gray-800 rounded-[2rem] overflow-hidden hover:border-brand-orange/40 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex flex-col"
              >
                {/* Full Card Link Overlay */}
                <Link href={tripUrl} className="absolute inset-0 z-20" aria-label={tripName} />

                {/* Image Container */}
                <div className="relative h-72 overflow-hidden">
                  <img 
                    src={displayImage} 
                    alt={tripName} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-transparent to-transparent opacity-60" />
                  
                  {/* Price Tag */}
                  {trip.price && (
                    <div className="absolute top-4 right-4 bg-brand-orange text-white px-4 py-1.5 rounded-full font-bold text-sm shadow-xl z-30">
                      {trip.price} <span className="text-[10px] font-normal opacity-80">EGP</span>
                    </div>
                  )}

                  {/* Badge */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 z-30">
                     <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                     <span className="text-white text-xs font-bold">4.9</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-orange transition-colors">
                    {tripName}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-6 line-clamp-2 min-h-[40px]">
                    {tripDesc}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-800 mt-auto">
                    <div className="flex items-center gap-4">
                      {tripDur && (
                         <div className="flex items-center gap-1.5 text-xs text-gray-500">
                           <Clock className="w-3.5 h-3.5 text-brand-cyan" />
                           <span>{tripDur}</span>
                         </div>
                      )}
                    </div>
                    <div 
                      className="bg-white/5 group-hover:bg-brand-cyan group-hover:text-brand-navy p-2.5 rounded-xl transition-all border border-white/5 relative z-10"
                    >
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
