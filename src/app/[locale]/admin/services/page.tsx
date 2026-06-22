"use client";

import { useState, useEffect } from "react";
import ImageUpload from "@/components/ImageUpload";
import MultiImageUpload from "@/components/MultiImageUpload";
import { ChevronDown, ChevronUp, Plus, Trash2, X, Edit3, Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

type ServiceType = {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  price: number | null;
  imageUrl: string | null;
  images: string[];
  duration?: string | null;
  durationEn?: string | null;
  includes?: string | null;
  includesEn?: string | null;
  notIncludes?: string | null;
  notIncludesEn?: string | null;
  featured: boolean;
};

type Service = {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  imageUrl: string | null;
  images: string[];
  icon?: string | null;
  types: ServiceType[];
};

const emptyTypeForm = { name: "", nameEn: "", description: "", descriptionEn: "", price: "", imageUrl: "", duration: "", durationEn: "", includes: "", includesEn: "", notIncludes: "", notIncludesEn: "" };

export default function ServicesAdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({ title: "", titleEn: "", description: "", descriptionEn: "", images: [] as string[] });
  const [isAdding, setIsAdding] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // States for dynamic type adding
  const [typeForm, setTypeForm] = useState<Record<string, typeof emptyTypeForm>>({});
  const [addingTypeFor, setAddingTypeFor] = useState<string | null>(null);

  // States for Editing Modals
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingType, setEditingType] = useState<{serviceId: string, type: ServiceType} | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => { 
    fetchServices(); 
    console.log("Hot Wave Admin UI - V2 loaded with NotIncluded fields");
  }, []);

  const fetchServices = async () => {
    const res = await fetch("/api/services");
    if (res.ok) setServices(await res.json());
    setIsLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.images.length === 0) {
        toast.error("برجاء رفع صور للخدمة أولاً");
        return;
    }
    setIsAdding(true);
    const res = await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        title: formData.titleEn,
        description: formData.descriptionEn
      }),
    });
    if (res.ok) {
      setFormData({ title: "", titleEn: "", description: "", descriptionEn: "", images: [] });
      toast.success("Service added successfully");
      fetchServices();
    } else {
      toast.error("Error adding service");
    }
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    console.log("Deleting service group:", id);
    if (!confirm("Are you sure you want to delete this group? All its packages will be permanently removed!")) return;
    try {
      const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Service group deleted successfully");
        fetchServices();
      } else {
        const err = await res.json();
        console.error("Delete failed:", err);
        toast.error("Failed to delete: " + (err.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("An error occurred during deletion");
    }
  };

  const handleUpdateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    setIsUpdating(true);
    const res = await fetch(`/api/services/${editingService.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...editingService,
        title: editingService.titleEn,
        description: editingService.descriptionEn
      }),
    });
    if (res.ok) {
      toast.success("Updated successfully");
      setEditingService(null);
      fetchServices();
    } else {
      toast.error("Update failed");
    }
    setIsUpdating(false);
  };

  const handleUpdateType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingType) return;
    setIsUpdating(true);
    const res = await fetch(`/api/services/${editingType.serviceId}/types/${editingType.type.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...editingType.type,
        name: editingType.type.nameEn,
        description: editingType.type.descriptionEn,
        duration: editingType.type.durationEn,
        includes: editingType.type.includesEn,
        notIncludes: editingType.type.notIncludesEn
      }),
    });
    if (res.ok) {
      toast.success("Package updated successfully");
      setEditingType(null);
      fetchServices();
    } else {
      toast.error("Failed to update");
    }
    setIsUpdating(false);
  };

  const handleAddType = async (serviceId: string) => {
    const form = typeForm[serviceId] || emptyTypeForm;
    const res = await fetch(`/api/services/${serviceId}/types`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        ...form, 
        name: form.nameEn,
        description: form.descriptionEn,
        duration: form.durationEn,
        includes: form.includesEn,
        notIncludes: form.notIncludesEn,
        price: form.price ? parseFloat(form.price as string) : null 
      }),
    });
    if (res.ok) {
      setTypeForm(prev => ({ ...prev, [serviceId]: { ...emptyTypeForm } }));
      toast.success("Package added successfully");
      fetchServices();
    } else {
      toast.error("Failed to add");
    }
    setAddingTypeFor(null);
  };

  const handleDeleteType = async (serviceId: string, typeId: string) => {
    console.log("Deleting package:", typeId, "from service:", serviceId);
    if (!confirm("Are you sure you want to delete this package?")) return;
    try {
      const res = await fetch(`/api/services/${serviceId}/types/${typeId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Package deleted successfully");
        fetchServices();
      } else {
        const err = await res.json();
        console.error("Delete failed:", err);
        toast.error("Failed to delete: " + (err.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("An error occurred during deletion");
    }
  };

  const getTypeForm = (id: string) => typeForm[id] || { ...emptyTypeForm };
  const setTypeFormFor = (id: string, field: string, value: string) =>
    setTypeForm(prev => ({ ...prev, [id]: { ...(prev[id] || emptyTypeForm), [field]: value } }));

  if (isLoading) return <div className="text-white flex items-center justify-center min-h-[400px]"><Loader2 className="animate-spin mr-2" /> Loading data...</div>;

  return (
    <div className="pb-20">
      <h1 className="text-3xl font-bold text-white mb-6 font-heading">Programs Management 🚢</h1>

      {/* Add Service Section */}
      <div className="bg-[#0a0a0a] p-6 md:p-8 rounded-3xl shadow-xl border border-gray-800 mb-8">
        <h2 className="text-xl font-bold text-white mb-6 border-b border-gray-800 pb-4">Add New Trip Group</h2>
        <form onSubmit={handleAdd} className="space-y-4 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Title" value={formData.titleEn} onChange={v => setFormData({ ...formData, titleEn: v })} dir="ltr" required />
            <TextareaField label="Description" value={formData.descriptionEn} onChange={v => setFormData({ ...formData, descriptionEn: v })} dir="ltr" required />
          </div>
          <div className="border border-gray-800 bg-[#1a1a1a] p-6 rounded-2xl">
            <MultiImageUpload label="Group Cover Images" value={formData.images} onChange={(urls) => setFormData({ ...formData, images: urls })} />
          </div>
          <button disabled={isAdding} className="bg-brand-orange text-white px-8 py-3 rounded-xl hover:bg-brand-orange/90 disabled:opacity-50 transition-all font-bold shadow-lg shadow-brand-orange/20">
            {isAdding ? "Adding..." : "Add Group"}
          </button>
        </form>
      </div>

      {/* Services List */}
      <div className="space-y-6">
        {services.length === 0 && (
          <div className="bg-[#111111] p-12 text-center text-gray-500 rounded-3xl border border-gray-800">
            <Plus className="w-12 h-12 mx-auto mb-4 opacity-20" />
            No program groups added yet.
          </div>
        )}
        {services.map(service => (
          <div key={service.id} className="bg-[#0a0a0a] rounded-3xl border border-gray-800 overflow-hidden shadow-lg transition-all hover:border-gray-700">
            {/* Service Header Row */}
            <div 
              onClick={() => setExpandedId(expandedId === service.id ? null : service.id)}
              className="flex flex-col md:flex-row items-center gap-4 p-5 cursor-pointer hover:bg-white/5 transition-colors"
            >
              {service.images && service.images.length > 0 ? (
                <img src={service.images[0]} alt={service.title} className="h-20 w-32 rounded-2xl object-cover flex-shrink-0 border border-gray-800 shadow-md" />
              ) : service.imageUrl ? (
                <img src={service.imageUrl} alt={service.title} className="h-20 w-32 rounded-2xl object-cover flex-shrink-0 border border-gray-800 shadow-md" />
              ) : null}
              <div className="flex-1 min-w-0 text-center md:text-right">
                <p className="text-white text-lg font-bold">{service.title}</p>
                <p className="text-gray-500 text-sm font-medium" dir="ltr">{service.titleEn}</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap justify-center" onClick={(e) => e.stopPropagation()}>
                <span className="text-xs font-bold text-gray-400 bg-gray-800/50 px-3 py-1.5 rounded-full border border-gray-800">
                  {service.types.length} Packages / Sub-services
                </span>
                <button
                  onClick={() => setExpandedId(expandedId === service.id ? null : service.id)}
                  className="flex items-center gap-1.5 text-sm text-brand-cyan hover:text-white px-4 py-2 rounded-xl border border-brand-cyan/20 hover:bg-brand-cyan hover:border-brand-cyan transition-all"
                >
                  {expandedId === service.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {expandedId === service.id ? "Collapse" : "Manage Packages"}
                </button>
                <button onClick={() => setEditingService(service)} className="text-gray-400 hover:text-brand-orange transition-colors p-2 bg-gray-900 rounded-xl border border-gray-800">
                  <Edit3 className="w-5 h-5" />
                </button>
                <button onClick={() => handleDelete(service.id)} className="text-gray-400 hover:text-red-500 transition-colors p-2 bg-gray-900 rounded-xl border border-gray-800">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Expanded Content: Sub-items & Add Form */}
            <AnimatePresence>
              {expandedId === service.id && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: "auto", opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-gray-800 bg-[#050505] overflow-hidden"
                >
                  <div className="p-6">
                    <h3 className="text-xs font-bold text-gray-500 mb-6 uppercase tracking-widest flex items-center gap-2">
                        <div className="h-px bg-gray-800 flex-1" />
                        Available Packages & Services
                        <div className="h-px bg-gray-800 flex-1" />
                    </h3>

                    {/* Simple list of sub-packages */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                      {service.types.map(type => (
                        <div key={type.id} className="group relative bg-[#0d0d0d] border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 transition-all flex flex-col h-full">
                           <div className="relative h-32 w-full">
                                {type.imageUrl ? (
                                    <img src={type.imageUrl} alt={type.name} className="h-full w-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all" />
                                ) : (
                                    <div className="h-full w-full bg-gray-900 flex items-center justify-center text-gray-700 font-bold uppercase tracking-tighter text-[10px]">No Image</div>
                                )}
                                <div className="absolute top-2 right-2 flex gap-1 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                                    <button onClick={() => setEditingType({serviceId: service.id, type})} className="p-1.5 bg-brand-orange text-white rounded-lg shadow-lg hover:scale-105"><Edit3 size={14}/></button>
                                    <button onClick={() => handleDeleteType(service.id, type.id)} className="p-1.5 bg-red-500 text-white rounded-lg shadow-lg hover:scale-105"><X size={14}/></button>
                                </div>
                           </div>
                           <div className="p-4 flex-1">
                                <p className="text-white text-sm font-bold truncate">{type.name}</p>
                                <p className="text-gray-500 text-[10px] mb-2" dir="ltr">{type.nameEn}</p>
                                {type.price && <p className="text-brand-cyan text-sm font-bold mb-2">{type.price} €</p>}
                                <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">{type.descriptionEn || type.description}</p>
                           </div>
                        </div>
                      ))}
                      
                      {/* Add Button Placeholder - triggers form below */}
                      <div className="flex items-center justify-center bg-[#0d0d0d] border-2 border-dashed border-gray-800 rounded-2xl p-6 h-full text-gray-600 hover:text-brand-cyan hover:border-brand-cyan/50 transition-all cursor-default">
                        <div className="text-center">
                            <Plus size={24} className="mx-auto mb-2 opacity-50" />
                            <p className="text-xs font-bold">Add new package below</p>
                        </div>
                      </div>
                    </div>

                    {/* New Integrated Add Type Form */}
                    <div className="bg-[#0d0d0d] border border-gray-800 rounded-3xl p-6 shadow-inner">
                        <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Plus className="w-4 h-4 text-brand-orange" /> Add New Package to this Group</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="Package Name" value={getTypeForm(service.id).nameEn} onChange={v => setTypeFormFor(service.id, "nameEn", v)} dir="ltr" />
                            <TextareaField label="Description" value={getTypeForm(service.id).descriptionEn} onChange={v => setTypeFormFor(service.id, "descriptionEn", v)} dir="ltr" />
                            <InputField label="Price (€)" type="number" value={getTypeForm(service.id).price} onChange={v => setTypeFormFor(service.id, "price", v)} />
                            <InputField label="Duration (e.g. 8 hours)" value={getTypeForm(service.id).durationEn} onChange={v => setTypeFormFor(service.id, "durationEn", v)} dir="ltr" />
                            <InputField label="What's Included?" value={getTypeForm(service.id).includesEn} onChange={v => setTypeFormFor(service.id, "includesEn", v)} dir="ltr" />
                            <InputField label="What's Not Included?" value={getTypeForm(service.id).notIncludesEn} onChange={v => setTypeFormFor(service.id, "notIncludesEn", v)} dir="ltr" />
                            <div className="md:col-span-2 mt-2 bg-black/40 p-4 rounded-2xl border border-gray-800">
                                <ImageUpload label="Package Image" value={getTypeForm(service.id).imageUrl} onChange={v => setTypeFormFor(service.id, "imageUrl", v)} />
                            </div>
                        </div>
                        <button 
                            onClick={() => handleAddType(service.id)} 
                            disabled={addingTypeFor === service.id || !getTypeForm(service.id).nameEn}
                            className="w-full md:w-auto mt-6 bg-brand-cyan text-brand-navy px-10 py-3 rounded-xl font-bold hover:brightness-110 shadow-lg shadow-brand-cyan/20 transition-all disabled:opacity-50"
                        >
                            {addingTypeFor === service.id ? "Adding..." : "Save New Package"}
                        </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Edit Service Modal */}
      <Modal isOpen={!!editingService} onClose={() => setEditingService(null)} title="Edit Group Data">
        {editingService && (
            <form onSubmit={handleUpdateService} className="space-y-4">
                <InputField label="Title" value={editingService.titleEn} onChange={v => setEditingService({...editingService, titleEn: v})} dir="ltr" />
                <TextareaField label="Description" value={editingService.descriptionEn} onChange={v => setEditingService({...editingService, descriptionEn: v})} dir="ltr" />
                <div className="bg-black/20 p-4 rounded-xl border border-gray-800">
                    <MultiImageUpload label="Group Images" value={editingService.images || []} onChange={urls => setEditingService({...editingService, images: urls})} />
                </div>
                <button disabled={isUpdating} className="w-full bg-brand-orange py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                    {isUpdating ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>} Save Changes
                </button>
            </form>
        )}
      </Modal>

      {/* Edit Type Modal */}
      <Modal isOpen={!!editingType} onClose={() => setEditingType(null)} title="Edit Package">
        {editingType && (
            <form onSubmit={handleUpdateType} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
                 <InputField label="Package Name" value={editingType.type.nameEn} onChange={v => setEditingType({...editingType, type: {...editingType.type, nameEn: v}})} dir="ltr" />
                 <TextareaField label="Description" value={editingType.type.descriptionEn} onChange={v => setEditingType({...editingType, type: {...editingType.type, descriptionEn: v}})} dir="ltr" />
                 <div className="grid grid-cols-2 gap-4">
                    <InputField label="Price (€)" type="number" value={String(editingType.type.price || "")} onChange={v => setEditingType({...editingType, type: {...editingType.type, price: v ? parseFloat(v) : null}})} />
                    <InputField label="Duration" value={editingType.type.durationEn || ""} onChange={v => setEditingType({...editingType, type: {...editingType.type, durationEn: v}})} dir="ltr" />
                 </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="What's Included?" value={editingType.type.includesEn || ""} onChange={v => setEditingType({...editingType, type: {...editingType.type, includesEn: v}})} dir="ltr" />
                    <InputField label="What's Not Included?" value={editingType.type.notIncludesEn || ""} onChange={v => setEditingType({...editingType, type: {...editingType.type, notIncludesEn: v}})} dir="ltr" />
                  </div>
                  <ImageUpload label="Change Image" value={editingType.type.imageUrl || ""} onChange={url => setEditingType({...editingType, type: {...editingType.type, imageUrl: url}})} />
                 <div className="flex items-center gap-2 p-3 bg-brand-orange/10 border border-brand-orange/20 rounded-xl">
                    <input 
                        type="checkbox" 
                        id="featured-toggle"
                        checked={editingType.type.featured} 
                        onChange={e => setEditingType({...editingType, type: {...editingType.type, featured: e.target.checked}})}
                        className="w-5 h-5 accent-brand-orange"
                    />
                    <label htmlFor="featured-toggle" className="text-white font-bold cursor-pointer">Show in "Featured Trips" on Homepage</label>
                 </div>
                 <button disabled={isUpdating} className="w-full bg-brand-cyan text-brand-navy py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                    {isUpdating ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>} حفظ التعديلات
                </button>
            </form>
        )}
      </Modal>
    </div>
  );
}

// Helper Components for Admin Forms
function InputField({ label, value, onChange, type = "text", dir, required = false }: { label: string, value: string, onChange: (v: string) => void, type?: string, dir?: "rtl" | "ltr", required?: boolean }) {
  return (
    <div className="w-full">
      <label className="block text-xs font-bold text-gray-500 mb-1.5 mr-2">{label}</label>
      <input 
        required={required} type={type} value={value} 
        onChange={e => onChange(e.target.value)} 
        className="w-full border border-gray-800 bg-[#161616] text-white p-3 rounded-xl focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan/20 outline-none transition-all" 
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
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative bg-[#0a0a0a] border border-gray-800 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-[#111] ">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400"><X size={20}/></button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
