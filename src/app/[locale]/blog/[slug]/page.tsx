import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowLeft, Calendar, User } from "lucide-react";
import { notFound } from "next/navigation";

// Mock database for the placeholder articles
const mockArticles = {
  "top-5-snorkeling-spots-hurghada": {
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    ar: {
      title: "أفضل 5 أماكن للغطس في الغردقة لا تفوتها",
      date: "15 مارس 2024",
      content: "الغردقة تعتبر واحدة من أفضل الوجهات العالمية للغطس والسنوركلينج. تتميز المياه هنا بصفائها المطلق وتنوع الحياة البحرية والشعاب المرجانية التي تسحر العقول. في هذا المقال سنستعرض أفضل 5 أماكن...\n\n1. جزيرة الجفتون\n2. محمية شرم الناقة\n3. شعاب كارلوس\n4. جزيرة أبو منقار\n5. خليج مكادي"
    },
    en: {
      title: "Top 5 Snorkeling Spots in Hurghada You Can't Miss",
      date: "March 15, 2024",
      content: "Hurghada is considered one of the top global destinations for diving and snorkeling. The waters here are characterized by absolute clarity and diverse marine life. In this article, we review the top 5 spots...\n\n1. Giftun Island\n2. Sharm El Naga Reserve\n3. Careless Reef\n4. Abu Minqar Island\n5. Makadi Bay"
    }
  },
  "what-to-expect-desert-safari": {
    image: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    ar: {
      title: "ماذا تتوقع في رحلة سفاري صحراء الغردقة؟",
      date: "10 مارس 2024",
      content: "صحراء الغردقة الشرقية تخفي سحراً لا يقل روعة عن قاع بحرها. رحلة السفاري تبدأ عادة الانطلاق بسيارات الدفع الرباعي 4x4، مروراً بقيادة البيتش باجي في الكثبان الرملية. ستستمتع في النهاية بعشاء بدوي تراثي مع الشاي البدوي اللذيذ تحت سماء مرصعة بالنجوم."
    },
    en: {
      title: "What to Expect on a Hurghada Desert Safari?",
      date: "March 10, 2024",
      content: "The Eastern Desert of Hurghada hides a magic no less magnificent than its seabed. The safari trip usually starts with 4x4 vehicles, passing through quad biking in the dunes. You will finally enjoy a traditional Bedouin dinner with delicious Bedouin tea under a starry sky."
    }
  },
  "best-time-to-visit-red-sea": {
    image: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    ar: {
      title: "متى يكون أفضل وقت لزيارة البحر الأحمر؟",
      date: "1 مارس 2024",
      content: "البحر الأحمر وجهة ممتازة طوال العام، لكن إذا كنت تبحث عن الطقس المثالي للأنشطة البحرية دون حرارة الصيف الشديدة، فإن الفترة من سبتمبر إلى نوفمبر، ومن مارس إلى مايو تعتبر الأفضل. المياه تكون دافئة والمناخ معتدل جداً."
    },
    en: {
      title: "When is the Best Time to Visit the Red Sea?",
      date: "March 1, 2024",
      content: "The Red Sea is an excellent destination year-round, but if you're looking for perfect weather for marine activities without extreme summer heat, the period from September to November, and March to May is considered the best. Water is warm and climate is very mild."
    }
  }
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string, slug: string }> }) {
  const { locale, slug } = await params;
  const articleData = mockArticles[slug as keyof typeof mockArticles];
  
  if (!articleData) {
    return { title: 'Not Found' };
  }

  return {
    title: `${locale === 'ar' ? articleData.ar.title : articleData.en.title} | Hot Wave`,
    description: (locale === 'ar' ? articleData.ar.content : articleData.en.content).substring(0, 150) + '...',
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string, slug: string }> }) {
  const { locale, slug } = await params;
  const isArabic = locale === 'ar';
  
  const articleData = mockArticles[slug as keyof typeof mockArticles];
  
  if (!articleData) {
    notFound();
  }

  const post = isArabic ? articleData.ar : articleData.en;

  return (
    <main className="min-h-screen bg-brand-navy pt-24 pb-20">
      <article className="container mx-auto px-4 max-w-4xl">
        
        {/* Breadcrumb / Back button */}
        <Link 
          href={`/${locale}/blog`} 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-orange transition-colors mb-8 font-sans"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          {isArabic ? "العودة للمدونة" : "Back to Blog"}
        </Link>
        
        {/* Header */}
        <header className="mb-10 text-center md:text-start">
          <h1 className="text-3xl md:text-5xl font-bold text-white font-heading mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-gray-400 text-sm font-sans">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-brand-cyan" />
              <span>{isArabic ? "فريق Hot Wave" : "Hot Wave Team"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-orange" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>{isArabic ? "5 دقائق قراءة" : "5 min read"}</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="w-full h-[300px] md:h-[500px] relative rounded-3xl overflow-hidden border border-gray-800 shadow-2xl mb-12">
          <Image 
            src={articleData.image} 
            alt={post.title} 
            fill 
            className="object-cover"
            priority
          />
        </div>

        {/* Content */}
        <div className="bg-[#111111] p-8 md:p-12 rounded-3xl border border-gray-800 shadow-xl prose prose-invert prose-orange max-w-none">
          <div className="text-gray-300 font-sans text-lg leading-loose whitespace-pre-wrap">
            {post.content}
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 mt-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <p className="text-xl font-bold font-heading text-white">
                {isArabic ? "هل أعجبك المقال؟ استمتع بالرحلة في الواقع!" : "Liked the article? Experience the trip in reality!"}
              </p>
              <Link 
                href={`/${locale}/#services`}
                className="px-8 py-3.5 bg-brand-orange text-white font-bold rounded-xl shadow-[0_0_20px_rgba(255,107,0,0.3)] hover:scale-105 transition-transform"
              >
                {isArabic ? "احجز رحلتك الآن" : "Book Your Trip Now"}
              </Link>
            </div>
          </div>
        </div>

      </article>
    </main>
  );
}
