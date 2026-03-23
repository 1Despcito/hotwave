import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "../globals.css";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import { NextAuthProvider } from "@/components/providers/SessionProvider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

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

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <NextAuthProvider>
            <ConditionalNavbar />
            {children}
          </NextAuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
