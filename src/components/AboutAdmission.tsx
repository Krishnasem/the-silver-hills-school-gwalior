import React, { useState, useEffect } from 'react';
import principalImg from '../assets/images/regenerated_image_1787812722900.png';
import directorImg from '../assets/images/regenerated_image_1788332778294.jpg';
import advisorImg from '../assets/images/educational advisor.jpg';
import { ArrowRight, ChevronLeft, ChevronRight, Award, GraduationCap } from 'lucide-react';
import { LightbulbDoodle, AbcBlocksDoodle } from './Doodles';
import { AnimatedText } from './AnimatedText';

interface AboutAdmissionProps {
  onOpenAdmission?: () => void;
  onOpenVideo?: () => void;
  onOpenMessagesPage?: (authorityId?: string) => void;
}

interface SchoolAuthority {
  id: string;
  name: string;
  role: string;
  message: string;
  image: string;
  badge: string;
}

const schoolAuthorities: SchoolAuthority[] = [
  {
    id: 'auth-1',
    name: 'Mrs. Brajmohini Yadav',
    role: 'Academic Director',
    message: 'As a Director "The Silver Hills School" I am committed to create a surrounding where student feel respected safe and inspired to learn and grow. I believe in open and effective communication with children, faculty, the parents not only to insure transparency and accountable governance, but more so, because and see it us a powerful means of converting a good idea into an implemented initiatives. Our school is constantly scaling new heights in the sphere of academic and co curricular activities so that they evolve as excellent individuals. We consider it a great privilege to thank all the parents who trust us and support whenever required. We assure to do our best always. I keep an office open to all that allows direct access to me to discuss all the matter related to the student, parent and school life.',
    image: directorImg,
    badge: 'Director',
  },
  {
    id: 'auth-2',
    name: 'Mr. Rajveer Singh',
    role: 'Educational Advisor',
    message: 'I Strongly believe that every child is a unique creation with immense potential. School is a unique platform where the hidden talents can be identified and nurtured with motivation and encouragement. It is an excellent medium where students can reveal there creativity in the field of literature, art and science etc. Teaching methodology should support free growth and development of children by providing conductive atmosphere. What children need is freedom of expression without freedom no physical and mental growth is possible. The real growth of mind is possible only when a child is free to explore himself and share his feelings with parents, teachers and friends. School is a platform where he finds a right channel to show his talent and creativity to others. When his work is praised and admired by others, he feels inspired and motivated to rise further and prove his talent.',
    image: advisorImg,
    badge: 'Educational Advisor',
  },
  {
    id: 'auth-3',
    name: 'Ms. Divya Dixit',
    role: 'Principal',
    message: 'Dear students, The role of school is not only to pursue academic excellence but also to motivate and empower its students to be lifelong learners, critical thinkers and productive members of an ever changing global society. At "The Silver Hills School", we provide an atmosphere to our students for multifaced development, where childrens are encouraged to channelize their potential in the pursuit of excellence. Learning is so much of progress limited to schools and colleges only, nor does it end with conclusion of ones school is oriented to the total formation of child and to adaptation of various methods suiting the dynamics of changing world in order to achieve common goals and objectives. it is a message to you all that the fine character live by their values. they are honest honest and committed to truthfulness, word and deed. True character thus encompasses the capacity for self discipline. Character creates self respect, which in turn leads to high self esteem.',
    image: principalImg,
    badge: 'Principal',
  },
];

