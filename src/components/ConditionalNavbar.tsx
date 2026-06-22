"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname() || "";
  
  // Hide navbar on admin and auth routes
  if (pathname.includes("/admin") || pathname.includes("/auth")) {
    return null;
  }

  return <Navbar />;
}
