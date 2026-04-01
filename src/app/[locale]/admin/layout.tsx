"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  LogOut, 
  MessageSquare, 
  Settings, 
  Star, 
  Briefcase, 
  CalendarCheck,
  Menu,
  X,
  Tag
} from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useState } from "react";
import GoogleTranslator from "@/components/GoogleTranslator";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navGroups = [
    {
      title: "Overview",
      items: [
        { name: "Dashboard", href: "/en/admin", icon: LayoutDashboard },
      ]
    },
    {
      title: "Bookings & Chat",
      items: [
        { name: "Leads", href: "/en/admin/bookings", icon: CalendarCheck },
        { name: "Bot Chat", href: "/en/admin/conversations", icon: MessageSquare },
        { name: "Inbox", href: "/en/admin/messages", icon: MessageSquare },
      ]
    },
    {
      title: "Content",
      items: [
        { name: "Programs", href: "/en/admin/services", icon: Briefcase },
        { name: "Packages", href: "/en/admin/packages", icon: Tag },
        { name: "Testimonials", href: "/en/admin/testimonials", icon: Star },
      ]
    },
    {
      title: "System",
      items: [
        { name: "Site Settings", href: "/en/admin/settings", icon: Settings },
      ]
    }
  ];

  const renderSidebarContent = () => (
    <>
      {/* Brand */}
      <div className="p-6 border-b border-gray-800/50 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-brand-orange/5 to-transparent">
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-brand-orange to-brand-cyan flex items-center justify-center text-white font-bold text-lg shadow-[0_0_20px_rgba(255,107,0,0.3)] border-2 border-[#1a1a1a]">
          HW
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold font-heading tracking-widest text-white">
            HOT <span className="text-brand-orange">WAVE</span>
          </h2>
          <span className="text-xs text-brand-cyan font-semibold uppercase tracking-widest mt-1 block">Admin Control</span>
        </div>
      </div>

      {/* Translator in Admin */}
      <div className="px-6 py-4 border-b border-gray-800/30 bg-white/5 mx-4 mt-4 rounded-xl flex justify-center">
        <GoogleTranslator />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-8">
        {navGroups.map((group, idx) => (
          <div key={idx}>
            <h3 className="text-xs font-semibold text-gray-500 mb-3 px-3 uppercase tracking-wider">{group.title}</h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isDashboard = item.href === '/en/admin';
                const isActive = isDashboard ? pathname === item.href : pathname.startsWith(item.href);
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 group ${
                      isActive
                        ? "bg-gradient-to-r from-brand-orange to-red-500 text-white shadow-lg shadow-brand-orange/20 font-medium"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon className={`mr-3 h-5 w-5 transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-md' : 'group-hover:scale-110'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      
      {/* Footer actions */}
      <div className="p-4 border-t border-gray-800/50">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center justify-center px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all border border-transparent hover:border-red-500/20 font-medium"
        >
          <LogOut className="mr-2 h-5 w-5" />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 flex flex-col md:flex-row relative w-full overflow-x-hidden" dir="ltr">
      
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0a0a0a] border-b border-gray-800 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-orange to-brand-cyan flex items-center justify-center text-white font-bold text-[10px]">
            HW
          </div>
          <span className="font-heading font-bold tracking-wider">HOT WAVE</span>
        </div>
        <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2 text-gray-400 hover:text-white outline-none">
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay & Drawer */}
      <div 
        className={`md:hidden fixed inset-0 z-50 transition-all duration-300 ${isMobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
        <aside 
          className={`absolute top-0 bottom-0 left-0 w-72 bg-[#0a0a0a] border-r border-gray-800 flex flex-col h-full overflow-y-auto shadow-2xl transition-transform duration-300 ease-in-out ${
            isMobileOpen ? 'translate-x-0' : 'translate-x-[-100%]'
          }`}
        >
          {renderSidebarContent()}
        </aside>
      </div>

      {/* Desktop Sidebar (Static) */}
      <aside className="hidden md:flex static inset-y-0 w-72 flex-shrink-0 bg-[#0a0a0a] border-r border-gray-800 flex-col h-full overflow-y-auto z-40">
        {renderSidebarContent()}
      </aside>
      
      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 relative overflow-x-hidden min-w-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-cyan/5 rounded-full blur-[120px] pointer-events-none -z-10" />
        
        <div className="max-w-7xl mx-auto z-10 relative w-full">
          {children}
        </div>
        
        <Toaster 
          position="bottom-right" 
          toastOptions={{
            style: { 
              background: '#111', 
              color: '#fff',
              border: '1px solid #333',
              borderRadius: '12px'
            },
            success: { iconTheme: { primary: '#FF6B00', secondary: '#fff' } }
          }} 
        />
      </main>
    </div>
  );
}
