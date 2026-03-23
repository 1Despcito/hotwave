"use client";

import { useState, useEffect } from "react";
import ImageUpload from "@/components/ImageUpload";
import { ChevronDown, ChevronUp, Plus, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";

type ServiceType = {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  price: number | null;
  imageUrl: string | null;
  duration?: string | null;
  durationEn?: string | null;
  includes?: string | null;
  includesEn?: string | null;
};

type Service = {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  imageUrl: string;
  types: ServiceType[];
};

const emptyTypeForm = { name: "", nameEn: "", description: "", descriptionEn: "", price: "", imageUrl: "", duration: "", durationEn: "", includes: "", includesEn: "" };

export default function ServicesAdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({ title: "", titleEn: "", description: "", descriptionEn: "", imageUrl: "" });
  const [isAdding, setIsAdding] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [typeForm, setTypeForm] = useState<Record<string, typeof emptyTypeForm>>({});
  const [addingTypeFor, setAddingTypeFor] = useState<string | null>(null);

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    const res = await fetch("/api/services");
    if (res.ok) setServices(await res.json());
    setIsLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    const res = await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      setFormData({ title: "", titleEn: "", description: "", descriptionEn: "", imageUrl: "" });
      toast.success("تمت إضافة الخدمة بنجاح");
      fetchServices();
    } else {
      toast.error("حدث خطأ أثناء الإضافة");
    }
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الخدمة؟")) return;
    const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("تم حذف الخدمة");
      fetchServices();
    } else {
      toast.error("فشل الحذف");
    }
  };

  const handleAddType = async (serviceId: string) => {
    const form = typeForm[serviceId] || emptyTypeForm;
    if (!form.name) return;
    setAddingTypeFor(serviceId);
    const res = await fetch(`/api/services/${serviceId}/types`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, price: form.price ? parseFloat(form.price) : null }),
    });
    if (res.ok) {
      setTypeForm(prev => ({ ...prev, [serviceId]: { ...emptyTypeForm } }));
      toast.success("تمت إضافة القسم للباقة بنجاح");
      fetchServices();
    } else {
      toast.error("فشل الإضافة");
    }
    setAddingTypeFor(null);
  };

  const handleDeleteType = async (serviceId: string, typeId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا القسم؟")) return;
    const res = await fetch(`/api/services/${serviceId}/types/${typeId}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("تم حذف القسم");
      fetchServices();
    } else {
      toast.error("فشل الحذف");
    }
  };

  const getTypeForm = (id: string) => typeForm[id] || { ...emptyTypeForm };
  const setTypeFormFor = (id: string, field: string, value: string) =>
    setTypeForm(prev => ({ ...prev, [id]: { ...(prev[id] || emptyTypeForm), [field]: value } }));

  if (isLoading) return <div className="text-white">جاري التحميل...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">إدارة الخدمات</h1>

      {/* Add Service Form */}
      <div className="bg-[#111111] p-6 rounded-lg shadow-sm border border-gray-800 mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">إضافة خدمة جديدة</h2>
        <form onSubmit={handleAdd} className="space-y-4 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">عنوان الخدمة (بالعربية)</label>
              <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="mt-1 w-full border border-gray-700 bg-[#1a1a1a] text-white p-2 rounded" dir="rtl" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">عنوان الخدمة (بالإنجليزية)</label>
              <input required type="text" value={formData.titleEn} onChange={e => setFormData({ ...formData, titleEn: e.target.value })} className="mt-1 w-full border border-gray-700 bg-[#1a1a1a] text-white p-2 rounded" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">الوصف (بالعربية)</label>
              <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="mt-1 w-full border border-gray-700 bg-[#1a1a1a] text-white p-2 rounded" rows={3} dir="rtl" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">الوصف (بالإنجليزية)</label>
              <textarea required value={formData.descriptionEn} onChange={e => setFormData({ ...formData, descriptionEn: e.target.value })} className="mt-1 w-full border border-gray-700 bg-[#1a1a1a] text-white p-2 rounded" rows={3} dir="ltr" />
            </div>
          </div>
          <div className="border border-gray-800 bg-[#1a1a1a] p-4 rounded-md">
            <ImageUpload label="صورة الخدمة" value={formData.imageUrl} onChange={(url) => setFormData({ ...formData, imageUrl: url })} />
          </div>
          <button disabled={isAdding} className="bg-brand-orange text-white px-6 py-2 rounded-md hover:bg-brand-orange/90 disabled:opacity-50 transition-colors mt-2">
            {isAdding ? "جاري الإضافة..." : "إضافة الخدمة"}
          </button>
        </form>
      </div>

      {/* Services List */}
      <div className="space-y-4">
        {services.length === 0 && (
          <div className="bg-[#111111] p-6 text-center text-gray-500 rounded-lg border border-gray-800">
            لا توجد خدمات مضافة حالياً.
          </div>
        )}
        {services.map(service => (
          <div key={service.id} className="bg-[#111111] rounded-lg border border-gray-800 overflow-hidden">
            {/* Service Row */}
            <div className="flex items-center gap-4 p-4">
              {service.imageUrl && (
                <img src={service.imageUrl} alt={service.title} className="h-14 w-14 rounded-lg object-cover flex-shrink-0 border border-gray-700" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate">{service.title}</p>
                <p className="text-gray-400 text-sm truncate" dir="ltr">{service.titleEn}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full">
                  {service.types.length} قسم
                </span>
                <button
                  onClick={() => setExpandedId(expandedId === service.id ? null : service.id)}
                  className="flex items-center gap-1 text-sm text-brand-cyan hover:text-brand-cyan/80 px-3 py-1.5 rounded-md border border-brand-cyan/30 hover:border-brand-cyan/60 transition-colors"
                >
                  {expandedId === service.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {expandedId === service.id ? "إخفاء" : "إدارة الأقسام"}
                </button>
                <button onClick={() => handleDelete(service.id)} className="text-red-400 hover:text-red-300 transition-colors p-1.5">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sub-items Panel */}
            {expandedId === service.id && (
              <div className="border-t border-gray-800 bg-[#0d0d0d] p-4">
                <h3 className="text-sm font-semibold text-gray-300 mb-3">أقسام الخدمة</h3>

                {/* Existing Types */}
                {service.types.length === 0 ? (
                  <p className="text-gray-600 text-sm mb-4">لا توجد أقسام بعد.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                    {service.types.map(type => (
                      <div key={type.id} className="flex items-start gap-3 bg-[#151515] border border-gray-800 rounded-lg p-3">
                        {type.imageUrl && (
                          <img src={type.imageUrl} alt={type.name} className="h-10 w-10 rounded object-cover flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium">{type.name}</p>
                          {type.nameEn && <p className="text-gray-500 text-xs" dir="ltr">{type.nameEn}</p>}
                          {type.description && <p className="text-gray-400 text-xs mt-0.5 line-clamp-2">{type.description}</p>}
                          {type.price && (
                            <p className="text-brand-orange text-xs mt-1 font-semibold">{type.price} ج.م</p>
                          )}
                          {(type.duration || type.includes) && (
                            <p className="text-brand-cyan text-xs mt-1">
                                {type.duration && <span>⏱️ {type.duration} | </span>}
                                {type.includes && <span className="text-gray-400">{type.includes}</span>}
                            </p>
                          )}
                        </div>
                        <button onClick={() => handleDeleteType(service.id, type.id)} className="text-red-500 hover:text-red-400 transition-colors flex-shrink-0 mt-0.5">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Type Form */}
                <div className="border border-dashed border-gray-700 rounded-lg p-3 bg-[#111111]">
                  <p className="text-xs text-gray-400 mb-3 flex items-center gap-1"><Plus className="w-3 h-3" /> إضافة قسم جديد</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                    <input
                      type="text" placeholder="اسم القسم (عربي) *" dir="rtl"
                      value={getTypeForm(service.id).name}
                      onChange={e => setTypeFormFor(service.id, "name", e.target.value)}
                      className="border border-gray-700 bg-[#1a1a1a] text-white text-sm p-2 rounded"
                    />
                    <input
                      type="text" placeholder="اسم القسم (إنجليزي)" dir="ltr"
                      value={getTypeForm(service.id).nameEn}
                      onChange={e => setTypeFormFor(service.id, "nameEn", e.target.value)}
                      className="border border-gray-700 bg-[#1a1a1a] text-white text-sm p-2 rounded"
                    />
                    <textarea
                      placeholder="وصف القسم (عربي)" dir="rtl" rows={2}
                      value={getTypeForm(service.id).description}
                      onChange={e => setTypeFormFor(service.id, "description", e.target.value)}
                      className="border border-gray-700 bg-[#1a1a1a] text-white text-sm p-2 rounded"
                    />
                    <textarea
                      placeholder="وصف القسم (إنجليزي)" dir="ltr" rows={2}
                      value={getTypeForm(service.id).descriptionEn}
                      onChange={e => setTypeFormFor(service.id, "descriptionEn", e.target.value)}
                      className="border border-gray-700 bg-[#1a1a1a] text-white text-sm p-2 rounded"
                    />
                    <input
                      type="number" placeholder="السعر (اختياري)"
                      value={getTypeForm(service.id).price}
                      onChange={e => setTypeFormFor(service.id, "price", e.target.value)}
                      className="border border-gray-700 bg-[#1a1a1a] text-white text-sm p-2 rounded"
                    />
                    <input
                      type="text" placeholder="رابط الصورة (اختياري)" dir="ltr"
                      value={getTypeForm(service.id).imageUrl}
                      onChange={e => setTypeFormFor(service.id, "imageUrl", e.target.value)}
                      className="border border-gray-700 bg-[#1a1a1a] text-white text-sm p-2 rounded"
                    />
                    <input
                      type="text" placeholder="المدة - مثلاً: 8 ساعات (اختياري)" dir="rtl"
                      value={getTypeForm(service.id).duration}
                      onChange={e => setTypeFormFor(service.id, "duration", e.target.value)}
                      className="border border-gray-700 bg-[#1a1a1a] text-white text-sm p-2 rounded"
                    />
                    <input
                      type="text" placeholder="المدة (إنجليزي) - e.g. 8 Hours" dir="ltr"
                      value={getTypeForm(service.id).durationEn}
                      onChange={e => setTypeFormFor(service.id, "durationEn", e.target.value)}
                      className="border border-gray-700 bg-[#1a1a1a] text-white text-sm p-2 rounded"
                    />
                    <textarea
                      placeholder="تشمل (كلمات يفصلها فاصلة) - مثلاً: غداء, مشروبات" dir="rtl" rows={2}
                      value={getTypeForm(service.id).includes}
                      onChange={e => setTypeFormFor(service.id, "includes", e.target.value)}
                      className="border border-gray-700 bg-[#1a1a1a] text-white text-sm p-2 rounded"
                    />
                    <textarea
                      placeholder="Includes (Comma separated) - e.g. Lunch, Drinks" dir="ltr" rows={2}
                      value={getTypeForm(service.id).includesEn}
                      onChange={e => setTypeFormFor(service.id, "includesEn", e.target.value)}
                      className="border border-gray-700 bg-[#1a1a1a] text-white text-sm p-2 rounded"
                    />
                  </div>
                  <button
                    onClick={() => handleAddType(service.id)}
                    disabled={addingTypeFor === service.id || !getTypeForm(service.id).name}
                    className="bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40 hover:bg-brand-cyan/30 px-4 py-1.5 rounded text-sm transition-colors disabled:opacity-40"
                  >
                    {addingTypeFor === service.id ? "جاري الإضافة..." : "إضافة القسم"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
