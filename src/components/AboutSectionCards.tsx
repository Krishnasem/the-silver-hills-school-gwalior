import React, { useState, useEffect } from 'react';
import {
  Target,
  Eye,
  Quote,
  Bell,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  ChevronRight,
  Edit3,
  Calendar,
  Sparkle
} from 'lucide-react';
import {
  getSchoolContent,
  subscribeToSchoolContent,
  SchoolContentState,
  PRESET_THOUGHTS
} from '../utils/schoolContentStore';
import { AnimatedText } from './AnimatedText';

interface AboutSectionCardsProps {
  onOpenAdmission?: () => void;
  onOpenEventModal?: (eventTitle: string) => void;
  onOpenAdminModal?: () => void;
}

export const AboutSectionCards: React.FC<AboutSectionCardsProps> = ({
  onOpenAdmission,
  onOpenEventModal,
  onOpenAdminModal,
}) => {
  const [content, setContent] = useState<SchoolContentState>(getSchoolContent());
  const [quoteRotationIndex, setQuoteRotationIndex] = useState<number | null>(null);
  const [isRotatingQuote, setIsRotatingQuote] = useState(false);

  useEffect(() => {
    // Initial fetch
    setContent(getSchoolContent());

    // Subscribe to any live updates made via the Admin Portal
    const unsubscribe = subscribeToSchoolContent((newContent) => {
      setContent(newContent);
      setQuoteRotationIndex(null); // Reset rotation to show newest saved thought
    });

    return () => unsubscribe();
  }, []);

  const handleNextQuote = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRotatingQuote(true);
    setTimeout(() => {
      setQuoteRotationIndex((prev) => {
        if (prev === null) return 0;
        return (prev + 1) % PRESET_THOUGHTS.length;
      });
      setIsRotatingQuote(false);
    }, 180);
  };

  // Determine displayed thought (either live custom thought or rotated preset)
  const displayedThought =
    quoteRotationIndex !== null
      ? PRESET_THOUGHTS[quoteRotationIndex]
      : content.dailyThought;

  return (
    <section id="about" className="py-14 md:py-20 bg-gradient-to-b from-white via-indigo-50/30 to-white relative overflow-hidden">
      {/* Decorative Rainbow Ribbon Accent */}
      <div className="absolute top-1/2 -left-8 -translate-y-1/2 w-28 h-36 pointer-events-none opacity-80">
        <svg viewBox="0 0 100 120" fill="none">
          <path d="M-10 10 C30 30 40 90 0 120" stroke="#F43F5E" strokeWidth="8" strokeLinecap="round" />
          <path d="M-10 20 C22 38 32 82 -2 108" stroke="#FBBF24" strokeWidth="8" strokeLinecap="round" />
          <path d="M-10 30 C14 46 24 74 -4 96" stroke="#34D399" strokeWidth="8" strokeLinecap="round" />
        </svg>
      </div>

      {/* Right Soft Star Doodle */}
      <div className="absolute top-12 right-10 pointer-events-none opacity-60">
        <svg viewBox="0 0 60 60" className="w-14 h-14 text-indigo-300 fill-none stroke-current stroke-[3] stroke-linejoin-round">
          <polygon points="30,5 37,21 54,23 41,35 45,52 30,43 15,52 19,35 6,23 23,21" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-30">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 relative flex flex-col items-center">
          <AnimatedText delay={0.05} distance={16} direction="up" className="inline-block mb-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EBE8FD] text-[#6355EE] text-xs sm:text-sm font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ABOUT THE SILVER HILLS SCHOOL</span>
            </div>
          </AnimatedText>
          
          <AnimatedText
            tag="h2"
            delay={0.15}
            distance={22}
            direction="up"
            className="text-3xl sm:text-4xl font-black text-[#111638] tracking-tight leading-tight mb-3 spotlight-text-dark"
          >
            Nurturing Minds, Building Values & Igniting Wisdom
          </AnimatedText>
          
          <AnimatedText
            tag="p"
            delay={0.25}
            distance={18}
            direction="up"
            className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed spotlight-text-slate"
          >
            Discover our guiding philosophy, aspirational vision, daily pearls of wisdom, and upcoming school activities that shape our vibrant community.
          </AnimatedText>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Our Mission */}
          <div
            id="card-our-mission"
            className="bg-[#F6F2FF] border-2 border-[#D8B4FE] border-dashed rounded-[28px] p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-solid hover:border-[#6355EE] group relative bg-gradient-to-b from-[#F6F2FF] to-white"
          >
            <div>
              {/* Card Header Icon & Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-13 h-13 rounded-2xl bg-[#6355EE] text-white flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#6355EE]/10 text-[#6355EE]">
                  Our Purpose
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-black text-[#111638] mb-2 font-sans flex items-center gap-1.5 spotlight-text-dark">
                Our Mission
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-medium mb-4">
                {content.missionVision.missionText}
              </p>
            </div>

            {/* Bottom Accent */}
            <div className="mt-5 pt-3 border-t border-dashed border-indigo-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#6355EE]">Excellence • Integrity</span>
              <span className="w-2 h-2 rounded-full bg-[#6355EE]" />
            </div>
          </div>

          {/* Card 2: Our Vision */}
          <div
            id="card-our-vision"
            className="bg-[#EFFCF4] border-2 border-[#86EFAC] border-dashed rounded-[28px] p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-solid hover:border-[#10B981] group relative bg-gradient-to-b from-[#EFFCF4] to-white"
          >
            <div>
              {/* Card Header Icon & Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-13 h-13 rounded-2xl bg-[#10B981] text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                  <Eye className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#10B981]/10 text-[#059669]">
                  Aspiration
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-black text-[#111638] mb-2 font-sans flex items-center gap-1.5 spotlight-text-dark">
                Our Vision
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-medium mb-4">
                {content.missionVision?.visionText}
              </p>

              {/* Key Bullet Points */}
              {content.missionVision?.visionPoints && content.missionVision.visionPoints.length > 0 && (
                <div className="space-y-2 pt-1 border-t border-emerald-100">
                  {content.missionVision.visionPoints.map((pt, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Accent */}
            <div className="mt-5 pt-3 border-t border-dashed border-emerald-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#059669]">Leadership • Compassion</span>
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            </div>
          </div>

          {/* Card 3: Today's Thought */}
          <div
            id="card-todays-thought"
            className="bg-[#FFF9EC] border-2 border-[#FDE68A] border-dashed rounded-[28px] p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-solid hover:border-[#F59E0B] group relative bg-gradient-to-b from-[#FFF9EC] to-white"
          >
            <div>
              {/* Card Header Icon & Controls */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-13 h-13 rounded-2xl bg-[#F59E0B] text-white flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-110 transition-transform">
                  <Quote className="w-6 h-6" />
                </div>
                
                <div className="flex items-center gap-1.5">
                  {onOpenAdminModal && (
                    <button
                      type="button"
                      onClick={onOpenAdminModal}
                      title="Edit Today's Thought via Staff Portal"
                      className="p-1.5 rounded-full bg-amber-100/70 text-amber-800 hover:bg-amber-200 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleNextQuote}
                    title="Rotate Inspiring Quotes"
                    className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${isRotatingQuote ? 'animate-spin' : ''}`} />
                    <span>Rotate</span>
                  </button>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-black text-[#111638] mb-1 font-sans flex items-center gap-1.5 spotlight-text-dark">
                Today's Thought
              </h3>
              
              <div className="inline-block text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md mb-3 border border-amber-200/60">
                ✨ {displayedThought.tag || "Wisdom & Growth"}
              </div>

              {/* Quote Card Box */}
              <div className="bg-white/95 rounded-2xl p-4 border border-amber-100/90 shadow-sm relative mb-2 min-h-[100px] flex flex-col justify-between">
                <p className="text-xs sm:text-[13px] text-slate-700 italic font-medium leading-relaxed mb-2 transition-opacity duration-200">
                  "{displayedThought.quote}"
                </p>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-amber-800 not-italic">
                    — {displayedThought.author}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Accent */}
            <div className="mt-4 pt-2 border-t border-dashed border-amber-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-700">Wisdom • Inspiration</span>
              <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
            </div>
          </div>

          {/* Card 4: News & Events */}
          <div
            id="card-news-events"
            className="bg-[#F0F9FF] border-2 border-[#7DD3FC] border-dashed rounded-[28px] p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-solid hover:border-[#0284C7] group relative bg-gradient-to-b from-[#F0F9FF] to-white"
          >
            <div>
              {/* Card Header Icon & Live Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-13 h-13 rounded-2xl bg-[#0284C7] text-white flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-110 transition-transform">
                  <Bell className="w-6 h-6" />
                </div>
                
                <div className="flex items-center gap-1.5">
                  {onOpenAdminModal && (
                    <button
                      type="button"
                      onClick={onOpenAdminModal}
                      title="Add or Edit Notices"
                      className="p-1.5 rounded-full bg-sky-100 text-sky-800 hover:bg-sky-200 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  )}
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-100 text-sky-700 text-[11px] font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping" />
                    <span>Live Updates</span>
                  </div>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-black text-[#111638] mb-2 font-sans flex items-center gap-1.5 spotlight-text-dark">
                News & Events
              </h3>

              {/* Mini Event Feed */}
              <div className="space-y-2.5">
                {content.events.length === 0 ? (
                  <div className="text-center py-4 bg-white/60 rounded-xl border border-sky-100">
                    <p className="text-xs text-slate-400 italic">No current notices.</p>
                  </div>
                ) : (
                  content.events.slice(0, 3).map((evt) => (
                    <div
                      key={evt.id}
                      onClick={() => onOpenEventModal && onOpenEventModal(evt.title)}
                      className="p-2.5 rounded-xl bg-white/90 border border-sky-100/90 hover:bg-white hover:border-sky-300 transition-all cursor-pointer shadow-2xs group/item"
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="bg-sky-50 text-sky-700 rounded-lg px-2 py-1 text-center shrink-0 border border-sky-200/50">
                          <span className="block text-[10px] font-black uppercase leading-none">{evt.date.split(' ')[0]}</span>
                          <span className="block text-xs font-bold leading-tight">{evt.date.split(' ')[1] || ''}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[12px] font-bold text-slate-800 line-clamp-2 leading-tight group-hover/item:text-[#0284C7] transition-colors">
                            {evt.title}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* View Admissions / Notice CTA */}
            <div className="mt-4 pt-2 border-t border-dashed border-sky-100 flex items-center justify-between">
              <div
                className="text-[12px] font-bold text-[#0284C7] hover:underline flex items-center gap-1 group/link cursor-pointer"
              >
                <span>Notice Board</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">2026-27</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
