import React from 'react';
import { ArrowRight, Play } from 'lucide-react';
import heroBoyImg from '../assets/images/hero-boy.png';
import { AnimatedText } from './AnimatedText';
import {
  LightningDoodle,
  PencilDoodle,
  LightbulbDoodle,
  CartoonCarDoodle,
  StackingToyDoodle,
  YellowRingsDoodle,
  WavyScallopDivider,
} from './Doodles';

interface HeroSectionProps {
  onOpenAdmission: () => void;
  onOpenVideo: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenAdmission, onOpenVideo }) => {
  return (
    <section className="relative bg-[#6355EE] text-white pt-6 md:pt-10 pb-6 sm:pb-12 lg:pb-24 min-h-[560px] flex flex-col justify-center overflow-hidden">
      {/* Decorative Floating Doodles */}
      <div className="absolute top-6 left-6 md:top-10 md:left-12 pointer-events-none animate-float z-10">
        <LightningDoodle className="w-12 h-12 md:w-16 md:h-16" />
      </div>

      <div className="absolute top-8 right-10 md:right-32 pointer-events-none animate-float z-10" style={{ animationDelay: '1s' }}>
        <PencilDoodle className="w-12 h-12 md:w-14 md:h-14" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center lg:-mt-[25px]">
          {/* Left Column: Boy with Books & Concentric Rings */}
          <div className="lg:col-span-6 relative flex justify-center items-center order-2 lg:order-1 pt-4 sm:pt-0 pb-2 sm:pb-4 lg:pb-0">
            {/* Concentric Yellow Rings */}
            <div className="absolute -z-0 w-64 h-64 xs:w-76 xs:h-76 sm:w-80 sm:h-80 md:w-[360px] md:h-[360px] lg:w-[400px] lg:h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-float" style={{ animationDelay: '0.8s', animationDuration: '6s' }}>
              <div className="w-full h-full animate-pulse-ring" style={{ animationDuration: '5s' }}>
                <YellowRingsDoodle className="w-full h-full" />
              </div>
            </div>

            {/* Lightbulb Doodle near top right of boy */}
            <div className="absolute -top-2 right-4 sm:right-8 z-10 animate-float" style={{ animationDelay: '1.5s' }}>
              <LightbulbDoodle className="w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14" />
            </div>

            {/* Main Boy Illustration/Image Container */}
            <div className="relative z-10 w-full flex justify-center py-1 sm:py-2 overflow-visible mb-[9px]">
              <img
                src={heroBoyImg}
                alt="The Silver Hills School Student"
                referrerPolicy="no-referrer"
                className="w-full max-w-[385px] xs:max-w-[460px] sm:max-w-[560px] md:max-w-[640px] lg:max-w-none lg:w-[770px] -mt-[80px] max-h-[450px] xs:max-h-[520px] sm:max-h-[620px] md:max-h-[720px] lg:max-h-[820px] object-contain drop-shadow-2xl shadow-indigo-950/40 transform translate-y-6 xs:translate-y-8 sm:translate-y-12 lg:translate-y-20 hover:scale-105 transition-transform duration-300 origin-bottom"
              />
            </div>

            {/* Red Cartoon Car at bottom-left (In front of wave divider) */}
            <div className="absolute -bottom-2 sm:-bottom-4 left-1 sm:left-4 z-40 animate-float pointer-events-none" style={{ animationDelay: '0.5s' }}>
              <CartoonCarDoodle className="w-16 h-14 sm:w-24 sm:h-20 md:w-32 md:h-28 drop-shadow-md" />
            </div>

            {/* Stacking Toy at bottom-right (In front of wave divider) */}
            <div className="absolute -bottom-4 sm:-bottom-6 right-2 sm:right-6 z-40 animate-float pointer-events-none" style={{ animationDelay: '2s' }}>
              <StackingToyDoodle className="w-14 h-18 sm:w-20 sm:h-24 md:w-28 md:h-32 drop-shadow-md" />
            </div>
          </div>

          {/* Right Column: Hero Copy and CTAs */}
          <div className="mt-2 sm:mt-6 lg:mt-[50px] lg:col-span-6 relative z-50 space-y-4 sm:space-y-6 text-center lg:text-left order-1 lg:order-2">
            {/* Pill Badge */}
            <AnimatedText delay={0.1} distance={16} direction="up" className="inline-block">
              <div className="inline-flex items-center px-3.5 sm:px-4 py-1.5 rounded-full bg-[#4E3FE3] border border-white/10 text-xs sm:text-sm font-semibold tracking-wide shadow-sm spotlight-text-white">
                Enroll Your Child Today
              </div>
            </AnimatedText>

            {/* Main Headline */}
            <AnimatedText
              tag="h1"
              delay={0.2}
              distance={24}
              direction="up"
              className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[42px] font-black tracking-tight leading-[1.18] text-white spotlight-text-white"
            >
              Give Your Child the Best Start in Life – Enroll Today!
            </AnimatedText>

            {/* Subheading */}
            <AnimatedText
              tag="p"
              delay={0.3}
              distance={20}
              direction="up"
              className="text-sm sm:text-base md:text-lg text-white/90 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed spotlight-text-white"
            >
              Give your child a nurturing environment where curiosity blossoms, creativity thrives, and learning is fun.
            </AnimatedText>

            {/* Action Buttons */}
            <AnimatedText
              delay={0.4}
              distance={18}
              direction="up"
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-5 pt-2"
            >
              {/* Online Admission Button */}
              <button
                onClick={onOpenAdmission}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 pl-6 pr-2.5 py-3 bg-[#ED5B2D] hover:bg-[#d94a1d] text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-full shadow-xl shadow-orange-950/25 transition-all hover:scale-105 active:scale-95 cursor-pointer group"
              >
                <span>ONLINE ADMISSION</span>
                <div className="w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center group-hover:translate-x-0.5 transition-transform shrink-0">
                  <ArrowRight className="w-4 h-4 text-slate-900 stroke-[2.5]" />
                </div>
              </button>

              {/* Play Video Button */}
              <button
                onClick={onOpenVideo}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 py-2 text-white font-semibold text-sm hover:text-amber-300 transition-colors cursor-pointer group"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#FACC15] group-hover:bg-[#eab308] text-slate-900 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 shrink-0">
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-slate-900 translate-x-0.5" />
                </div>
                <span>Play intro video</span>
              </button>
            </AnimatedText>
          </div>
        </div>
      </div>

      {/* Bottom Wave Transition to White Section (In front / upper of hero image) */}
      <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none">
        <WavyScallopDivider fillColor="#FFFFFF" className="w-full h-16 xs:h-20 sm:h-24 lg:h-32" />
      </div>
    </section>
  );
};
