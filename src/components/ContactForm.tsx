"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Send, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactForm({ isArabic }: { isArabic: boolean }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(isArabic ? "تم إرسال رسالتك بنجاح! سنتواصل معك قريباً." : "Your message has been sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error(isArabic ? "حدث خطأ. يرجى المحاولة مرة أخرى." : "Something went wrong. Please try again.");
      }
    } catch (error) {
      toast.error(isArabic ? "فشل الاتصال بالخادم." : "Failed to connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="bg-[#111111] p-8 md:p-10 rounded-3xl border border-gray-800 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <h3 className="text-3xl font-bold font-heading text-white mb-8 border-b border-gray-800 pb-4">
        {isArabic ? "أرسل لنا رسالة المباشرة" : "Send Us a Message"}
      </h3>

      <div className="space-y-6 relative z-10">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            {isArabic ? "الاسم الكريم" : "Your Name"}
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-black/50 border border-gray-700 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/50 transition-all placeholder:text-gray-600"
            placeholder={isArabic ? "مثال: أحمد محمود" : "e.g. John Doe"}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            {isArabic ? "البريد الإلكتروني" : "Email Address"}
          </label>
          <input
            type="email"
            required
            dir="ltr"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-black/50 border border-gray-700 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/50 transition-all placeholder:text-gray-600"
            placeholder="example@mail.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            {isArabic ? "رسالتك" : "Message"}
          </label>
          <textarea
            required
            rows={5}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full bg-black/50 border border-gray-700 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/50 transition-all placeholder:text-gray-600 resize-none"
            placeholder={isArabic ? "اكتب كيف يمكننا مساعدتك..." : "How can we help you?"}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isSubmitting}
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-brand-orange to-[#ff3300] text-white font-bold rounded-xl flex items-center justify-center gap-2 group/btn shadow-[0_0_30px_rgba(255,107,0,0.3)] hover:shadow-[0_0_40px_rgba(255,107,0,0.5)] transition-all disabled:opacity-70 disabled:cursor-not-allowed border border-white/10"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              {isArabic ? "إرسال الرسالة" : "Send Message"}
              <Send className="w-5 h-5 rtl:mr-2 ltr:ml-2 group-hover/btn:scale-110 transition-transform" />
            </>
          )}
        </motion.button>
      </div>
    </motion.form>
  );
}
