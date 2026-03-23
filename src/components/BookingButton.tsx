"use client";

import { useState } from "react";
import { MessageCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface BookingButtonProps {
  serviceName: string;
  packageName?: string;
  whatsappNumber: string;
  message: string;
  className?: string;
  children?: React.ReactNode;
}

export default function BookingButton({
  serviceName,
  packageName,
  whatsappNumber,
  message,
  className = "",
  children
}: BookingButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleBooking = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      // 1. Send lead to our database
      await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceName,
          packageName: packageName || null,
          notes: "Initiated from Website UI",
        }),
      });
    } catch (e) {
      console.error("Booking tracking failed", e);
    } finally {
      // 2. Redirect to WhatsApp regardless of tracking success
      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleBooking}
      disabled={isLoading}
      className={`relative overflow-hidden flex items-center justify-center gap-2 ${className}`}
    >
      <div className="absolute inset-0 bg-white/20 translate-y-full hover:translate-y-0 transition-transform duration-300" />
      {isLoading ? (
        <span className="relative z-10 flex items-center justify-center gap-2 font-bold"><Loader2 className="w-5 h-5 animate-spin" /> جاري التحويل...</span>
      ) : (
        <span className="relative z-10 flex items-center justify-center gap-3 w-full h-full">{children}</span>
      )}
    </motion.button>
  );
}
