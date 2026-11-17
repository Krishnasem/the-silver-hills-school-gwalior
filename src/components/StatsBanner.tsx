import React from 'react';
import { PaperPlaneDoodle } from './Doodles';
import { AnimatedText } from './AnimatedText';
import { CountUpNumber } from './CountUpNumber';

export const StatsBanner: React.FC = () => {
  const stats = [
    {
      start: 1,
      end: 14,
      suffix: '+',
      duration: 1400,
      label: 'Year Of Experience',
      icon: (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-white stroke-current fill-none stroke-[2]" xmlns="http://www.w3.org/2000/svg">
          {/* Teacher with medal */}
          <circle cx="24" cy="14" r="8" />
          <path d="M10 40 C10 32 16 28 24 28 C26 28 28 28.5 30 29" />
          {/* Medal */}
          <circle cx="36" cy="34" r="6" />
          <path d="M33 40 L31 46 L36 43 L41 46 L39 40" />
          <polygon points="36,31 37.5,34 40.5,34 38,36 39,39 36,37.5 33,39 34,36 31.5,34 34.5,34" fill="currentColor" />
        </svg>
      ),
    },
    {
      start: 1,
      end: 2500,
      suffix: ' +',
      duration: 2200,
      label: 'Class Completed',
      icon: (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-white stroke-current fill-none stroke-[2]" xmlns="http://www.w3.org/2000/svg">
          {/* Cheering student */}
          <circle cx="24" cy="18" r="7" />
          <path d="M12 24 L16 32 L20 30 L20 44 L28 44 L28 30 L32 32 L36 24" />
          {/* Clock & Stars above */}
          <circle cx="24" cy="8" r="4" />
          <polyline points="24,6 24,8 26,8" />
          <polygon points="14,8 15,10 17,10 15.5,11.5 16,13.5 14,12.5 12,13.5 12.5,11.5 11,10 13,10" fill="currentColor" />
          <polygon points="34,8 35,10 37,10 35.5,11.5 36,13.5 34,12.5 32,13.5 32.5,11.5 31,10 33,10" fill="currentColor" />
        </svg>
      ),
    },
    {
      start: 1,
      end: 2549,
      suffix: ' +',
      duration: 2200,
      label: 'Students Enroll',
      icon: (
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-white stroke-current fill-none stroke-[2]" xmlns="http://www.w3.org/2000/svg">
          {/* Three graduated students */}
          <polygon points="24,6 34,11 24,16 14,11" />
          <circle cx="24" cy="20" r="5" />
          <path d="M16 38 C16 32 20 28 24 28 C28 28 32 32 32 38" />
          
          <polygon points="10,14 17,17 10,20 3,17" />
          <circle cx="10" cy="23" r="3.5" />
          <path d="M4 38 C4 34 7 31 10 31" />
          
          <polygon points="38,14 45,17 38,20 31,17" />
          <circle cx="38" cy="23" r="3.5" />
          <path d="M44 38 C44 34 41 31 38 31" />
        </svg>
      ),
    },
  ];

  return (
    <section className="relative bg-[#6355EE] text-white py-14 my-8 overflow-hidden">
      {/* Paper airplane with dotted loop trail on the left */}
      <div className="absolute top-1/2 left-4 md:left-12 -translate-y-1/2 pointer-events-none hidden sm:block">
        <PaperPlaneDoodle className="w-20 h-20" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 relative z-30">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 text-center items-center justify-center">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center justify-center space-y-2 p-2">
              {/* Icon */}
              <div className="mb-2 flex items-center justify-center h-14">
                {stat.icon}
              </div>

              {/* Number Value with Count-Up starting from 1 */}
              <AnimatedText
                delay={i * 0.12}
                distance={18}
                direction="up"
                className="text-3xl sm:text-4xl lg:text-[44px] font-black tracking-tight text-white leading-none spotlight-text-white"
              >
                <CountUpNumber
                  start={stat.start}
                  end={stat.end}
                  suffix={stat.suffix}
                  duration={stat.duration}
                />
              </AnimatedText>

              {/* Label */}
              <AnimatedText
                delay={i * 0.12 + 0.08}
                distance={14}
                direction="up"
                className="text-xs sm:text-sm font-semibold text-white/90 spotlight-text-white"
              >
                {stat.label}
              </AnimatedText>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