export const AboutAdmission: React.FC<AboutAdmissionProps> = ({
  onOpenAdmission,
  onOpenVideo,
  onOpenMessagesPage,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-swipe every 4.5 seconds
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % schoolAuthorities.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % schoolAuthorities.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + schoolAuthorities.length) % schoolAuthorities.length);
  };

  const currentAuthority = schoolAuthorities[currentIndex];

  return (
    <section id="admissions" className="py-12 md:py-20 bg-white relative overflow-hidden">
      {/* Bottom Left Lightbulb Doodle */}
      <div className="absolute bottom-6 left-4 md:left-12 pointer-events-none animate-float">
        <LightbulbDoodle className="w-12 h-12 md:w-16 md:h-16" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Admissions Info */}
          <div className="lg:col-span-6 space-y-6">
            {/* Pill Badge */}
            <AnimatedText delay={0.05} distance={16} direction="up" className="inline-block">
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#EBE8FD] text-[#6355EE] text-xs sm:text-sm font-bold tracking-wide">
                <GraduationCap className="w-4 h-4" />
                <span>Message from School Authorities</span>
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
              Nurturing Minds, Inspiring Futures
            </AnimatedText>

            {/* Description */}
            <AnimatedText
              tag="p"
              delay={0.25}
              distance={18}
              direction="up"
              className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal spotlight-text-slate"
            >
              Guided by our experienced educators and visionary school leadership, we believe that every child is unique and full of potential. Our school provides a nurturing and supportive environment where students are encouraged to discover their talents, express their ideas, develop their creativity, and grow with confidence.
            </AnimatedText>

            {/* Button */}
            <AnimatedText delay={0.35} distance={16} direction="up" className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  if (onOpenMessagesPage) {
                    onOpenMessagesPage();
                  } else if (onOpenAdmission) {
                    onOpenAdmission();
                  }
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 pl-6 pr-2.5 py-3 bg-[#ED5B2D] hover:bg-[#d94a1d] text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-full shadow-lg shadow-orange-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer group"
              >
                <span>READ OUR MESSAGES</span>
                <div className="w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center group-hover:translate-x-0.5 transition-transform shrink-0">
                  <ArrowRight className="w-4 h-4 text-slate-900 stroke-[2.5]" />
                </div>
              </button>
            </AnimatedText>
          </div>

          {/* Right Column: School Authorities Sliding Showcase */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            <div
              className="relative w-full max-w-md sm:max-w-lg aspect-square"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Outer decorative purple splashes */}
              <div className="absolute -top-4 -right-4 w-20 h-20 text-[#6355EE] pointer-events-none z-10">
                <svg viewBox="0 0 100 100" fill="currentColor">
                  <path d="M50 10 C60 30 75 40 85 45 C75 55 65 70 50 90 C35 70 25 55 15 45 C25 40 40 30 50 10 Z" />
                </svg>
              </div>

              {/* Main Authority Photo Container with Sliding Animation */}
              <div className="w-full h-full rounded-[48px] overflow-hidden border-4 border-[#FDBA74] shadow-2xl relative bg-slate-900">
                {schoolAuthorities.map((authority, idx) => {
                  const isActive = idx === currentIndex;
                  return (
                    <div
                      key={authority.id}
                      className={`absolute inset-0 w-full h-full transition-all duration-500 ease-out ${
                        isActive
                          ? 'opacity-100 scale-100 pointer-events-auto z-10'
                          : 'opacity-0 scale-95 pointer-events-none z-0'
                      }`}
                    >
                      <img
                        src={authority.image}
                        alt={authority.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-[center_15%]"
                      />

                      {/* Gradient Overlay for Text Legibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
                        {/* Authority Badge */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ED5B2D] text-white text-[11px] font-black uppercase tracking-wider w-max mb-2 shadow-md">
                          <Award className="w-3 h-3" />
                          <span>{authority.badge}</span>
                        </div>

                        {/* Name & Role */}
                        <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                          {authority.name}
                        </h3>
                        <p className="text-xs sm:text-sm font-semibold text-amber-300">
                          {authority.role}
                        </p>

                        {/* Leadership Quote */}
                        <p className="text-xs text-white/90 italic mt-2 line-clamp-2 bg-black/30 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
                          "{authority.message}"
                        </p>
                      </div>
                    </div>
                  );
                })}

                {/* Left / Right Slide Navigation Buttons */}
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-all hover:scale-110 cursor-pointer"
                  title="Previous Authority"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-all hover:scale-110 cursor-pointer"
                  title="Next Authority"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Carousel Progress Dots */}
                <div className="absolute top-4 right-4 z-30 flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-2.5 py-1.5 rounded-full">
                  {schoolAuthorities.map((auth, idx) => (
                    <button
                      key={auth.id}
                      onClick={() => {
                        setDirection(idx > currentIndex ? 1 : -1);
                        setCurrentIndex(idx);
                      }}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        idx === currentIndex ? 'w-5 bg-[#ED5B2D]' : 'w-2 bg-white/60 hover:bg-white'
                      }`}
                      title={`View ${auth.name}`}
                    />
                  ))}
                </div>
              </div>

              {/* Yellow Scalloped Flower Badge: "14+ Years Leadership" */}
              <div className="absolute -bottom-3 -left-1 sm:-bottom-6 sm:-left-8 z-20 flex items-center justify-center">
                <div className="relative w-24 h-24 xs:w-28 xs:h-28 sm:w-36 sm:h-36 flex items-center justify-center">
                  {/* Yellow Flower shape */}
                  <svg viewBox="0 0 120 120" className="w-full h-full absolute inset-0 text-[#FACC15] fill-current">
                    <path d="M60 5 C68 5 72 15 80 17 C88 19 98 15 104 22 C110 29 107 39 110 47 C113 55 123 60 123 68 C123 76 113 81 110 89 C107 97 110 107 104 114 C98 121 88 117 80 119 C72 121 68 131 60 131 C52 131 48 121 40 119 C32 117 22 121 16 114 C10 107 13 97 10 89 C7 81 -3 76 -3 68 C-3 60 7 55 10 47 C13 39 10 29 16 22 C22 15 32 19 40 17 C48 15 52 5 60 5 Z" stroke="#1E1B4B" strokeWidth="4" />
                  </svg>
                  {/* Text inside badge */}
                  <div className="relative z-10 text-center font-sans">
                    <span className="block text-xl xs:text-2xl sm:text-4xl font-black text-[#111638] leading-none">14+</span>
                    <span className="block text-[8px] xs:text-[9px] sm:text-xs font-bold text-slate-700 mt-0.5 sm:mt-1">Years Leadership</span>
                  </div>
                </div>
              </div>

              {/* Bottom Right ABC Blocks & Toys Doodle */}
              <div className="absolute -bottom-10 -right-12 z-10 pointer-events-none hidden sm:block">
                <AbcBlocksDoodle className="w-20 h-20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
