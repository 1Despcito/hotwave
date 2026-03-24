"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Loader2, Save, Globe, Phone, Mail, Instagram, Facebook } from "lucide-react";

export default function SettingsAdminPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    heroTitle: "",
    heroTitleEn: "",
    heroSubtitle: "",
    heroSubtitleEn: "",
    whatsappNumber: "",
    facebookUrl: "",
    instagramUrl: "",
    tiktokUrl: "",
    contactEmail: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setFormData({
              heroTitle: data.heroTitle || "",
              heroTitleEn: data.heroTitleEn || "",
              heroSubtitle: data.heroSubtitle || "",
              heroSubtitleEn: data.heroSubtitleEn || "",
              whatsappNumber: data.whatsappNumber || "201110626484",
              facebookUrl: data.facebookUrl || "",
              instagramUrl: data.instagramUrl || "",
              tiktokUrl: data.tiktokUrl || "",
              contactEmail: data.contactEmail || "",
            });
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("تم تحديث إعدادات الموقع بنجاح");
      } else {
        toast.error("حدث خطأ أثناء حفظ الإعدادات");
      }
    } catch (error) {
      toast.error("حدث خطأ في الاتصال بالخادم");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 font-heading">إعدادات الموقع الشاملة ⚙️</h1>
          <p className="text-gray-400">التحكم في النصوص الرئيسية، أرقام التواصل، وروابط منصات التواصل الاجتماعي.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-orange to-[#ff3300] px-6 py-3 font-bold text-white transition-all hover:shadow-[0_0_20px_rgba(255,107,0,0.4)] disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          حفظ التغييرات
        </button>
      </div>

      <div className="grid gap-8">
        {/* Contact Info */}
        <section className="bg-[#0a0a0a] p-6 md:p-10 rounded-3xl border border-gray-800 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2 border-b border-gray-800 pb-4"><Globe className="w-6 h-6 text-brand-cyan" /> روابط ومعلومات التواصل</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2"><Phone className="w-4 h-4 text-green-400" /> رقم الواتساب (للحجوزات)</label>
              <input
                type="text"
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-700 bg-black p-3.5 text-white focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange/50 transition-colors"
                placeholder="مثال: 201110626484"
                dir="ltr"
              />
              <p className="text-xs text-gray-500 mt-2 text-right">أدخل الرقم متضمناً كود الدولة (مثال: 20+، اكتبه 20 بدون زائد)</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2"><Mail className="w-4 h-4 text-blue-400" /> البريد الإلكتروني (للتواصل)</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-700 bg-black p-3.5 text-white focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange/50 transition-colors"
                dir="ltr"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2"><Facebook className="w-4 h-4 text-blue-600" /> رابط فيسبوك (Facebook)</label>
              <input
                type="url"
                name="facebookUrl"
                value={formData.facebookUrl}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-700 bg-black p-3.5 text-white focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange/50 transition-colors"
                dir="ltr"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2"><Instagram className="w-4 h-4 text-pink-500" /> رابط انستجرام (Instagram)</label>
              <input
                type="url"
                name="instagramUrl"
                value={formData.instagramUrl}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-700 bg-black p-3.5 text-white focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange/50 transition-colors"
                dir="ltr"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 15.68a6.34 6.34 0 006.27 6.36 6.33 6.33 0 006.25-6.36V7.94a8.09 8.09 0 005.66 2.13V6.62a5.44 5.44 0 01-3.59-1.93z" /></svg>
                رابط تيك توك (TikTok)
              </label>
              <input
                type="url"
                name="tiktokUrl"
                value={formData.tiktokUrl}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-700 bg-black p-3.5 text-white focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange/50 transition-colors"
                dir="ltr"
              />
            </div>
          </div>
        </section>

        {/* Hero Info */}
        <section className="bg-[#0a0a0a] p-6 md:p-10 rounded-3xl border border-gray-800 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-800 pb-4">واجهة الترحيب (Hero Section)</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-6">
              <h3 className="font-bold text-lg text-brand-orange bg-brand-orange/10 w-fit px-4 py-1.5 rounded-lg">النسخة العربية</h3>
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">العنوان الرئيسي</label>
                <input
                  type="text"
                  name="heroTitle"
                  value={formData.heroTitle}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-700 bg-black p-3.5 text-white focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">النص الفرعي (الوصف)</label>
                <textarea
                  name="heroSubtitle"
                  value={formData.heroSubtitle}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-xl border border-gray-700 bg-black p-3.5 text-white focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange/50 transition-colors"
                />
              </div>
            </div>
            
            <div className="space-y-6" dir="ltr">
              <h3 className="font-bold text-lg text-brand-cyan bg-brand-cyan/10 w-fit px-4 py-1.5 rounded-lg text-right" dir="rtl">النسخة الإنجليزية</h3>
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Main Title</label>
                <input
                  type="text"
                  name="heroTitleEn"
                  value={formData.heroTitleEn}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-700 bg-black p-3.5 text-white focus:border-brand-cyan focus:outline-none focus:ring-1 focus:ring-brand-cyan/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Subtitle</label>
                <textarea
                  name="heroSubtitleEn"
                  value={formData.heroSubtitleEn}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-xl border border-gray-700 bg-black p-3.5 text-white focus:border-brand-cyan focus:outline-none focus:ring-1 focus:ring-brand-cyan/50 transition-colors"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
