import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Clock, CheckCircle2, XCircle, Phone } from "lucide-react";
import AdminChart from "@/components/AdminChart";

export default async function AdminDashboard() {
  const [messagesCount, servicesCount, testimonialsCount, bookingsCount, recentBookings, bookingsByService] = await Promise.all([
    prisma.message.count({ where: { read: false } }),
    prisma.service.count(),
    prisma.testimonial.count(),
    prisma.booking.count(),
    prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.booking.groupBy({
      by: ['serviceName'],
      _count: { serviceName: true }
    })
  ]);

  const chartData = bookingsByService.map(item => ({
    name: item.serviceName,
    count: item._count.serviceName
  }));

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">نظرة عامة</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#111111] p-6 rounded-2xl shadow-lg border border-gray-800 hover:border-brand-orange/50 transition-colors">
          <h3 className="text-lg font-medium text-gray-400">إجمالي الحجوزات</h3>
          <p className="mt-2 text-4xl font-bold text-white">{bookingsCount}</p>
        </div>

        <div className="bg-[#111111] p-6 rounded-2xl shadow-lg border border-gray-800 hover:border-brand-cyan/50 transition-colors relative">
          <h3 className="text-lg font-medium text-gray-400">رسائل جديدة</h3>
          <p className="mt-2 text-4xl font-bold text-white">{messagesCount}</p>
          {messagesCount > 0 && <span className="absolute top-6 left-6 w-3 h-3 bg-red-500 rounded-full animate-pulse" />}
        </div>
        
        <div className="bg-[#111111] p-6 rounded-2xl shadow-lg border border-gray-800">
          <h3 className="text-lg font-medium text-gray-400">الخدمات النشطة</h3>
          <p className="mt-2 text-4xl font-bold text-white">{servicesCount}</p>
        </div>
        
        <div className="bg-[#111111] p-6 rounded-2xl shadow-lg border border-gray-800">
          <h3 className="text-lg font-medium text-gray-400">آراء العملاء</h3>
          <p className="mt-2 text-4xl font-bold text-white">{testimonialsCount}</p>
        </div>
      </div>

      <div className="mt-8">
        <AdminChart data={chartData} />
      </div>

      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">أحدث الحجوزات</h2>
          <Link href="/admin/bookings" className="text-brand-cyan hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
            عرض الكل
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-[#111111] rounded-2xl border border-gray-800 overflow-hidden shadow-xl">
          {recentBookings.length === 0 ? (
            <div className="p-8 text-center text-gray-500">لا توجد حجوزات حديثة.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm text-gray-300">
                <thead className="bg-[#1a1a1a] text-gray-400 uppercase font-semibold text-xs border-b border-gray-800">
                  <tr>
                    <th className="px-6 py-4">العميل</th>
                    <th className="px-6 py-4">الخدمة</th>
                    <th className="px-6 py-4">الباقة</th>
                    <th className="px-6 py-4">التاريخ</th>
                    <th className="px-6 py-4">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {recentBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-white">{b.customerName || "غير معروف"}</div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1" dir="ltr"><Phone className="w-3 h-3" /> {b.phoneNumber}</div>
                      </td>
                      <td className="px-6 py-4 font-medium">{b.serviceName}</td>
                      <td className="px-6 py-4 text-brand-cyan">{b.packageName || "-"}</td>
                      <td className="px-6 py-4 text-gray-400" dir="ltr">{new Date(b.createdAt).toLocaleDateString('en-GB')}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
                          ${b.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 
                            b.status === 'BOOKED' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                            b.status === 'CANCELLED' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                            'bg-gray-800 text-gray-300'}
                        `}>
                          {b.status === 'PENDING' && <Clock className="w-3 h-3" />}
                          {b.status === 'BOOKED' && <CheckCircle2 className="w-3 h-3" />}
                          {b.status === 'CANCELLED' && <XCircle className="w-3 h-3" />}
                          {b.status === 'PENDING' ? 'قيد الانتظار' : b.status === 'BOOKED' ? 'مؤكد' : b.status === 'CANCELLED' ? 'ملغي' : 'تم التواصل'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8 bg-gradient-to-r from-brand-orange/10 to-transparent p-6 rounded-2xl border border-brand-orange/20">
        <h2 className="text-xl font-bold text-brand-orange mb-2">تلميح إداري</h2>
        <p className="text-gray-300 text-sm leading-relaxed">
          جميع الأزرار والروابط في صفحة الخدمات للزوار تصب مباشرة في الواتساب، 
          وأي نقرة على "حجز" يتم تسجيلها في قسم الحجوزات لتتابعها لاحقاً في حالة عدم اكتمال المحادثة على الواتس.
        </p>
      </div>
    </div>
  );
}
