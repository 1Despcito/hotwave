"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckCircle, CalendarDays, User, Phone, MessageSquare, MapPin, Plus, Minus, Info } from "lucide-react";

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
    customerEmail: "",
    notes: "",
    hotelName: "",
    adults: 1,
    children: 0,
    bookingDate: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
        const errorData = await res.json().catch(() => ({}));
        console.error("Booking Submission Detailed Error:", errorData);
        throw new Error(errorData.details || errorData.error || "Failed to submit booking");
      }

      setStatus("success");
      setTimeout(() => {
        onClose();
        setStatus("idle");
        setFormData({ customerName: "", phoneNumber: "", customerEmail: "", notes: "", hotelName: "", adults: 1, children: 0, bookingDate: "" });
      }, 3000); // close after 3 seconds of success
    } catch (err: any) {
      console.error("Booking Error:", err);
      setStatus("error");
      setErrorMessage(isArabic ? `فشل الإرسال: ${err.message || 'حاول مرة أخرى'}` : `Error: ${err.message || 'Please try again'}`);
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
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.9, y: 40, filter: "blur(10px)" }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="absolute left-1/2 top-1/2 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 p-4 md:p-6"
          >
            <div className={`relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#050505]/80 p-6 md:p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-3xl ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
              
              {/* Background Glows */}
              <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-brand-cyan/20 blur-[80px] pointer-events-none animate-pulse" />
              <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-brand-orange/20 blur-[80px] pointer-events-none animate-pulse" />

              <button
                onClick={onClose}
                type="button"
                className="absolute top-6 right-6 z-20 rtl:left-6 rtl:right-auto text-gray-400 transition-all hover:text-white hover:rotate-90 bg-white/5 p-2.5 rounded-2xl border border-white/10"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="relative z-10">
                {status === "success" ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                  >
                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-green-500/20 blur-2xl animate-ping rounded-full" />
                        <CheckCircle className="relative h-24 w-24 text-green-400" />
                    </div>
                    <h3 className="mb-4 text-3xl font-bold text-white font-heading">
                      {isArabic ? "تم استلام الطلب بنجاح!" : "Request Received Successfully!"}
                    </h3>
                    <p className="text-gray-400 text-lg max-w-sm">
                      {isArabic
                        ? "شكراً لاختيارك Hot Wave. سنتواصل معك عبر واتساب خلال دقائق لتأكيد حجزك."
                        : "Thank you for choosing Hot Wave. We will contact you via WhatsApp within minutes to confirm your booking."}
                    </p>
                    <button 
                        onClick={onClose}
                        className="mt-10 px-8 py-3 bg-white/5 border border-white/10 text-white rounded-full hover:bg-white/10 transition-all"
                    >
                        {isArabic ? "إغلاق" : "Close"}
                    </button>
                  </motion.div>
                ) : (
                  <>
                    <header className="mb-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-[10px] font-bold uppercase tracking-widest mb-4">
                            <Info size={12}/> {isArabic ? "حجز رحلة جديدة" : "New Booking Request"}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white font-heading mb-2 leading-tight">
                        {isArabic ? "جاهز للمغامرة؟" : "Ready for Adventure?"}
                        </h2>
                        <p className="text-gray-400 flex items-center gap-2">
                        <span className="text-brand-orange font-bold">{serviceName}</span> 
                        <span className="opacity-30">/</span>
                        <span className="text-brand-cyan">{packageName}</span>
                        </p>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Name & Contact Info Section */}
                      <div className="bg-white/[0.03] p-6 rounded-3xl border border-white/5 space-y-5">
                          <div>
                            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">
                                {isArabic ? "بيانات التواصل" : "Contact Information"}
                            </label>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="relative">
                                    <User className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 h-5 w-5 rtl:right-4 rtl:left-auto" />
                                    <input
                                        type="text"
                                        name="customerName"
                                        value={formData.customerName}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-2xl border border-white/10 bg-black/40 py-4 pl-12 rtl:pr-12 rtl:pl-4 pr-4 text-white placeholder-gray-600 focus:border-brand-cyan/50 focus:bg-black/60 transition-all backdrop-blur-sm outline-none"
                                        placeholder={isArabic ? "الاسم بالكامل" : "Full Name"}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="relative">
                                        <Phone className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 h-5 w-5 rtl:right-4 rtl:left-auto" />
                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            className="w-full rounded-2xl border border-white/10 bg-black/40 py-4 pl-12 rtl:pr-12 rtl:pl-4 pr-4 text-white focus:border-brand-cyan/50 focus:bg-black/60 transition-all outline-none"
                                            placeholder={isArabic ? "رقم الواتساب" : "WhatsApp Number"}
                                        />
                                    </div>
                                    <div className="relative">
                                        <svg className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 h-5 w-5 rtl:right-4 rtl:left-auto" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                                        <input
                                            type="email"
                                            name="customerEmail"
                                            value={formData.customerEmail}
                                            onChange={handleChange}
                                            className="w-full rounded-2xl border border-white/10 bg-black/40 py-4 pl-12 rtl:pr-12 rtl:pl-4 pr-4 text-white focus:border-brand-cyan/50 focus:bg-black/60 transition-all outline-none"
                                            placeholder={isArabic ? "البريد الإلكتروني" : "Email"}
                                        />
                                    </div>
                                </div>
                            </div>
                          </div>
                      </div>

                      {/* Travel Details Section */}
                      <div className="bg-white/[0.03] p-6 rounded-3xl border border-white/5 space-y-6">
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                            {isArabic ? "تفاصيل الرحلة" : "Trip Details"}
                        </label>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Date Picker */}
                            <div className="space-y-2">
                                <span className="text-sm font-medium text-gray-400">{isArabic ? "تاريخ الرحلة" : "Trip Date"}</span>
                                <div className="relative group">
                                    <CalendarDays className="absolute top-1/2 left-4 -translate-y-1/2 text-brand-cyan h-5 w-5 rtl:right-4 rtl:left-auto pointer-events-none group-focus-within:scale-110 transition-transform" />
                                    <input
                                        type="date"
                                        name="bookingDate"
                                        value={formData.bookingDate}
                                        onChange={handleChange}
                                        onClick={(e) => e.currentTarget.showPicker?.()}
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full rounded-2xl border border-white/10 bg-black/40 py-4 pl-12 rtl:pr-12 rtl:pl-4 pr-4 text-white focus:border-brand-cyan focus:bg-black/60 transition-all [color-scheme:dark] outline-none cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* Hotel Picker */}
                            <div className="space-y-2">
                                <span className="text-sm font-medium text-gray-400">{isArabic ? "موقع الاستلام" : "Pick-up Location"}</span>
                                <div className="relative group">
                                    <MapPin className="absolute top-1/2 left-4 -translate-y-1/2 text-brand-orange h-5 w-5 rtl:right-4 rtl:left-auto pointer-events-none" />
                                    <input
                                        type="text"
                                        name="hotelName"
                                        value={formData.hotelName}
                                        onChange={handleChange}
                                        className="w-full rounded-2xl border border-white/10 bg-black/40 py-4 pl-12 rtl:pr-12 rtl:pl-4 pr-4 text-white placeholder-gray-600 focus:border-brand-orange/50 focus:bg-black/60 transition-all outline-none"
                                        placeholder={isArabic ? "اسم الفندق" : "Hotel Name"}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* People Count Selector */}
                        <div className="grid grid-cols-2 gap-4 pt-2">
                            {/* Adults */}
                            <div className="bg-black/20 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-300">{isArabic ? "بالغين" : "Adults"}</span>
                                <div className="flex items-center gap-3">
                                    <button 
                                        type="button"
                                        onClick={() => setFormData(p => ({ ...p, adults: Math.max(1, p.adults - 1) }))}
                                        className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-cyan hover:text-brand-navy transition-all"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="text-lg font-bold text-white min-w-[1.5rem] text-center">{formData.adults}</span>
                                    <button 
                                        type="button"
                                        onClick={() => setFormData(p => ({ ...p, adults: p.adults + 1 }))}
                                        className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-cyan hover:text-brand-navy transition-all"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                            </div>
                            {/* Children */}
                            <div className="bg-black/20 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-300">{isArabic ? "أطفال" : "Children"}</span>
                                <div className="flex items-center gap-3">
                                    <button 
                                        type="button"
                                        onClick={() => setFormData(p => ({ ...p, children: Math.max(0, p.children - 1) }))}
                                        className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-orange hover:text-white transition-all"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="text-lg font-bold text-white min-w-[1.5rem] text-center">{formData.children}</span>
                                    <button 
                                        type="button"
                                        onClick={() => setFormData(p => ({ ...p, children: p.children + 1 }))}
                                        className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-orange hover:text-white transition-all"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                      </div>

                      {/* Notes input */}
                      <div className="relative">
                        <MessageSquare className="absolute top-4 left-4 text-gray-500 h-5 w-5 rtl:right-4 rtl:left-auto" />
                        <textarea
                          name="notes"
                          value={formData.notes}
                          onChange={handleChange}
                          rows={2}
                          className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-4 pl-12 rtl:pr-12 rtl:pl-4 pr-4 text-white placeholder-gray-600 focus:border-brand-cyan/30 focus:bg-white/[0.05] transition-all resize-none outline-none"
                          placeholder={isArabic ? "ملاحظات إضافية (اختياري)..." : "Additional notes (optional)..."}
                        />
                      </div>

                      {errorMessage && (
                        <p className="text-xs text-red-400 font-medium bg-red-400/10 px-4 py-2 rounded-xl border border-red-400/20">{errorMessage}</p>
                      )}

                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={status === "loading"}
                        className="group relative w-full overflow-hidden rounded-2xl bg-brand-cyan py-5 font-bold text-brand-navy shadow-[0_0_30px_rgba(30,190,210,0.3)] transition-all hover:shadow-[0_0_40px_rgba(30,190,210,0.5)] disabled:opacity-70"
                      >
                        <div className="absolute inset-0 translate-y-[100%] bg-gradient-to-t from-white/20 to-transparent transition-transform duration-500 group-hover:translate-y-0" />
                        <div className="relative flex items-center justify-center gap-3">
                            {status === "loading" ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                            <CalendarDays className="h-5 w-5 transition-transform group-hover:scale-110" />
                            )}
                            <span className="text-lg tracking-wide">{isArabic ? "تأكيد طلب الحجز الآن" : "Confirm Booking Now"}</span>
                        </div>
                      </motion.button>
                      
                      <p className="text-[10px] text-center text-gray-600">
                          {isArabic ? "بضغطك على الزر، سيتم إرسال طلبك وسنقوم بالرد عليك في أسرع وقت ممكن." : "By clicking the button, your request will be sent and we will reply as soon as possible."}
                      </p>
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
