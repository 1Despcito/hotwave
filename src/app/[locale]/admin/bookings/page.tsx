"use client";

import { useState, useEffect } from "react";
import { Clock, CheckCircle2, XCircle, Phone, Search, Loader2, CalendarCheck } from "lucide-react";
import toast from "react-hot-toast";

type Booking = {
  id: string;
  customerName: string | null;
  phoneNumber: string | null;
  customerEmail: string | null;
  serviceName: string;
  packageName: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
};

export default function BookingsAdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings");
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      toast.success("تم تحديث حالة الحجز بنجاح");
      fetchBookings();
    } else {
      toast.error("فشل تحديث الحالة");
    }
  };

  const filtered = bookings.filter(b => 
    (b.customerName || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
    (b.phoneNumber || "").includes(searchTerm) ||
    b.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white font-heading">متتبع الحجوزات 📋</h1>
          <p className="text-gray-400 mt-2 text-sm">متابعة كل من نقر على أزرار الحجز عبر الموقع لتفادي خسارة أي عميل محتمل لم يكمل محادثة الواتساب.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="بحث بالرقم أو الاسم..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#111111] border border-gray-800 text-white rounded-full py-2 pr-10 pl-4 focus:outline-none focus:border-brand-cyan/50 transition-colors placeholder:text-gray-600"
          />
        </div>
      </div>

      <div className="bg-[#0a0a0a] rounded-3xl border border-gray-800 overflow-hidden shadow-xl min-h-[400px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-[400px]">
            <Loader2 className="w-8 h-8 text-brand-orange animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center text-gray-500">
            <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
               <CalendarCheck className="w-8 h-8 opacity-50" />
            </div>
            <p className="text-lg">لا توجد حجوزات تطابق البحث.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm text-gray-300">
              <thead className="bg-[#111111] text-gray-400 uppercase font-semibold text-xs border-b border-gray-800">
                <tr>
                  <th className="px-6 py-5 rounded-tr-3xl">العميل</th>
                  <th className="px-6 py-5">الخدمة / الباقة</th>
                  <th className="px-6 py-5">التاريخ</th>
                  <th className="px-6 py-5 text-center rounded-tl-3xl">تحديث الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-5">
                      <div className="font-bold text-white text-base">{b.customerName || "لم يكتب اسمه"}</div>
                      <div className="flex items-center gap-1.5 text-xs text-brand-cyan/80 mt-1 font-medium bg-brand-cyan/10 w-fit px-2 py-0.5 rounded" dir="ltr">
                        <Phone className="w-3 h-3" /> {b.phoneNumber || (b.customerEmail ? "تواصل عبر البريد" : "تواصل مباشر عبر الواتساب")}
                      </div>
                      {b.customerEmail && (
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-1.5 mr-1 overflow-hidden text-ellipsis whitespace-nowrap max-w-[180px]">
                          📧 {b.customerEmail}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-medium text-gray-200">{b.serviceName}</div>
                      {b.packageName && <div className="text-brand-orange text-xs mt-1 font-semibold">{b.packageName}</div>}
                      {b.notes && (
                        <div className="mt-2 p-2 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400 italic leading-relaxed max-w-xs">
                          💬 {b.notes}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5 text-gray-400" dir="ltr">
                      {new Date(b.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <select
                          value={b.status}
                          onChange={(e) => updateStatus(b.id, e.target.value)}
                          className={`appearance-none font-semibold text-xs px-4 py-2 rounded-xl outline-none border cursor-pointer transition-all
                            ${b.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20' : 
                              b.status === 'BOOKED' ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20' : 
                              b.status === 'CONTACTED' ? 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20 hover:bg-brand-cyan/20' :
                              'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'}
                          `}
                        >
                          <option value="PENDING">⏳ قيد الانتظار</option>
                          <option value="CONTACTED">📞 تم التواصل</option>
                          <option value="BOOKED">✅ مؤكد</option>
                          <option value="CANCELLED">❌ ملغي</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
