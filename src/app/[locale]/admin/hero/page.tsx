"use client";

import { useState, useEffect } from "react";
import ImageUpload from "@/components/ImageUpload";

export default function HeroAdminPage() {
  const [heroTitle, setHeroTitle] = useState("");
  const [heroTitleEn, setHeroTitleEn] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroSubtitleEn, setHeroSubtitleEn] = useState("");
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setHeroTitle(data.heroTitle || "");
            setHeroTitleEn(data.heroTitleEn || "");
            setHeroSubtitle(data.heroSubtitle || "");
            setHeroSubtitleEn(data.heroSubtitleEn || "");
            setHeroImageUrl(data.heroImageUrl || "");
          }
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ heroTitle, heroSubtitle, heroImageUrl, heroTitleEn, heroSubtitleEn }),
      });

      if (res.ok) {
        setMessage("تم الحفظ بنجاح!");
      } else {
        setMessage("حدث خطأ أثناء الحفظ.");
      }
    } catch (error) {
      console.error("Save error:", error);
      setMessage("حدث خطأ أثناء الحفظ.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="text-white">جاري التحميل...</div>;

  return (
    <div className="bg-[#111111] p-6 rounded-lg shadow-sm border border-gray-800">
      <h1 className="text-2xl font-bold text-white mb-6">إعدادات قسم الترحيب (Hero)</h1>
      
      {message && (
        <div className={`p-4 mb-6 rounded border ${message.includes('بنجاح') ? 'bg-green-900/40 text-green-300 border-green-800' : 'bg-red-900/40 text-red-300 border-red-800'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300">العنوان الرئيسي (عربي)</label>
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="mt-1 block w-full rounded-md bg-[#1a1a1a] text-white border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">العنوان الرئيسي (English)</label>
            <input
              dir="ltr"
              type="text"
              value={heroTitleEn}
              onChange={(e) => setHeroTitleEn(e.target.value)}
              className="mt-1 block w-full rounded-md bg-[#1a1a1a] text-white border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300">الوصف الفرعي (عربي)</label>
            <textarea
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md bg-[#1a1a1a] text-white border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">الوصف الفرعي (English)</label>
            <textarea
              dir="ltr"
              value={heroSubtitleEn}
              onChange={(e) => setHeroSubtitleEn(e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md bg-[#1a1a1a] text-white border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            />
          </div>
        </div>

        <div className="border border-gray-800 bg-[#1a1a1a] p-4 rounded-md">
          <ImageUpload 
            label="صورة الخلفية الواجهة الأمامية" 
            value={heroImageUrl} 
            onChange={(url) => setHeroImageUrl(url)} 
          />
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="bg-brand-orange text-white px-6 py-2 rounded-md hover:bg-brand-orange/90 disabled:opacity-50 transition-colors"
        >
          {isSaving ? "جاري الحفظ..." : "حفظ التعديلات"}
        </button>
      </form>
    </div>
  );
}
