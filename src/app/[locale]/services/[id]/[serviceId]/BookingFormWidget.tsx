"use client";

import { useState } from "react";
import { Loader2, CheckCircle, CalendarDays, User, Phone, MessageSquare, MapPin, Plus, Minus } from "lucide-react";
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
    hotelName: "",
    adults: 1,
    children: 0,
    bookingDate: "",
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
          hotelName: formData.hotelName,
          adults: formData.adults,
          children: formData.children,
          bookingDate: formData.bookingDate,
          serviceName,
          packageName,
        }),
      });

      if (!res.ok) {
        console.error("Booking API Status:", res.status, res.statusText);
        const errorText = await res.text().catch(() => "");
        console.error("Booking API Raw Response:", errorText);
        let errorData = {};
        try { errorData = JSON.parse(errorText); } catch(e) {}
        console.error("Booking Submission Detailed Error:", errorData);
        throw new Error(errorData ? (errorData as any).details || (errorData as any).error : "Failed to submit booking");
      }

      setStatus("success");
    } catch (err: any) {
      console.error("Booking Error:", err);
      setStatus("error");
      setErrorMessage(isArabic ? `فشل الإرسال: ${err.message || 'حاول مرة أخرى'}` : `Error: ${err.message || 'Please try again'}`);
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
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-green-500/20 blur-xl animate-ping rounded-full" />
                <CheckCircle className="relative h-16 w-16 text-green-400" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-white font-heading">
              {isArabic ? "تم استلام الطلب بنجاح!" : "Request Received!"}
            </h3>
            <p className="text-gray-400">
              {isArabic
                ? "سنتواصل معك في أقرب وقت لتأكيد حجزك عبر الواتساب."
                : "We will contact you shortly via WhatsApp to confirm your booking."}
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Form Section: Contact */}
            <div className="space-y-4">
                <div className="relative group">
                    <User className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 h-5 w-5 rtl:right-4 rtl:left-auto group-focus-within:text-brand-orange transition-colors" />
                    <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-4 pl-12 rtl:pr-12 rtl:pl-4 pr-4 text-white placeholder-gray-600 focus:border-brand-orange/30 focus:bg-white/[0.05] transition-all outline-none"
                        placeholder={isArabic ? "الاسم بالكامل" : "Full Name"}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative group">
                        <Phone className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 h-5 w-5 rtl:right-4 rtl:left-auto group-focus-within:text-brand-orange transition-colors" />
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-4 pl-12 rtl:pr-12 rtl:pl-4 pr-4 text-white focus:border-brand-orange/30 focus:bg-white/[0.05] transition-all outline-none"
                            placeholder={isArabic ? "رقم الواتساب" : "WhatsApp"}
                        />
                    </div>
                    <div className="relative group">
                        <svg className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 h-5 w-5 rtl:right-4 rtl:left-auto group-focus-within:text-brand-orange transition-colors" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                        <input
                            type="email"
                            name="customerEmail"
                            value={formData.customerEmail}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-4 pl-12 rtl:pr-12 rtl:pl-4 pr-4 text-white focus:border-brand-orange/30 focus:bg-white/[0.05] transition-all outline-none"
                            placeholder={isArabic ? "البريد الإلكتروني" : "Email"}
                        />
                    </div>
                </div>
            </div>

            {/* Form Section: Trip Info */}
            <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <span className="text-[10px] uppercase font-bold text-gray-500 px-1">{isArabic ? "تاريخ الحجز" : "Booking Date"}</span>
                        <div className="relative">
                            <CalendarDays className="absolute top-1/2 left-4 -translate-y-1/2 text-brand-orange h-5 w-5 rtl:right-4 rtl:left-auto pointer-events-none" />
                            <input
                                type="date"
                                name="bookingDate"
                                value={formData.bookingDate}
                                onChange={handleChange}
                                onClick={(e) => e.currentTarget.showPicker?.()}
                                required
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full rounded-xl border border-white/5 bg-black/30 py-3.5 pl-12 rtl:pr-12 rtl:pl-4 pr-4 text-white focus:border-brand-orange/30 transition-all [color-scheme:dark] outline-none cursor-pointer"
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <span className="text-[10px] uppercase font-bold text-gray-500 px-1">{isArabic ? "موقع الاستلام" : "Pick-up Location"}</span>
                        <div className="relative">
                            <MapPin className="absolute top-1/2 left-4 -translate-y-1/2 text-brand-orange h-5 w-5 rtl:right-4 rtl:left-auto pointer-events-none" />
                            <input
                                type="text"
                                name="hotelName"
                                value={formData.hotelName}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-white/5 bg-black/30 py-3.5 pl-12 rtl:pr-12 rtl:pl-4 pr-4 text-white placeholder-gray-600 focus:border-brand-orange/30 transition-all outline-none"
                                placeholder={isArabic ? "اسم الفندق" : "Hotel Name"}
                            />
                        </div>
                    </div>
                </div>

                {/* Guests Counter */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="bg-black/20 p-3 rounded-2xl border border-white/5 flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-400">{isArabic ? "بالغ" : "Adults"}</span>
                        <div className="flex items-center gap-2">
                            <button type="button" onClick={() => setFormData(p=>({...p, adults: Math.max(1, p.adults-1)}))} className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center hover:bg-brand-orange transition-all"><Minus size={12}/></button>
                            <span className="text-sm font-bold text-white min-w-[1rem] text-center">{formData.adults}</span>
                            <button type="button" onClick={() => setFormData(p=>({...p, adults: p.adults+1}))} className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center hover:bg-brand-orange transition-all"><Plus size={12}/></button>
                        </div>
                    </div>
                    <div className="bg-black/20 p-3 rounded-2xl border border-white/5 flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-400">{isArabic ? "طفل" : "Children"}</span>
                        <div className="flex items-center gap-2">
                            <button type="button" onClick={() => setFormData(p=>({...p, children: Math.max(0, p.children-1)}))} className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center hover:bg-brand-orange transition-all"><Minus size={12}/></button>
                            <span className="text-sm font-bold text-white min-w-[1rem] text-center">{formData.children}</span>
                            <button type="button" onClick={() => setFormData(p=>({...p, children: p.children+1}))} className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center hover:bg-brand-orange transition-all"><Plus size={12}/></button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative group">
                <MessageSquare className="absolute top-4 left-4 text-gray-500 h-5 w-5 rtl:right-4 rtl:left-auto" />
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={2}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-4 pl-12 rtl:pr-12 rtl:pl-4 pr-4 text-white placeholder-gray-600 focus:border-brand-orange/30 focus:bg-white/[0.05] transition-all resize-none outline-none"
                  placeholder={isArabic ? "أي ملاحظات إضافية..." : "Any extra notes..."}
                />
            </div>

            {errorMessage && (
                <div className="p-3 rounded-xl bg-red-400/10 border border-red-400/20 text-red-400 text-xs font-medium">
                    {errorMessage}
                </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={status === "loading"}
              className="w-full py-5 bg-brand-orange text-white font-bold rounded-2xl shadow-[0_10px_30px_rgba(255,107,0,0.3)] hover:shadow-[0_15px_40px_rgba(255,107,0,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 text-lg uppercase tracking-wide"
            >
              {status === "loading" ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <CalendarDays className="h-6 w-6" />
              )}
              {isArabic ? "احجز مغامرتك الآن" : "Book Your Trip Now"}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
