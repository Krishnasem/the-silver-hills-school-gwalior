import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Testimonial } from '../types';
import { AnimatedText } from './AnimatedText';

const allTestimonials: Testimonial[] = [
  {
    id: '1',
    quote: 'The school is very good. The staff are friendly and treat the children like their own. The teaching standard is high. My daughter has improved her reading and writing skills.',
    name: 'Asha Soni',
    rating: 5,
  },
  {
    id: '2',
    quote: 'I am very happy with all my children`s progress. The school are very supportive with any of my concerns.',
    name: 'Vinod Yadav',
    rating: 5,
  },
  {
    id: '3',
    quote: 'A wonderful school with caring teachers. The admission process was smooth, and my child feels safe and happy every day.',
    name: 'Parimal Singh',
    rating: 5,
  },
  {
    id: '4',
    quote: 'This school has exceeded all our expectations. The teachers nurture creativity and confidence with every single activity.',
    name: 'Rishabh Sharma',
    rating: 5,
  },
  {
    id: '5',
    quote: 'The holistic development and individual attention given to every student at The Silver Hills School is truly commendable.',
    name: 'Pooja Agarwal',
    rating: 5,
  },
  {
    id: '6',
    quote: 'Exceptional focus on discipline, sports, and conceptual learning. We are very proud to have our child studying here.',
    name: 'Rajesh Mishra',
    rating: 5,
  },
];

export const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [itemsPerView, setItemsPerView] = useState(3);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Update visible items count on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, allTestimonials.length - itemsPerView);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  // Auto-swipe from right to left after a delay in time (every 4 seconds)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      handleNext();
    }, 4000);

    return () => clearInterval(timer);
  }, [isPaused, maxIndex, itemsPerView]);

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      // Swiped Left -> Move Next
      handleNext();
    } else if (distance < -minSwipeDistance) {
      // Swiped Right -> Move Prev
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section
      id="testimonials"
      className="py-16 md:py-24 bg-white relative overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-30">
        {/* Header with Title and Slider Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <AnimatedText delay={0.05} distance={16} direction="up" className="inline-block">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#EBE8FD] text-[#6355EE] text-xs sm:text-sm font-bold tracking-wide">
                Our Testimonials
              </div>
            </AnimatedText>
            <AnimatedText
              tag="h2"
              delay={0.15}
              distance={22}
              direction="up"
              className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black text-[#111638] tracking-tight spotlight-text-dark"
            >
              Loved by Parents, Enjoyed by Kids
            </AnimatedText>
          </div>

          {/* Slider Buttons and Purple Star Doodle */}
          <div className="flex items-center gap-3 relative self-end sm:self-auto">
            {/* Cute Purple Star Doodle */}
            <div className="absolute -top-10 right-2 pointer-events-none">
              <svg viewBox="0 0 60 60" className="w-10 h-10 text-[#6355EE] fill-current animate-pulse">
                <polygon points="30,5 37,21 54,23 41,35 45,52 30,43 15,52 19,35 6,23 23,21" />
              </svg>
            </div>

            <button
              onClick={handlePrev}
              aria-label="Previous Testimonial"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-xs"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next Testimonial"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#ED5B2D] hover:bg-[#d94a1d] text-white flex items-center justify-center transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Viewport */}
        <div
          className="overflow-hidden relative -mx-3 px-3 py-2"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Sliding Track - moves from right to left */}
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            }}
          >
            {allTestimonials.map((item, idx) => (
              <div
                key={item.id}
                className="w-full sm:w-1/2 lg:w-1/3 px-3 shrink-0 flex"
              >
                <div className="w-full bg-[#FFF5EE] border border-orange-100/70 rounded-[32px] p-5 sm:p-8 flex flex-col items-center text-center shadow-xs hover:shadow-lg transition-all duration-300 relative group hover:-translate-y-1">
                  {/* 5 Gold Stars */}
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 text-amber-400 fill-amber-400 group-hover:scale-110 transition-transform" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-sm sm:text-base text-slate-700 italic leading-relaxed mb-6 font-normal">
                    "{item.quote}"
                  </p>

                  {/* Author */}
                  <div className="mt-auto pt-2 border-t border-orange-200/40 w-full">
                    <h4 className="font-extrabold text-[#111638] text-base sm:text-lg">
                      {item.name}
                    </h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Slide Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => setCurrentIndex(dotIdx)}
              aria-label={`Go to slide ${dotIdx + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                currentIndex === dotIdx
                  ? 'w-8 h-2.5 bg-[#ED5B2D]'
                  : 'w-2.5 h-2.5 bg-slate-200 hover:bg-slate-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

