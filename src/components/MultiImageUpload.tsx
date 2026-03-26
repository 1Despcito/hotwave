"use client";

import { useState } from "react";
import { X, Upload, Loader2, Image as ImageIcon } from "lucide-react";

interface MultiImageUploadProps {
  label?: string;
  value: string[];
  onChange: (urls: string[]) => void;
}

export default function MultiImageUpload({ label, value = [], onChange }: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError("");

    const uploadPromises = Array.from(files).map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (res.ok && data.url) {
          return data.url;
        } else {
          throw new Error(data.error || "Upload failed");
        }
      } catch (err) {
        console.error("Upload error:", err);
        return null;
      }
    });

    try {
      const uploadedUrls = await Promise.all(uploadPromises);
      const validUrls = uploadedUrls.filter((url): url is string => !!url);
      
      if (validUrls.length < files.length) {
        setError("بعض الصور فشل رفعها");
      }
      
      onChange([...value, ...validUrls]);
    } catch (err) {
      setError("حدث خطأ أثناء الرفع");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="w-full">
      {label && <label className="mb-2 block text-sm font-medium text-gray-300">{label}</label>}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
        {value.map((url, index) => (
          <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-gray-800 group bg-black/20">
            <img src={url} alt={`Upload ${index}`} className="w-full h-full object-cover" />
            <button
              onClick={() => removeImage(index)}
              type="button"
              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
            <div className="absolute bottom-0 inset-x-0 bg-black/60 text-[10px] text-center py-0.5 text-white opacity-0 group-hover:opacity-100 transition-opacity">
              صورة {index + 1}
            </div>
          </div>
        ))}
        
        <label className={`aspect-square rounded-xl border-2 border-dashed border-gray-800 flex flex-col items-center justify-center cursor-pointer hover:border-brand-orange/50 hover:bg-brand-orange/5 transition-all ${isUploading ? 'pointer-events-none opacity-50' : ''}`}>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />
          {isUploading ? (
            <Loader2 className="h-6 w-6 text-brand-orange animate-spin" />
          ) : (
            <>
              <Upload className="h-6 w-6 text-gray-500 mb-1" />
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">رفع صور</span>
            </>
          )}
        </label>
      </div>

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
      
      <p className="text-[10px] text-gray-500 italic">
        * يمكنك رفع عدة صور في آن واحد. يتم تخزينها تلقائياً.
      </p>
    </div>
  );
}
