import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Clock, CheckCircle2, XCircle, Phone, CreditCard, Ship, MessageSquareDot, Star } from "lucide-react";
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

  const metrics = [
    { 
      title: "إجمالي الحجوزات", 
      value: bookingsCount, 
      icon: CreditCard, 
      color: "text-brand-orange", 
      bg: "bg-brand-orange/10",
      border: "hover:border-brand-orange/50" 
    },
    { 
      title: "رسائل غير مقروءة", 
      value: messagesCount, 
      icon: MessageSquareDot, 
      color: "text-red-500", 
      bg: "bg-red-500/10",
      border: "hover:border-red-500/50",
      alert: messagesCount > 0 
    },
    { 
      title: "البرامج السياحية", 
      value: servicesCount, 
      icon: Ship, 
      color: "text-brand-cyan", 
      bg: "bg-brand-cyan/10",
      border: "hover:border-brand-cyan/50" 
    },
    { 
      title: "آراء العملاء", 
      value: testimonialsCount, 
      icon: Star, 
      color: "text-yellow-500", 
      bg: "bg-yellow-500/10",
      border: "hover:border-yellow-500/50" 
    },
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white font-heading tracking-wide">نظرة عامة</h1>
          <p className="text-gray-400 text-sm mt-1">تابع إحصائيات موقعك وحجوزاتك بشكل لحظي</p>
        </div>
        <div className="bg-[#111] border border-gray-800 px-4 py-2 rounded-xl text-sm text-gray-400 shadow-inner inline-flex items-center gap-2 w-fit">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          النظام متصل ويعمل بسلاسة
        </div>
      </div>
      
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} className={`bg-[#0a0a0a] p-6 rounded-3xl shadow-xl border border-gray-800 ${metric.border} transition-colors group relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
              
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-3 rounded-2xl ${metric.bg} border border-white/5`}>
                  <Icon className={`w-6 h-6 ${metric.color}`} />
                </div>
                {metric.alert && (
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                )}
              </div>
              
              <div className="relative z-10">
                <h3 className="text-gray-400 text-sm font-medium mb-1">{metric.title}</h3>
                <p className="text-4xl font-bold text-white tracking-tight">{metric.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-[#0a0a0a] rounded-3xl p-6 border border-gray-800 shadow-xl">
        <AdminChart data={chartData} />
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="text-2xl font-bold text-white font-heading">أحدث طلبات الحجز</h2>
          <Link href="/ar/admin/bookings" className="text-brand-cyan hover:text-white transition-colors flex items-center gap-2 text-sm font-medium bg-brand-cyan/10 hover:bg-brand-cyan/20 px-4 py-2 rounded-full">
            عرض القائمة الكاملة
            <ArrowLeft className="w-4 h-4 rtl:mr-1" />
          </Link>
        </div>

        <div className="bg-[#0a0a0a] rounded-3xl border border-gray-800 overflow-hidden shadow-xl">
          {recentBookings.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mb-4 text-gray-700">
                <InboxIcon className="w-8 h-8" />
              </div>
              <p className="text-gray-400">لا توجد حجوزات حديثة حتى الآن.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm text-gray-300">
                <thead className="bg-[#111111] text-gray-400 uppercase font-semibold text-xs border-b border-gray-800">
                  <tr>
                    <th className="px-6 py-5 rounded-tr-3xl">العميل</th>
                    <th className="px-6 py-5">البرنامج السياحي</th>
                    <th className="px-6 py-5">المجموعة/الباقة</th>
                    <th className="px-6 py-5">موعد التسجيل</th>
                    <th className="px-6 py-5 rounded-tl-3xl">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {recentBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-white group-hover:text-brand-orange transition-colors">{b.customerName || "غير معروف"}</div>
                        <div className="flex items-center gap-1.5 text-xs text-brand-cyan mt-1" dir="ltr"><Phone className="w-3 h-3" /> {b.phoneNumber}</div>
                      </td>
                      <td className="px-6 py-4 font-medium">{b.serviceName}</td>
                      <td className="px-6 py-4 text-gray-400">{b.packageName || "-"}</td>
                      <td className="px-6 py-4 text-gray-500 font-mono text-xs" dir="ltr">{new Date(b.createdAt).toLocaleString('en-GB')}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold
                          ${b.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 
                            b.status === 'BOOKED' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                            b.status === 'CANCELLED' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                            'bg-gray-800 text-gray-300'}
                        `}>
                          {b.status === 'PENDING' && <Clock className="w-3.5 h-3.5" />}
                          {b.status === 'BOOKED' && <CheckCircle2 className="w-3.5 h-3.5" />}
                          {b.status === 'CANCELLED' && <XCircle className="w-3.5 h-3.5" />}
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
    </div>
  );
}

function InboxIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}
