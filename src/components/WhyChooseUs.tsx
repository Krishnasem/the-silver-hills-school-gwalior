import React from 'react';
import { ArrowRight } from 'lucide-react';
import whyChooseUsImg from '../assets/images/regenerated_image_1787633821697.png';
import { AnimatedText } from './AnimatedText';
import {
  AbcBlocksDoodle,
  RainbowCloudDoodle,
  KiteDoodle,
  HotAirBalloonDoodle,
} from './Doodles';

interface WhyChooseUsProps {
  onOpenAdmission: () => void;
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ onOpenAdmission }) => {
  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Decorative Doodles */}
      <div className="absolute top-8 left-6 pointer-events-none hidden sm:block">
        <AbcBlocksDoodle className="w-16 h-16" />
      </div>

      <div className="absolute bottom-6 right-6 md:right-16 pointer-events-none animate-float">
        <HotAirBalloonDoodle className="w-24 h-32 md:w-28 md:h-36" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: TSHS Kids Activity Photo */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            <div className="relative w-full max-w-lg lg:max-w-xl aspect-square sm:min-h-[480px] lg:min-h-[520px] flex items-center justify-center">
              {/* Yellow outline frame container */}
              <div className="w-full h-full rounded-[32px] sm:rounded-[48px] border-4 border-[#FACC15] p-2 relative bg-amber-50/50 shadow-2xl overflow-hidden">
                <img
                  src={whyChooseUsImg}
                  alt="Children crafting in TSHS classroom"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-[26px] sm:rounded-[40px] transform hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Rainbow with Clouds at bottom-center of frame */}
              <div className="absolute -bottom-6 right-0 sm:-bottom-8 sm:-right-4 z-20 pointer-events-none animate-float" style={{ animationDelay: '1s' }}>
                <RainbowCloudDoodle className="w-20 h-16 sm:w-28 sm:h-24" />
              </div>

              {/* Kite at bottom-left */}
              <div className="absolute -bottom-6 left-0 sm:-bottom-10 sm:-left-6 z-20 pointer-events-none">
                <KiteDoodle className="w-14 h-18 sm:w-20 sm:h-24" />
              </div>
            </div>
          </div>

          {/* Right Column: Copy, Progress Bars, and CTA */}
          <div className="lg:col-span-6 space-y-6">
            {/* Badge */}
            <AnimatedText delay={0.05} distance={16} direction="up" className="inline-block">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#EBE8FD] text-[#6355EE] text-xs sm:text-sm font-bold tracking-wide">
                Why Choose Us
              </div>
            </AnimatedText>

            {/* Heading */}
            <AnimatedText
              tag="h2"
              delay={0.15}
              distance={22}
              direction="up"
              className="text-2xl xs:text-3xl sm:text-4xl md:text-[42px] font-black text-[#111638] leading-[1.2] tracking-tight spotlight-text-dark"
            >
              Why Our The Silver Hills School Stands Out
            </AnimatedText>

            {/* Description */}
            <AnimatedText
              tag="p"
              delay={0.25}
              distance={18}
              direction="up"
              className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal spotlight-text-dark"
            >
              Our admissions process is designed to be simple, transparent, and supportive, giving every parent confidence
            </AnimatedText>

            {/* Progress Bars matching reference */}
            <div className="space-y-4 pt-2">
              {/* Creativity Bar - 90% */}
              <AnimatedText delay={0.35} distance={16} direction="up" className="space-y-1.5">
                <div className="w-full bg-[#6355EE] text-white rounded-2xl px-5 py-3 flex items-center justify-between shadow-md">
                  <span className="font-extrabold text-sm sm:text-base">Creativity</span>
                  <span className="font-black text-base sm:text-lg">90%</span>
                </div>
              </AnimatedText>

              {/* Experiences Bar - 70% */}
              <AnimatedText delay={0.45} distance={16} direction="up" className="space-y-1.5">
                <div className="w-[90%] sm:w-[80%] bg-[#FACC15] text-[#111638] rounded-2xl px-5 py-3 flex items-center justify-between shadow-md">
                  <span className="font-extrabold text-sm sm:text-base">Experiences</span>
                  <span className="font-black text-base sm:text-lg">70%</span>
                </div>
              </AnimatedText>
            </div>

            {/* Action Button */}
            <AnimatedText delay={0.55} distance={16} direction="up" className="pt-4">
              <button
                onClick={onOpenAdmission}
                className="w-[161.2px] inline-flex items-center justify-center gap-3 pl-6 pr-2.5 py-3 bg-[#ED5B2D] hover:bg-[#d94a1d] text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-full shadow-lg shadow-orange-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer group"
              >
                <span>START ENROLLMENT</span>
                <div className="w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center group-hover:translate-x-0.5 transition-transform shrink-0">
                  <ArrowRight className="w-4 h-4 text-slate-900 stroke-[2.5]" />
                </div>
              </button>
            </AnimatedText>
          </div>
        </div>
      </div>
    </section>
  );
};
