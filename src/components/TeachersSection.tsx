import React, { useState, useEffect, useRef } from 'react';
import { Teacher } from '../types';
import { KiteDoodle } from './Doodles';
import { AnimatedText } from './AnimatedText';
import {
  getSchoolContent,
  subscribeToSchoolContent,
  DEFAULT_TEACHERS,
} from '../utils/schoolContentStore';
import { GraduationCap } from 'lucide-react';

export const TeachersSection: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>(() => getSchoolContent().teachers || DEFAULT_TEACHERS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [withTransition, setWithTransition] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [itemsPerView, setItemsPerView] = useState(3);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Subscribe dynamically to teachers from Firebase Firestore + Storage
  useEffect(() => {
    const unsubscribe = subscribeToSchoolContent((content) => {
      if (content.teachers && content.teachers.length > 0) {
        setTeachers(content.teachers);
      }
    });
    return () => unsubscribe();
  }, []);

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

  const safeTeachers = teachers.length > 0 ? teachers : DEFAULT_TEACHERS;
  const extendedList = [...safeTeachers, ...safeTeachers, ...safeTeachers];

  const handleNext = () => {
    setWithTransition(true);
    setCurrentIndex((prev) => {
      if (prev >= safeTeachers.length) {
        return prev;
      }
      return prev + 1;
    });
  };

  const handlePrev = () => {
    if (!withTransition) return;
    if (currentIndex <= 0) {
      setWithTransition(false);
      setCurrentIndex(safeTeachers.length);
      setTimeout(() => {
        setWithTransition(true);
        setCurrentIndex(safeTeachers.length - 1);
      }, 40);
    } else {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // When completing the transition at or past the loop boundary, seamlessly jump back to index 0 with no transition
  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (currentIndex >= safeTeachers.length) {
      setWithTransition(false);
      setCurrentIndex(currentIndex % safeTeachers.length);
    }
  };

  // Re-enable transition shortly after jumping back to the base index
  useEffect(() => {
    if (!withTransition) {
      const timer = setTimeout(() => {
        setWithTransition(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [withTransition]);

  // Continuously swipe automatically from right to left after a time delay
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      handleNext();
    }, 3200);

    return () => clearInterval(timer);
  }, [isPaused, itemsPerView, safeTeachers.length]);

  // Touch Swipe Handlers for mobile devices
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
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section
      id="teachers"
      className="py-16 md:py-24 bg-white relative overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Top Left Kite Doodle */}
      <div className="absolute top-2 left-6 pointer-events-none hidden sm:block">
        <KiteDoodle className="w-16 h-20" />
      </div>

      {/* Bottom Right Stars with Rainbow Trail */}
      <div className="absolute bottom-4 right-6 pointer-events-none flex items-center gap-2">
        <svg viewBox="0 0 120 60" className="w-28 h-16 fill-none">
          <path d="M10 50 C40 50 70 30 110 30" stroke="#F472B6" strokeWidth="4" strokeLinecap="round" />
          <path d="M10 55 C40 55 70 35 110 35" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" />
          <path d="M10 60 C40 60 70 40 110 40" stroke="#60A5FA" strokeWidth="4" strokeLinecap="round" />
          <polygon points="100,10 103,18 111,19 105,25 107,33 100,29 93,33 95,25 89,19 97,18" fill="#FACC15" />
          <polygon points="75,25 77,31 83,32 78,36 80,42 75,39 70,42 72,36 67,32 73,31" fill="#FACC15" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-30">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-14">
          <AnimatedText delay={0.05} distance={16} direction="up" className="inline-block">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#EBE8FD] text-[#6355EE] text-xs sm:text-sm font-bold tracking-wide">
              <GraduationCap className="w-4 h-4" />
              <span>Our Educators & Faculty</span>
            </div>
          </AnimatedText>
          <AnimatedText
            tag="h2"
            delay={0.15}
            distance={22}
            direction="up"
            className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black text-[#111638] tracking-tight spotlight-text-dark"
          >
            Meet Our Caring Teachers
          </AnimatedText>
          <p className="text-slate-500 max-w-xl mx-auto text-xs sm:text-base">
            Dedicated mentors committed to igniting academic excellence, empathy, and lifelong curiosity.
          </p>
        </div>

        {/* Carousel Viewport */}
        <div
          className="overflow-hidden relative -mx-3 px-3 py-4"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Continuous Sliding Track */}
          <div
            onTransitionEnd={handleTransitionEnd}
            className={`flex ${withTransition ? 'transition-transform duration-700 ease-out' : ''}`}
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            }}
          >
            {extendedList.map((teacher, index) => (
              <div
                key={`${teacher.id}-${index}`}
                className="w-full sm:w-1/2 lg:w-1/3 px-4 shrink-0 flex flex-col items-center text-center group"
              >
                {/* Circular Avatar Frame with Yellow Arc and Purple Backdrop */}
                <div className="relative w-44 h-44 xs:w-48 xs:h-48 sm:w-56 sm:h-56 md:w-60 md:h-60 mb-6 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-[5px] border-[#FACC15] -rotate-12 translate-x-1 translate-y-1"></div>
                  
                  <div className="absolute inset-1 rounded-full bg-[#6355EE] overflow-hidden shadow-xl flex items-center justify-center">
                    <img
                      src={teacher.imageUrl}
                      alt={teacher.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        // Fallback image if remote url has issues
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=80';
                      }}
                    />
                  </div>
                </div>

                {/* Teacher Info */}
                <h3 className="text-2xl font-bold text-[#111638] mb-1 group-hover:text-[#6355EE] transition-colors spotlight-text-dark">
                  {teacher.name}
                </h3>
                <p className="text-sm font-semibold text-[#6355EE]">
                  {teacher.role}
                </p>
                {teacher.qualification && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    {teacher.qualification}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Indicator Dots */}
        <div className="flex items-center justify-center gap-2 mt-10">
          {safeTeachers.map((teacher, dotIdx) => {
            const isActive = (currentIndex % safeTeachers.length) === dotIdx;
            return (
              <button
                key={`${teacher.id}-${dotIdx}`}
                onClick={() => {
                  setWithTransition(true);
                  setCurrentIndex(dotIdx);
                }}
                aria-label={`Go to slide ${dotIdx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  isActive
                    ? 'w-8 h-2.5 bg-[#6355EE]'
                    : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
