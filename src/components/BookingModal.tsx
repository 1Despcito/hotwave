"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckCircle, CalendarDays, User, Phone, MessageSquare } from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string; // The Collection
  packageName: string; // The Service
  isArabic?: boolean;
}

export default function BookingModal({
  isOpen,
  onClose,
  serviceName,
  packageName,
  isArabic = false,
}: BookingModalProps) {
  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    notes: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.phoneNumber) {
      setErrorMessage(isArabic ? "برجاء إدخال الاسم ورقم الهاتف" : "Please enter your name and phone number");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.customerName,
          phoneNumber: formData.phoneNumber,
          notes: formData.notes,
          serviceName,
          packageName,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit booking");

      setStatus("success");
      setTimeout(() => {
        onClose();
        setStatus("idle");
        setFormData({ customerName: "", phoneNumber: "", notes: "" });
      }, 3000); // close after 3 seconds of success
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMessage(isArabic ? "حدث خطأ أثناء إرسال طلب الحجز. حاول مرة أخرى." : "Error submitting booking. Please try again.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div key="booking-modal-overlay" className="fixed inset-0 z-[99999] isolate">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="absolute left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 p-4"
          >
            <div className={`relative overflow-hidden rounded-3xl border border-gray-700/50 bg-brand-navy-light/95 p-8 shadow-2xl backdrop-blur-xl ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
              {/* Background Accents */}
              <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-brand-cyan/20 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-brand-orange/20 blur-3xl pointer-events-none" />

              <button
                onClick={onClose}
                type="button"
                className="absolute top-6 right-6 z-10 rtl:left-6 rtl:right-auto text-gray-400 transition-colors hover:text-white bg-black/20 p-2 rounded-full border border-white/5"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="relative z-10">
                {status === "success" ? (
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <CheckCircle className="mb-4 h-16 w-16 text-green-400" />
                    <h3 className="mb-2 text-2xl font-bold text-white font-heading">
                      {isArabic ? "تم استلام الطلب!" : "Request Received!"}
                    </h3>
                    <p className="text-gray-400">
                      {isArabic
                        ? "سنتواصل معك في أقرب وقت لتأكيد حجزك."
                        : "We will contact you shortly to confirm your booking."}
                    </p>
                  </motion.div>
                ) : (
                  <>
                    <h2 className="mb-2 text-2xl font-bold text-white font-heading">
                      {isArabic ? "احجز رحلتك" : "Book Your Trip"}
                    </h2>
                    <p className="mb-6 text-sm text-brand-cyan">
                      {serviceName} &bull; {packageName}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Name input */}
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-300">
                          {isArabic ? "الاسم" : "Full Name"} <span className="text-brand-orange">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 h-5 w-5 rtl:right-3 rtl:left-auto" />
                          <input
                            type="text"
                            name="customerName"
                            value={formData.customerName}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl border border-gray-700 bg-brand-navy/50 py-3 pl-10 rtl:pr-10 rtl:pl-4 pr-4 text-white placeholder-gray-500 focus:border-brand-cyan focus:outline-none focus:ring-1 focus:ring-brand-cyan transition-colors"
                            placeholder={isArabic ? "أدخل اسمك الكريم" : "Enter your full name"}
                          />
                        </div>
                      </div>

                      {/* Phone input */}
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-300">
                          {isArabic ? "رقم الهاتف / واتساب" : "Phone Number / WhatsApp"} <span className="text-brand-orange">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 h-5 w-5 rtl:right-3 rtl:left-auto" />
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl border border-gray-700 bg-brand-navy/50 py-3 pl-10 rtl:pr-10 rtl:pl-4 pr-4 text-white placeholder-gray-500 focus:border-brand-cyan focus:outline-none focus:ring-1 focus:ring-brand-cyan transition-colors"
                            placeholder={isArabic ? "مثال: +201012345678" : "e.g. +201012345678"}
                          />
                        </div>
                      </div>

                      {/* Notes input */}
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-300">
                          {isArabic ? "ملاحظات إضافية (اختياري)" : "Additional Notes (Optional)"}
                        </label>
                        <div className="relative">
                          <MessageSquare className="absolute top-3 left-3 text-gray-400 h-5 w-5 rtl:right-3 rtl:left-auto" />
                          <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={3}
                            className="w-full rounded-xl border border-gray-700 bg-brand-navy/50 py-3 pl-10 rtl:pr-10 rtl:pl-4 pr-4 text-white placeholder-gray-500 focus:border-brand-cyan focus:outline-none focus:ring-1 focus:ring-brand-cyan transition-colors resize-none"
                            placeholder={isArabic ? "أي تفاصيل أخرى (عدد الأفراد، يوم مفضل)..." : "Any other details (guests count, preferred day)..."}
                          />
                        </div>
                      </div>

                      {errorMessage && (
                        <p className="text-sm text-red-400">{errorMessage}</p>
                      )}

                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full mt-2 font-bold py-3.5 bg-gradient-to-r hover:bg-gradient-to-l from-brand-cyan to-blue-500 text-brand-navy rounded-xl shadow-lg hover:shadow-brand-cyan/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                      >
                        {status === "loading" ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <CalendarDays className="h-5 w-5" />
                        )}
                        {isArabic ? "إرسال طلب الحجز" : "Submit Booking Request"}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
