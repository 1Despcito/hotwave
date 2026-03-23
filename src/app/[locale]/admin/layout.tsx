"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, LogOut, MessageSquare, Settings, Star, Briefcase, CalendarCheck } from "lucide-react";
import { Toaster } from "react-hot-toast";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { name: "الرئيسية", href: "/admin", icon: LayoutDashboard },
    { name: "الحجوزات (Leads)", href: "/admin/bookings", icon: CalendarCheck },
    { name: "الخدمات", href: "/admin/services", icon: Briefcase },
    { name: "آراء العملاء", href: "/admin/testimonials", icon: Star },
    { name: "الرسائل", href: "/admin/messages", icon: MessageSquare },
    { name: "إعدادات الموقع", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 flex flex-col md:flex-row" dir="rtl">
      <aside className="w-full md:w-64 bg-[#111111] border-l border-gray-800 flex-shrink-0">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">لوحة التحكم</h2>
        </div>
        <nav className="mt-6 flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Icon className="ml-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
          
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full mt-8 flex items-center px-4 py-3 text-red-400 hover:bg-gray-800 hover:text-red-300 rounded-md transition-colors"
          >
            <LogOut className="ml-3 h-5 w-5" />
            تسجيل الخروج
          </button>
        </nav>
      </aside>
      
      
      <main className="flex-1 p-8 overflow-y-auto bg-[#0a0a0a]">
        {children}
        <Toaster 
          position="bottom-left" 
          toastOptions={{
            style: { background: '#333', color: '#fff' },
            success: { iconTheme: { primary: '#10B981', secondary: '#fff' } }
          }} 
        />
      </main>
    </div>
  );
}
