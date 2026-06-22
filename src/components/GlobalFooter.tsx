"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function GlobalFooter({ settings, services }: { settings: any, services: any[] }) {
  const pathname = usePathname() || "";
  
  // Hide footer on admin and auth routes
  if (pathname.includes("/admin") || pathname.includes("/auth")) {
    return null;
  }

  return <Footer settings={settings} services={services} />;
}
