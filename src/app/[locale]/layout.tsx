import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "../globals.css";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import { NextAuthProvider } from "@/components/providers/SessionProvider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import GlobalFooter from "@/components/GlobalFooter";
import FloatingWhatsAppWidget from "@/components/FloatingWhatsAppWidget";
import { CurrencyProvider } from "@/components/CurrencyProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hot Wave | Experience Hurghada Like Never Before",
  description: "Book unforgettable Sea Trips, Safari adventures, and Horseback riding in Hurghada.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  // Fetch global settings and top services for the footer
  const settings = await prisma.siteSettings.findFirst();
  const topServices = await prisma.service.findMany({ select: { id: true, title: true, titleEn: true }, take: 4 });

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <NextAuthProvider>
            <CurrencyProvider>
              <ConditionalNavbar />
              {children}
              <GlobalFooter settings={settings} services={topServices} />
              <FloatingWhatsAppWidget whatsappNumber={(settings as any)?.whatsappNumber || "201110626484"} />
            </CurrencyProvider>
          </NextAuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
