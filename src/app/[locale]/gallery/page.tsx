import Image from "next/image";
import Link from "next/link";
import { Camera, ArrowRight } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === 'ar' ? 'معرض الصور | Hot Wave' : 'Gallery | Hot Wave',
    description: locale === 'ar' ? 'شاهد أجمل اللحظات والصور من رحلاتنا البحرية والسفاري.' : 'View the most beautiful moments and photos from our sea trips and safaris.',
  };
}

const galleryImages = [
  "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1621245050854-9eb51e704de4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1533087029587-f8e4343118ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517400508447-f8dd518b86db?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1505881504893-644788c83a54?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1621245050212-085e79124233?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1521404094119-0630b7e28321?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1463124560124-7836b7636e05?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
];

export default async function GalleryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isArabic = locale === 'ar';

  return (
    <main className="min-h-screen bg-brand-navy pt-32 lg:pt-40 pb-20">
      {/* Header Section */}
      <section className="container mx-auto px-4 text-center mb-16 relative">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-brand-orange/10 rounded-full blur-[100px] -z-10" />
        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-800">
          <Camera className="w-8 h-8 text-brand-orange" />
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-heading mb-6 drop-shadow-lg flex flex-wrap items-center justify-center gap-3">
          <span>{isArabic ? "معرض" : "Our"}</span>
          <span className="text-brand-orange">{isArabic ? "الصور" : "Gallery"}</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto font-sans">
          {isArabic 
            ? "تصفح أجمل اللحظات والذكريات من رحلاتنا السابقة. انضم إلينا لتكون صورتك القادمة هنا!"
            : "Browse the most beautiful moments and memories from our previous trips. Join us and your next photo could be here!"}
        </p>
      </section>

      {/* Masonry Grid */}
      <section className="container mx-auto px-4 max-w-7xl mb-20">
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {galleryImages.map((src, idx) => (
            <div 
              key={idx} 
              className="relative group break-inside-avoid overflow-hidden rounded-2xl bg-gray-900 border border-gray-800 hover:border-brand-orange/50 transition-colors"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
              <Image
                src={src}
                alt={`Hot Wave Tour Photo ${idx + 1}`}
                width={800}
                height={600}
                className="w-full h-auto object-cover hover:scale-110 transition-transform duration-700"
                priority={idx < 4}
              />
              <div className="absolute bottom-4 left-4 right-4 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <span className="text-white font-medium text-sm drop-shadow-md">
                  {isArabic ? "ذكريات سعيدة 🌊" : "Happy Memories 🌊"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 max-w-3xl text-center">
        <div className="bg-[#111111] p-8 md:p-12 rounded-[2rem] border border-gray-800 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/5 to-brand-cyan/5 z-0" />
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 relative z-10">
            {isArabic ? "عش التجربة بنفسك واحجز رحلتك الآن" : "Live the experience yourself and book your trip now"}
          </h2>
          <Link href={`/${locale}/#services`} className="inline-flex items-center gap-2 px-8 py-4 bg-brand-orange text-white font-bold rounded-xl shadow-[0_0_20px_rgba(255,107,0,0.3)] hover:shadow-[0_0_30px_rgba(255,107,0,0.5)] hover:-translate-y-1 transition-all relative z-10">
            {isArabic ? "اختر رحلتك" : "Choose Your Trip"}
            <ArrowRight className="w-5 h-5 rtl:rotate-180" />
          </Link>
        </div>
      </section>
    </main>
  );
}
