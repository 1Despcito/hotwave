'use client';

import { useState } from 'react';
import { Star, MessageSquareQuote, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function PackageReviewsWidget({ serviceTypeId, isArabic, initialReviews = [] }: { serviceTypeId: string; isArabic: boolean; initialReviews?: any[] }) {
  const [reviews, setReviews] = useState<any[]>(initialReviews);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [authorName, setAuthorName] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Average Rating Calculation
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || rating < 1) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceTypeId,
          authorName,
          comment,
          rating,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit review');
      
      const newReview = await response.json();
      setReviews(prev => [newReview, ...prev]);
      setIsSuccess(true);
      setAuthorName('');
      setComment('');
      setRating(5);
      
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error(error);
      alert(isArabic ? 'حدث خطأ أثناء إرسال تقييمك.' : 'Failed to submit review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-20 pt-16 border-t border-gray-800/50" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="flex flex-col md:flex-row gap-12 items-start">
        
        {/* Reviews Summary Section */}
        <div className="w-full md:w-1/3">
          <h3 className="text-3xl font-bold font-heading text-white mb-6">
            {isArabic ? 'آراء العملاء' : 'Customer Reviews'}
          </h3>
          
          <div className="bg-brand-navy-light/80 p-8 rounded-3xl border border-gray-800 shadow-xl flex flex-col items-center">
            <span className="text-5xl font-black text-white font-heading mb-2">{averageRating}</span>
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`w-6 h-6 ${star <= parseFloat(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} 
                />
              ))}
            </div>
            <span className="text-gray-400 text-sm">
              {reviews.length} {isArabic ? 'مراجعة' : 'Reviews'}
            </span>
          </div>
        </div>

        {/* Reviews List & Form */}
        <div className="w-full md:w-2/3 flex flex-col gap-8">
          
          {/* Add Review Form */}
          <div className="bg-[#0d1627] p-6 lg:p-8 rounded-2xl border border-gray-800 shadow-lg">
            <h4 className="text-xl font-bold text-white mb-6">
              {isArabic ? 'أضف تقييمك' : 'Add your review'}
            </h4>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              
              {/* Star Selector */}
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm me-2">{isArabic ? 'التقييم:' : 'Rating:'}</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="focus:outline-none hover:scale-110 transition-transform"
                    >
                      <Star 
                        className={`w-7 h-7 ${(hoverRating || rating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-700'}`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder={isArabic ? 'الاسم' : 'Your Name'}
                className="w-full bg-[#131e33] border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-cyan transition-colors"
              />

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={isArabic ? 'أخبرنا عن تجربتك (اختياري)...' : 'Tell us about your experience (optional)...'}
                rows={3}
                className="w-full bg-[#131e33] border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-cyan transition-colors resize-none"
              />

              <button
                type="submit"
                disabled={isSubmitting || isSuccess}
                className="w-full sm:w-auto self-end bg-brand-cyan hover:bg-brand-orange text-brand-navy font-bold py-3 px-8 rounded-full transition-colors flex items-center justify-center gap-2 mt-2"
              >
                {isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-brand-navy/30 border-t-brand-navy rounded-full animate-spin" />
                ) : isSuccess ? (
                  <><Check className="w-5 h-5" /> {isArabic ? 'تم بنجاح!' : 'Success!'}</>
                ) : (
                  <>{isArabic ? 'حفظ التقييم' : 'Submit Review'}</>
                )}
              </button>
            </form>
          </div>

          {/* List of Reviews */}
          <div className="flex flex-col gap-4 mt-6">
            <AnimatePresence>
              {reviews.map((rev) => (
                <motion.div
                  key={rev.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-brand-navy p-6 rounded-2xl border border-gray-800 flex gap-4 items-start"
                >
                  <div className="w-12 h-12 rounded-full bg-brand-cyan/20 flex items-center justify-center shrink-0 border border-brand-cyan/30 mt-1">
                    <span className="text-brand-cyan font-bold text-lg">{rev.authorName.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                      <h5 className="font-bold text-white text-lg">{rev.authorName}</h5>
                      <span className="text-gray-500 text-sm">
                        {new Date(rev.createdAt).toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`w-4 h-4 ${star <= rev.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-700'}`} 
                        />
                      ))}
                    </div>
                    {rev.comment && (
                      <p className="text-gray-300 font-sans leading-relaxed">
                        <MessageSquareQuote className="w-4 h-4 inline-block text-gray-500 me-2 rtl:ms-2 rtl:me-0 -mt-1" />
                        {rev.comment}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {reviews.length === 0 && (
              <p className="text-gray-500 text-center py-10 font-sans">
                {isArabic ? 'كن أول من يقيم هذه الرحلة!' : 'Be the first to review this trip!'}
              </p>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
