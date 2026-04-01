"use client";

import { useState, useEffect } from "react";
import ImageUpload from "@/components/ImageUpload";

type Testimonial = { id: string; name: string; nameEn: string; role: string; roleEn: string; content: string; contentEn: string; avatarUrl: string };

export default function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", nameEn: "", role: "", roleEn: "", content: "", contentEn: "", avatarUrl: "" });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const res = await fetch("/api/testimonials");
    if (res.ok) setTestimonials(await res.json());
    setIsLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);

    const res = await fetch("/api/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        name: formData.nameEn,
        role: formData.roleEn,
        content: formData.contentEn
      }),
    });

    if (res.ok) {
      setFormData({ name: "", nameEn: "", role: "", roleEn: "", content: "", contentEn: "", avatarUrl: "" });
      fetchTestimonials();
    }
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;
    const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
    if (res.ok) fetchTestimonials();
  };

  if (isLoading) return <div className="text-white">جاري التحميل...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6 font-heading">إدارة آراء العملاء ⭐</h1>
      
      <div className="bg-[#0a0a0a] p-6 md:p-8 rounded-3xl shadow-xl border border-gray-800 mb-8">
        <h2 className="text-xl font-bold text-white mb-6 border-b border-gray-800 pb-4">Add New Testimonial</h2>
        <form onSubmit={handleAdd} className="space-y-4 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Name</label>
              <input required type="text" value={formData.nameEn} onChange={e => setFormData({...formData, nameEn: e.target.value})} className="mt-1 w-full border border-gray-700 bg-[#1a1a1a] text-white p-2 rounded" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Role / Designation</label>
              <input required type="text" value={formData.roleEn} onChange={e => setFormData({...formData, roleEn: e.target.value})} className="mt-1 w-full border border-gray-700 bg-[#1a1a1a] text-white p-2 rounded" dir="ltr" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300">Testimonial Content</label>
              <textarea required value={formData.contentEn} onChange={e => setFormData({...formData, contentEn: e.target.value})} className="mt-1 w-full border border-gray-700 bg-[#1a1a1a] text-white p-2 rounded" rows={3} dir="ltr" />
            </div>
          </div>
          <div className="border border-gray-800 bg-[#1a1a1a] p-4 rounded-md">
            <ImageUpload 
              label="صورة شخصية (اختياري)" 
              value={formData.avatarUrl} 
              onChange={(url) => setFormData({...formData, avatarUrl: url})} 
            />
          </div>
          <button disabled={isAdding} className="bg-brand-orange text-white px-6 py-2 rounded-md hover:bg-brand-orange/90 disabled:opacity-50 transition-colors mt-2">
            {isAdding ? "جاري الإضافة..." : "إضافة الرأي"}
          </button>
        </form>
      </div>

      <div className="bg-[#0a0a0a] rounded-3xl shadow-xl border border-gray-800 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-[#111111]">
            <tr>
              <th className="px-6 py-5 rounded-tr-3xl text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Avatar</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Personal Info</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Testimonial</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {testimonials.map(t => (
              <tr key={t.id} className="hover:bg-gray-800/30">
                <td className="px-6 py-4 whitespace-nowrap">
                  {t.avatarUrl && <img src={t.avatarUrl} alt={t.name} className="h-10 w-10 rounded-full object-cover" />}
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-300">{t.nameEn}</div>
                  <div className="text-gray-500 text-sm">{t.roleEn}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-300 max-w-xs truncate">{t.contentEn}</td>
                <td className="px-6 py-4">
                  <button onClick={() => handleDelete(t.id)} className="text-red-400 hover:text-red-300 font-medium transition-colors">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {testimonials.length === 0 && <div className="p-6 text-center text-gray-500">لا توجد آراء مضافة حالياً.</div>}
      </div>
    </div>
  );
}
