"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { Globe } from "lucide-react";
import { motion } from "framer-motion";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const toggleLanguage = () => {
    const nextLocale = locale === "ar" ? "en" : "ar";
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      disabled={isPending}
      onClick={toggleLanguage}
      className={`relative flex items-center justify-center gap-2 px-3 py-2 rounded-full border transition-all duration-300 ${
        isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } bg-white/10 hover:bg-white/20 border-gray-600 hover:border-brand-cyan text-white backdrop-blur-md`}
      aria-label="Toggle language"
    >
      <Globe className="w-4 h-4 text-brand-cyan" />
      <span className="text-xs font-bold uppercase tracking-wider">{locale === "ar" ? "EN" : "AR"}</span>
    </motion.button>
  );
}
