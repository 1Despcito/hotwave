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
    googleAnalyticsId: "",
    facebookPixelId: "",
    aboutUsText: "",
    aboutUsTextEn: "",
    privacyPolicy: "",
    privacyPolicyEn: "",
    termsAndConditions: "",
    termsAndConditionsEn: "",
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
              googleAnalyticsId: data.googleAnalyticsId || "",
              facebookPixelId: data.facebookPixelId || "",
              aboutUsText: data.aboutUsText || "",
              aboutUsTextEn: data.aboutUsTextEn || "",
              privacyPolicy: data.privacyPolicy || "",
              privacyPolicyEn: data.privacyPolicyEn || "",
              termsAndConditions: data.termsAndConditions || "",
              termsAndConditionsEn: data.termsAndConditionsEn || "",
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
        body: JSON.stringify({
          ...formData,
          heroTitle: formData.heroTitleEn,
          heroSubtitle: formData.heroSubtitleEn,
          aboutUsText: formData.aboutUsTextEn,
          privacyPolicy: formData.privacyPolicyEn,
          termsAndConditions: formData.termsAndConditionsEn
        }),
      });

      if (res.ok) {
        toast.success("Site settings updated successfully");
      } else {
        toast.error("Error while saving settings");
      }
    } catch (error) {
      toast.error("Server connection error");
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
          <h1 className="text-3xl font-bold text-white mb-2 font-heading">Global Site Settings ⚙️</h1>
          <p className="text-gray-400">Control main texts, contact numbers, and social media links.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-orange to-[#ff3300] px-6 py-3 font-bold text-white transition-all hover:shadow-[0_0_20px_rgba(255,107,0,0.4)] disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          Save Changes
        </button>
      </div>

      <div className="grid gap-8">
        {/* Contact Info */}
        <section className="bg-[#0a0a0a] p-6 md:p-10 rounded-3xl border border-gray-800 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2 border-b border-gray-800 pb-4"><Globe className="w-6 h-6 text-brand-cyan" /> Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2"><Phone className="w-4 h-4 text-green-400" /> WhatsApp Number (for bookings)</label>
              <input
                type="text"
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-700 bg-black p-3.5 text-white focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange/50 transition-colors"
                placeholder="Example: 201110626484"
                dir="ltr"
              />
              <p className="text-xs text-gray-500 mt-2">Enter number with country code (e.g. 20 for Egypt, without +)</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2"><Mail className="w-4 h-4 text-blue-400" /> Contact Email</label>
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
              <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2"><Facebook className="w-4 h-4 text-blue-600" /> Facebook Page URL</label>
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
              <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2"><Instagram className="w-4 h-4 text-pink-500" /> Instagram Profile URL</label>
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
                TikTok Profile URL
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

        {/* Marketing & Analytics */}
        <section className="bg-[#0a0a0a] p-6 md:p-10 rounded-3xl border border-gray-800 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 blur-3xl -translate-y-1/2 translate-x-1/2 rounded-full" />
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2 border-b border-gray-800 pb-4">
             <span className="p-1.5 rounded-lg bg-brand-orange/10 text-brand-orange"><Globe className="w-5 h-5" /></span>
             Marketing & Analytics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Google Analytics (GA4) ID
              </label>
              <input
                type="text"
                name="googleAnalyticsId"
                value={formData.googleAnalyticsId}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-700 bg-black p-3.5 text-white focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange/50 transition-colors"
                placeholder="G-XXXXXXXXXX"
                dir="ltr"
              />
              <p className="text-[10px] text-gray-500 mt-2">Google Analytics measurement ID (starts with G-)</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-700"></span>
                Facebook Pixel ID
              </label>
              <input
                type="text"
                name="facebookPixelId"
                value={formData.facebookPixelId}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-700 bg-black p-3.5 text-white focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange/50 transition-colors"
                placeholder="1234567890..."
                dir="ltr"
              />
              <p className="text-[10px] text-gray-500 mt-2">Facebook Pixel tracking ID (numbers only)</p>
            </div>
          </div>
        </section>

        {/* Hero Info */}
        <section className="bg-[#0a0a0a] p-6 md:p-10 rounded-3xl border border-gray-800 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-800 pb-4">Hero Section Content</h2>
          <div className="grid grid-cols-1 gap-10">
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Hero Main Title</label>
                <input
                  type="text"
                  name="heroTitleEn"
                  value={formData.heroTitleEn}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-700 bg-black p-3.5 text-white focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Hero Subtitle</label>
                <textarea
                  name="heroSubtitleEn"
                  value={formData.heroSubtitleEn}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-xl border border-gray-700 bg-black p-3.5 text-white focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange/50 transition-colors"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Legal & Pages */}
        <section className="bg-[#0a0a0a] p-6 md:p-10 rounded-3xl border border-gray-800 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-800 pb-4 flex items-center gap-2">
            <Globe className="w-6 h-6 text-green-500" />
            Static Pages Content (About, Privacy, Terms)
          </h2>
          <div className="grid grid-cols-1 gap-10">
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">About Us Content</label>
                <textarea
                  name="aboutUsTextEn"
                  value={formData.aboutUsTextEn}
                  onChange={handleChange}
                  rows={6}
                  className="w-full rounded-xl border border-gray-700 bg-black p-3.5 text-white focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Privacy Policy Content</label>
                <textarea
                  name="privacyPolicyEn"
                  value={formData.privacyPolicyEn}
                  onChange={handleChange}
                  rows={6}
                  className="w-full rounded-xl border border-gray-700 bg-black p-3.5 text-white focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Terms & Conditions Content</label>
                <textarea
                  name="termsAndConditionsEn"
                  value={formData.termsAndConditionsEn}
                  onChange={handleChange}
                  rows={6}
                  className="w-full rounded-xl border border-gray-700 bg-black p-3.5 text-white focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange/50 transition-colors"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
