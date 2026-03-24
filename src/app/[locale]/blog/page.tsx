import Link from "next/link";
import Image from "next/image";
import { BookOpen, Clock, ArrowRight } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === 'ar' ? 'المدونة | Hot Wave' : 'Blog | Hot Wave',
    description: locale === 'ar' ? 'أحدث المقالات والنصائح حول السياحة في الغردقة ورحلات البحر الأحمر.' : 'Latest articles and tips about tourism in Hurghada and Red Sea trips.',
  };
}

export default async function BlogIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isArabic = locale === 'ar';

  // Placeholder static articles for SEO & UI scaffolding
  const articles = [
    {
      slug: "top-5-snorkeling-spots-hurghada",
      title: isArabic ? "أفضل 5 أماكن للغطس في الغردقة لا تفوتها" : "Top 5 Snorkeling Spots in Hurghada You Can't Miss",
      excerpt: isArabic 
        ? "تعرف على أجمل الجزر ومواقع الشعاب المرجانية في البحر الأحمر التي يجب عليك زيارتها في عطلتك القادمة."
        : "Discover the most beautiful islands and coral reef sites in the Red Sea that you must visit on your next vacation.",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      date: isArabic ? "15 مارس 2024" : "March 15, 2024",
      readTime: isArabic ? "5 دقائق قراءة" : "5 min read",
      category: isArabic ? "رحلات بحرية" : "Sea Trips"
    },
    {
      slug: "what-to-expect-desert-safari",
      title: isArabic ? "ماذا تتوقع في رحلة سفاري صحراء الغردقة؟" : "What to Expect on a Hurghada Desert Safari?",
      excerpt: isArabic 
        ? "دليل شامل لكل ما ستحتاجه وتعيشه في قلب الصحراء الشرقية، من ركوب البيتش باجي وحتى العشاء البدوي."
        : "A comprehensive guide to everything you need and will experience in the heart of the Eastern Desert, from quad biking to Bedouin dinner.",
      image: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      date: isArabic ? "10 مارس 2024" : "March 10, 2024",
      readTime: isArabic ? "4 دقائق قراءة" : "4 min read",
      category: isArabic ? "سفاري ومغامرات" : "Safari & Adventures"
    },
    {
      slug: "best-time-to-visit-red-sea",
      title: isArabic ? "متى يكون أفضل وقت لزيارة البحر الأحمر؟" : "When is the Best Time to Visit the Red Sea?",
      excerpt: isArabic 
        ? "نظرة تفصيلية على حالة الطقس طوال العام وأفضل الشهور للاستمتاع بالأنشطة المائية بدون زحام."
        : "A detailed look at the weather year-round and the best months to enjoy water activities without the crowds.",
      image: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      date: isArabic ? "1 مارس 2024" : "March 1, 2024",
      readTime: isArabic ? "3 دقائق قراءة" : "3 min read",
      category: isArabic ? "نصائح سفر" : "Travel Tips"
    }
  ];

  return (
    <main className="min-h-screen bg-brand-navy pt-32 lg:pt-40 pb-20">
      {/* Header Section */}
      <section className="container mx-auto px-4 text-center mb-16 relative">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-brand-orange/10 rounded-full blur-[100px] -z-10" />
        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-800">
          <BookOpen className="w-8 h-8 text-brand-orange" />
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-heading mb-6 drop-shadow-lg flex flex-wrap items-center justify-center gap-3">
          <span>{isArabic ? "مدونة" : "Hot Wave"}</span>
          <span className="text-brand-orange" dir="ltr">{isArabic ? "هوت ويف" : "Blog"}</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto font-sans">
          {isArabic 
            ? "اكتشف أسرار الغردقة، واقرأ أهم النصائح التي ستجعل من إجازتك تجربة لا تُنسى."
            : "Discover the secrets of Hurghada, and read the top tips that will make your vacation unforgettable."}
        </p>
      </section>

      {/* Blog Grid */}
      <section className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, idx) => (
            <Link 
              href={`/${locale}/blog/${article.slug}`} 
              key={idx}
              className="bg-[#111111] rounded-2xl border border-gray-800 overflow-hidden group hover:border-brand-orange/50 hover:shadow-xl hover:shadow-brand-orange/5 transition-all duration-300 flex flex-col"
            >
              <div className="relative h-60 w-full overflow-hidden">
                <div className="absolute top-4 left-4 z-10 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-brand-cyan border border-brand-cyan/20">
                  {article.category}
                </div>
                <Image 
                  src={article.image} 
                  alt={article.title} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 font-sans">
                  <span>{article.date}</span>
                  <span className="w-1 h-1 bg-gray-600 rounded-full" />
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {article.readTime}</span>
                </div>
                
                <h2 className="text-xl font-bold text-white mb-3 group-hover:text-brand-orange transition-colors line-clamp-2">
                  {article.title}
                </h2>
                
                <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center text-brand-cyan font-semibold text-sm group-hover:gap-2 transition-all mt-auto">
                  {isArabic ? "اقرأ المقال" : "Read Article"}
                  <ArrowRight className="w-4 h-4 ml-2 rtl:mr-2 rtl:rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
