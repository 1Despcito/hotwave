"use client";

import { useState, useEffect } from "react";
import MultiImageUpload from "@/components/MultiImageUpload";
import { Plus, Trash2, X, Edit3, Save, Loader2, Search, Filter, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

type Service = {
  id: string;
  title: string;
  titleEn: string;
};

type Package = {
  id: string;
  serviceId: string;
  service: Service;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  price: number | null;
  images: string[];
  duration?: string | null;
  durationEn?: string | null;
  includes?: string | null;
  includesEn?: string | null;
  featured: boolean;
};

const emptyForm = {
  serviceId: "",
  name: "",
  nameEn: "",
  description: "",
  descriptionEn: "",
  price: "",
  images: [] as string[],
  duration: "",
  durationEn: "",
  includes: "",
  includesEn: "",
  featured: false
};

export default function PackagesAdminPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterService, setFilterService] = useState("all");

  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [pkgRes, srvRes] = await Promise.all([
      fetch("/api/service-types"),
      fetch("/api/services")
    ]);
    if (pkgRes.ok) setPackages(await pkgRes.json());
    if (srvRes.ok) setServices(await srvRes.json());
    setIsLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.serviceId) return toast.error("برجاء اختيار المجموعة التابعة لها الباقة");
    setIsSaving(true);
    const res = await fetch("/api/service-types", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      toast.success("تمت إضافة الباقة بنجاح");
      setIsAdding(false);
      setFormData(emptyForm);
      fetchData();
    } else {
      toast.error("فشل الإضافة");
    }
    setIsSaving(false);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage) return;
    setIsSaving(true);
    const res = await fetch(`/api/service-types/${editingPackage.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingPackage),
    });
    if (res.ok) {
      toast.success("تم التحديث بنجاح");
      setEditingPackage(null);
      fetchData();
    } else {
      toast.error("فشل التحديث");
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الباقة؟")) return;
    const res = await fetch(`/api/service-types/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("تم حذف الباقة");
      fetchData();
    } else {
      toast.error("فشل الحذف");
    }
  };

  const filtered = packages.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          pkg.nameEn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterService === "all" || pkg.serviceId === filterService;
    return matchesSearch && matchesFilter;
  });

  if (isLoading) return <div className="text-white flex items-center justify-center min-h-[400px]"><Loader2 className="animate-spin mr-2" /> جاري التحميل...</div>;

  return (
    <div dir="rtl" className="pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white font-heading">إدارة الباقات والأقسام 🏝️</h1>
          <p className="text-gray-400 mt-1">إدارة الخدمات الفرعية والباقات بشكل مستقل.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)} 
          className="bg-brand-orange text-white px-6 py-3 rounded-xl hover:bg-brand-orange/90 transition-all font-bold flex items-center gap-2 shadow-lg shadow-brand-orange/20"
        >
          <Plus size={20} /> إضافة باقة جديدة
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input 
            type="text" 
            placeholder="بحث عن باقة..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#111] border border-gray-800 text-white py-3 pr-10 pl-4 rounded-xl focus:border-brand-cyan/50 outline-none transition-all"
          />
        </div>
        <div className="relative md:w-64">
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <select 
            value={filterService}
            onChange={(e) => setFilterService(e.target.value)}
            className="w-full bg-[#111] border border-gray-800 text-white py-3 pr-10 pl-4 rounded-xl focus:border-brand-cyan/50 outline-none transition-all appearance-none"
          >
            <option value="all">كل المجموعات</option>
            {services.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
          </select>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(pkg => (
          <div 
            key={pkg.id} 
            onClick={() => setEditingPackage(pkg)}
            className="bg-[#0a0a0a] border border-gray-800 rounded-3xl overflow-hidden group hover:border-brand-cyan/30 transition-all shadow-xl flex flex-col h-full cursor-pointer"
          >
            <div className="relative h-48 w-full group overflow-hidden">
                {(pkg.images || []).length > 0 ? (
                    <img src={pkg.images[0]} alt={pkg.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                    <div className="w-full h-full bg-[#111] flex items-center justify-center text-gray-700">لا توجد صور</div>
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                    <button className="p-2 bg-brand-cyan/90 text-brand-navy rounded-xl shadow-lg hover:scale-105 transition-all"><Edit3 size={18}/></button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(pkg.id); }} 
                      className="p-2 bg-red-500/90 text-white rounded-xl shadow-lg hover:scale-105 transition-all"
                    >
                      <X size={18}/>
                    </button>
                </div>
                {pkg.featured && (
                    <div className="absolute bottom-4 left-4 bg-brand-orange text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">مميز</div>
                )}
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-3 text-[10px] text-brand-cyan bg-brand-cyan/10 w-fit px-3 py-1 rounded-full border border-brand-cyan/20">
                  {pkg.service?.title}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{pkg.name}</h3>
              <p className="text-gray-500 text-xs mb-4 line-clamp-3 leading-relaxed">{pkg.description}</p>
              
              <div className="mt-auto pt-4 border-t border-gray-800/50 flex items-center justify-between">
                <span className="text-brand-orange font-bold text-lg">{pkg.price ? `${pkg.price} ج.م` : "سعر متغير"}</span>
                {(pkg.images || []).length > 1 && (
                    <span className="text-gray-500 text-[10px] bg-gray-900 px-2 py-1 rounded italic">+{(pkg.images || []).length - 1} صور أخرى</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Package Modal */}
      <Modal isOpen={isAdding} onClose={() => setIsAdding(false)} title="إضافة باقة / قسم جديد">
        <form onSubmit={handleAdd} className="space-y-4 max-h-[80vh] overflow-y-auto px-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 mb-1.5 mr-2">المجموعة الأساسية</label>
                <select 
                    value={formData.serviceId} 
                    onChange={e => setFormData({...formData, serviceId: e.target.value})}
                    className="w-full bg-[#111] border border-gray-800 text-white p-3 rounded-xl focus:border-brand-cyan outline-none"
                >
                    <option value="">اختار المجموعة التابعة لها...</option>
                    {services.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                </select>
            </div>
            <InputField label="اسم الباقة (ع)" value={formData.name} onChange={v => setFormData({...formData, name: v})} dir="rtl" required />
            <InputField label="اسم الباقة (En)" value={formData.nameEn} onChange={v => setFormData({...formData, nameEn: v})} dir="ltr" />
            <TextareaField label="وصف الباقة (ع)" value={formData.description} onChange={v => setFormData({...formData, description: v})} dir="rtl" />
            <TextareaField label="وصف الباقة (En)" value={formData.descriptionEn} onChange={v => setFormData({...formData, descriptionEn: v})} dir="ltr" />
            <InputField label="السعر (ج.م)" type="number" value={formData.price} onChange={v => setFormData({...formData, price: v})} />
            <InputField label="المدة" value={formData.duration} onChange={v => setFormData({...formData, duration: v})} />
            <div className="md:col-span-2">
                <MultiImageUpload label="صور الباقة" value={formData.images} onChange={urls => setFormData({...formData, images: urls})} />
            </div>
            <div className="md:col-span-2">
                <InputField label="ماذا تشمل؟" value={formData.includes} onChange={v => setFormData({...formData, includes: v})} />
            </div>
            <div className="md:col-span-2 flex items-center gap-2 p-3 bg-brand-orange/10 rounded-xl border border-brand-orange/20">
                <input type="checkbox" id="add-featured" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="w-5 h-5 accent-brand-orange" />
                <label htmlFor="add-featured" className="text-white text-sm font-bold cursor-pointer">تمييز في الصفحة الرئيسية</label>
            </div>
          </div>
          <button disabled={isSaving} className="w-full bg-brand-orange text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-orange/20 mt-6 transition-all hover:scale-[1.01]">
            {isSaving ? <Loader2 className="animate-spin" size={20}/> : <Save size={20}/>} إضافة الباقة الآن
          </button>
        </form>
      </Modal>

      {/* Edit Package Modal */}
      <Modal isOpen={!!editingPackage} onClose={() => setEditingPackage(null)} title={`تعديل: ${editingPackage?.name}`}>
        {editingPackage && (
          <form onSubmit={handleUpdate} className="space-y-4 max-h-[80vh] overflow-y-auto px-1">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 mr-2">تغيير المجموعة</label>
                    <select 
                        value={editingPackage.serviceId} 
                        onChange={e => setEditingPackage({...editingPackage, serviceId: e.target.value})}
                        className="w-full bg-[#111] border border-gray-800 text-white p-3 rounded-xl focus:border-brand-cyan outline-none"
                    >
                        {services.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                    </select>
                </div>
                <InputField label="اسم الباقة (ع)" value={editingPackage.name} onChange={v => setEditingPackage({...editingPackage, name: v})} dir="rtl" />
                <InputField label="اسم الباقة (En)" value={editingPackage.nameEn} onChange={v => setEditingPackage({...editingPackage, nameEn: v})} dir="ltr" />
                <TextareaField label="وصف الباقة (ع)" value={editingPackage.description} onChange={v => setEditingPackage({...editingPackage, description: v})} dir="rtl" />
                <TextareaField label="وصف الباقة (En)" value={editingPackage.descriptionEn} onChange={v => setEditingPackage({...editingPackage, descriptionEn: v})} dir="ltr" />
                <InputField label="السعر (ج.م)" type="number" value={String(editingPackage.price || "")} onChange={v => setEditingPackage({...editingPackage, price: v ? parseFloat(v) : null})} />
                <InputField label="المدة" value={editingPackage.duration || ""} onChange={v => setEditingPackage({...editingPackage, duration: v})} />
                <div className="md:col-span-2">
                    <MultiImageUpload label="تعديل الصور" value={editingPackage.images} onChange={urls => setEditingPackage({...editingPackage, images: urls})} />
                </div>
                <div className="md:col-span-2">
                    <InputField label="ماذا تشمل؟" value={editingPackage.includes || ""} onChange={v => setEditingPackage({...editingPackage, includes: v})} />
                </div>
                <div className="md:col-span-2 flex items-center gap-2 p-3 bg-brand-cyan/10 rounded-xl border border-brand-cyan/20">
                    <input type="checkbox" id="edit-featured" checked={editingPackage.featured} onChange={e => setEditingPackage({...editingPackage, featured: e.target.checked})} className="w-5 h-5 accent-brand-cyan" />
                    <label htmlFor="edit-featured" className="text-white text-sm font-bold cursor-pointer">مميز في الصفحة الرئيسية</label>
                </div>
             </div>
             <button disabled={isSaving} className="w-full bg-brand-cyan text-brand-navy py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-cyan/20 mt-6 transition-all hover:scale-[1.01]">
                {isSaving ? <Loader2 className="animate-spin" size={20}/> : <Save size={20}/>} حفظ التغييرات
             </button>
          </form>
        )}
      </Modal>

      {packages.length === 0 && !isLoading && (
          <div className="mt-20 text-center text-gray-600 bg-[#0a0a0a] border border-gray-800 p-16 rounded-[3rem]">
              <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ArrowRight size={32} className="opacity-20" />
              </div>
              <p className="text-xl">لا توجد باقات مضافة حالياً. ابدأ بإضافة أول باقة!</p>
          </div>
      )}
    </div>
  );
}

// Helper Components
function InputField({ label, value, onChange, type = "text", dir, required = false }: { label: string, value: string, onChange: (v: string) => void, type?: string, dir?: "rtl" | "ltr", required?: boolean }) {
  return (
    <div className="w-full">
      <label className="block text-xs font-bold text-gray-500 mb-1.5 mr-2">{label}</label>
      <input 
        required={required} type={type} value={value} 
        onChange={e => onChange(e.target.value)} 
        className="w-full border border-gray-800 bg-[#161616] text-white p-3 rounded-xl focus:border-brand-cyan outline-none transition-all" 
        dir={dir} 
      />
    </div>
  );
}

function TextareaField({ label, value, onChange, dir, required = false }: { label: string, value: string, onChange: (v: string) => void, dir?: "rtl" | "ltr", required?: boolean }) {
  return (
    <div className="w-full">
      <label className="block text-xs font-bold text-gray-500 mb-1.5 mr-2">{label}</label>
      <textarea 
        required={required} value={value} 
        onChange={e => onChange(e.target.value)} 
        className="w-full border border-gray-800 bg-[#161616] text-white p-3 rounded-xl focus:border-brand-cyan outline-none transition-all" 
        rows={3} dir={dir} 
      />
    </div>
  );
}

function Modal({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative bg-[#0a0a0a] border border-gray-800 w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-2xl"
      >
        <div className="flex items-center justify-between p-8 border-b border-gray-800 bg-[#0d0d0d]">
          <h3 className="text-2xl font-bold text-white font-heading">{title}</h3>
          <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-2xl transition-colors text-gray-400 group"><X size={24} className="group-hover:rotate-90 transition-transform" /></button>
        </div>
        <div className="p-8">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
