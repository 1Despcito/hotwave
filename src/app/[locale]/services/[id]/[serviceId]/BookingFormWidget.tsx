"use client";

import { useState } from "react";
import { Loader2, CheckCircle, CalendarDays, User, Phone, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BookingFormWidgetProps {
  serviceName: string;
  packageName: string;
  isArabic: boolean;
  whatsappNumber: string;
}

export function BookingFormWidget({
  serviceName,
  packageName,
  isArabic,
  whatsappNumber,
}: BookingFormWidgetProps) {
  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    customerEmail: "",
    notes: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName) {
      setErrorMessage(isArabic ? "برجاء إدخال الاسم" : "Please enter your name");
      return;
    }

    if (!formData.phoneNumber && !formData.customerEmail) {
      setErrorMessage(isArabic ? "برجاء إدخال رقم الهاتف أو البريد الإلكتروني للتواصل" : "Please enter either phone number or email to contact you");
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
          customerEmail: formData.customerEmail,
          notes: formData.notes,
          serviceName,
          packageName,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit booking");

      setStatus("success");
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMessage(isArabic ? "حدث خطأ أثناء إرسال طلب الحجز. حاول مرة أخرى." : "Error submitting booking. Please try again.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="relative z-10 w-full" dir={isArabic ? 'rtl' : 'ltr'}>
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
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
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
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
                {isArabic ? "رقم الهاتف / واتساب" : "Phone Number / WhatsApp"}
              </label>
              <div className="relative">
                <Phone className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 h-5 w-5 rtl:right-3 rtl:left-auto" />
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-700 bg-brand-navy/50 py-3 pl-10 rtl:pr-10 rtl:pl-4 pr-4 text-white placeholder-gray-500 focus:border-brand-cyan focus:outline-none focus:ring-1 focus:ring-brand-cyan transition-colors"
                  placeholder={isArabic ? "مثال: +201012345678" : "e.g. +201012345678"}
                />
              </div>
            </div>

            {/* Email input */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                {isArabic ? "البريد الإلكتروني" : "Email Address"}
              </label>
              <div className="relative">
                <svg className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 h-5 w-5 rtl:right-3 rtl:left-auto" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-700 bg-brand-navy/50 py-3 pl-10 rtl:pr-10 rtl:pl-4 pr-4 text-white placeholder-gray-500 focus:border-brand-cyan focus:outline-none focus:ring-1 focus:ring-brand-cyan transition-colors"
                  placeholder={isArabic ? "example@mail.com" : "example@mail.com"}
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
              className="w-full mt-4 font-bold py-3.5 bg-gradient-to-r hover:bg-gradient-to-l from-brand-orange to-[#ff3300] text-white rounded-xl shadow-lg hover:shadow-brand-orange/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {status === "loading" ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <CalendarDays className="h-5 w-5" />
              )}
              {isArabic ? "إرسال طلب الحجز" : "Submit Booking Request"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
