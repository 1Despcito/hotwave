"use client";

import { useState, useEffect } from "react";
import { Clock, CheckCircle2, XCircle, Phone, Search, Loader2, CalendarCheck, ExternalLink, MapPin, Download } from "lucide-react";
import toast from "react-hot-toast";

type Booking = {
  id: string;
  customerName: string | null;
  phoneNumber: string | null;
  customerEmail: string | null;
  serviceName: string;
  packageName: string | null;
  hotelName: string | null;
  adults: number;
  children: number;
  bookingDate: string | null;
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
      toast.success("Booking status updated successfully");
      fetchBookings();
    } else {
      toast.error("Failed to update status");
    }
  };

  const filtered = bookings.filter(b => 
    (b.customerName || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
    (b.phoneNumber || "").includes(searchTerm) ||
    b.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToCSV = () => {
    if (filtered.length === 0) {
      toast.error("No data to export");
      return;
    }
    
    const headers = ["Booking ID", "Customer", "Phone", "Email", "Service/Trip", "Package", "Hotel", "Adults", "Children", "Trip Date", "Status", "Notes", "Creation Date"];
    
    const csvContent = [
      headers.join(","),
      ...filtered.map(b => [
        b.id,
        `"${b.customerName || ''}"`,
        `"${b.phoneNumber || ''}"`,
        `"${b.customerEmail || ''}"`,
        `"${b.serviceName || ''}"`,
        `"${b.packageName || ''}"`,
        `"${b.hotelName || ''}"`,
        b.adults || 0,
        b.children || 0,
        b.bookingDate ? new Date(b.bookingDate).toLocaleDateString('en-US') : "",
        b.status,
        `"${(b.notes || '').replace(/"/g, '""')}"`,
        new Date(b.createdAt).toLocaleString('en-US')
      ].join(","))
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `hotwave_bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported successfully");
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white font-heading">Bookings Tracker 📋</h1>
          <p className="text-gray-400 mt-2 text-sm">Track everyone who clicked booking buttons across the site to avoid losing any potential leads.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search by name or phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#111111] border border-gray-800 text-white rounded-full py-2.5 pl-10 pr-4 focus:outline-none focus:border-brand-cyan/50 transition-colors placeholder:text-gray-600 shadow-inner"
            />
          </div>
          
          <button 
            onClick={exportToCSV}
            className="flex items-center justify-center gap-2 bg-brand-navy-light border border-gray-700 hover:border-brand-cyan hover:text-brand-cyan text-gray-300 px-5 py-2.5 rounded-full transition-all text-sm font-bold shadow-lg"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
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
            <p className="text-lg">No bookings found matching your search.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-[#111111] text-gray-400 uppercase font-semibold text-xs border-b border-gray-800">
                <tr>
                  <th className="px-6 py-5">Customer</th>
                  <th className="px-6 py-5">Trip / Hotel</th>
                  <th className="px-6 py-5">Pax</th>
                  <th className="px-6 py-5">Date & Time</th>
                  <th className="px-6 py-5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-5">
                      <div className="font-bold text-white text-base">{b.customerName || "No name provided"}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1.5 text-xs text-brand-cyan/80 font-medium bg-brand-cyan/10 w-fit px-2 py-0.5 rounded" dir="ltr">
                          <Phone className="w-3 h-3" /> {b.phoneNumber || (b.customerEmail ? "Email Only" : "No number")}
                        </div>
                        {b.phoneNumber && (
                          <a 
                            href={`https://wa.me/${b.phoneNumber.replace(/\+/g, '').replace(/\s/g, '')}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-1 px-2 bg-green-500/20 text-green-400 rounded-md hover:bg-green-500 hover:text-white text-[10px] font-bold transition-all flex items-center gap-1"
                          >
                            WhatsApp <ExternalLink size={10}/>
                          </a>
                        )}
                      </div>
                      {b.customerEmail && (
                        <div className="text-[10px] text-gray-500 mt-1 flex items-center gap-1.5 ml-1 overflow-hidden text-ellipsis whitespace-nowrap max-w-[180px]">
                          📧 {b.customerEmail}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-medium text-gray-200">{b.serviceName}</div>
                      {b.packageName && <div className="text-brand-orange text-xs mt-0.5 font-semibold">{b.packageName}</div>}
                      {b.hotelName && (
                        <div className="mt-1.5 flex items-center gap-1.5 text-brand-cyan text-xs font-medium">
                          <MapPin size={12}/> {b.hotelName}
                        </div>
                      )}
                      {b.notes && (
                        <div className="mt-2 p-2 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400 italic leading-relaxed max-w-xs">
                          💬 {b.notes}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-white font-bold text-lg">
                          {(b.adults || 0) + (b.children || 0)} <span className="text-[10px] text-gray-500 font-normal">Persons</span>
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500">
                          <span>{b.adults} Adults</span>
                          {b.children > 0 && <span>• {b.children} Children</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      {b.bookingDate ? (
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-brand-orange font-bold whitespace-nowrap text-lg">
                            {new Date(b.bookingDate).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })}
                          </span>
                          <span className="text-[10px] text-gray-500 mt-1">Requested: {new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500 italic text-xs">Not specified</span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center">
                        <select
                          value={b.status}
                          onChange={(e) => updateStatus(b.id, e.target.value)}
                          className={`appearance-none font-bold text-[10px] px-3 py-2 rounded-xl outline-none border cursor-pointer transition-all text-center
                            ${b.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20' : 
                              b.status === 'BOOKED' ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20' : 
                              b.status === 'CONTACTED' ? 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20 hover:bg-brand-cyan/20' :
                              'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'}
                          `}
                        >
                          <option value="PENDING">⏳ Pending</option>
                          <option value="CONTACTED">📞 Contacted</option>
                          <option value="BOOKED">✅ Booked</option>
                          <option value="CANCELLED">❌ Cancelled</option>
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
