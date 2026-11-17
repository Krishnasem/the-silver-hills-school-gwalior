import React, { useState, useEffect } from 'react';
import { AnimatedText } from './AnimatedText';
import principalImg from '../assets/images/regenerated_image_1787812722900.png';
import directorImg from '../assets/images/regenerated_image_1788332778294.jpg';
import advisorImg from '../assets/images/educational advisor.jpg';
import {
  ArrowLeft,
  Quote,
  Award,
  GraduationCap,
  Sparkles,
  Heart,
  BookOpen,
  Compass,
  CheckCircle2,
  Calendar,
  Mail,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface LeadershipMessagesPageProps {
  onBackToHome: () => void;
  onOpenAdmission?: () => void;
  initialAuthorityId?: string;
}

interface AuthorityMessage {
  id: string;
  name: string;
  badge: string;
  role: string;
  experience: string;
  image: string;
  themeColor: string;
  accentBg: string;
  borderColor: string;
  heading: string;
  salutation: string;
  paragraphs: string[];
  keyPillars: { title: string; desc: string }[];
  highlightQuote: string;
  signatureText: string;
}

const authorityMessages: AuthorityMessage[] = [
  {
    id: 'principal',
    name: 'Ms. Divya Dixit',
    badge: 'Principal',
    role: 'Principal',
    experience: '12+ Years in Education',
    image: principalImg,
    themeColor: '#6355EE',
    accentBg: 'bg-indigo-50/70',
    borderColor: 'border-indigo-200',
    heading: 'Fostering Curiosity, Character, and Compassionate Excellence',
    salutation: 'Dear Parents, Esteemed Teachers, and Our Beloved Students,',
    paragraphs: [
      'The role of school is not only to pursue academic excellence but also to motivate and empower its students to be lifelong learners, critical thinkers and productive members of an ever changing global society. At "The Silver Hills School", we provide an atmosphere to our students for multifaced development, where childrens are encouraged to channelize their potential in the pursuit of excellence. Learning is so much of progress limited to schools and colleges only, nor does it end with conclusion of ones school is oriented to the total formation of child and to adaptation of various methods suiting the dynamics of changing world in order to achieve common goals and objectives. it is a message to you all that the fine character live by their values. they are honest honest and committed to truthfulness, word and deed. True character thus encompasses the capacity for self discipline. Character creates self respect, which in turn leads to high self esteem.',
    ],
    keyPillars: [
      {
        title: 'Inquiry-Based Learning',
        desc: 'Encouraging independent thinking, analytical questioning, and conceptual mastery.',
      },
      {
        title: 'Emotional Resilience & Empathy',
        desc: 'Building emotional intelligence, kindness, and strong social-emotional foundations.',
      },
      {
        title: 'Parent-School Synergy',
        desc: 'Maintaining transparent, ongoing dialogue to support every child’s individual growth arc.',
      },
    ],
    highlightQuote:
      'True education does not merely teach a child what to think; it inspires them to discover how to think, feel deeply, and act with integrity.',
    signatureText: 'Ms. Divya Dixit — Principal',
  },
  {
    id: 'advisor',
    name: 'Mr. Rajveer Singh',
    badge: 'Educational Advisor',
    role: 'Educational Advisor',
    experience: '14+ Years in Leadership',
    image: advisorImg,
    themeColor: '#ED5B2D',
    accentBg: 'bg-orange-50/70',
    borderColor: 'border-orange-200',
    heading: 'Building Foundations of Integrity, Wisdom, and Lifelong Discovery',
    salutation: 'To Our Valued School Community and Prospective Families,',
    paragraphs: [
      'I Strongly believe that every child is a unique creation with immense potential. School is a unique platform where the hidden talents can be identified and nurtured with motivation and encouragement. It is an excellent medium where students can reveal there creativity in the field of literature, art and science etc. Teaching methodology should support free growth and development of children by providing conductive atmosphere. What children need is freedom of expression without freedom no physical and mental growth is possible. The real growth of mind is possible only when a child is free to explore himself and share his feelings with parents, teachers and friends. School is a platform where he finds a right channel to show his talent and creativity to others. When his work is praised and admired by others, he feels inspired and motivated to rise further and prove his talent.',
    ],
    keyPillars: [
      {
        title: 'Global Standards & Cultural Roots',
        desc: 'Balancing forward-looking 21st-century skills with deep-rooted human values.',
      },
      {
        title: 'Future-Ready Infrastructure',
        desc: 'Safe, smart classrooms, sensory science corners, and expansive open play zones.',
      },
      {
        title: 'Holistic Character First',
        desc: 'Instilling honesty, perseverance, and social responsibility into daily school rituals.',
      },
    ],
    highlightQuote:
      'We do not just build students for examinations; we prepare visionary citizens capable of elevating their communities with knowledge and compassion.',
    signatureText: 'Mr. Rajveer Singh — Educational Advisor',
  },
  {
    id: 'director',
    name: 'Mrs. Brajmohini Yadav',
    badge: 'Director',
    role: 'Director',
    experience: '12+ Years in Early Learning',
    image: directorImg,
    themeColor: '#059669',
    accentBg: 'bg-emerald-50/70',
    borderColor: 'border-emerald-200',
    heading: 'Creating a Joyful, Loving Sanctuary Where Every Child Blossoms',
    salutation: 'A Warm and Hearty Welcome to All Parents and Visitors,',
    paragraphs: [
      'As a Director "The Silver Hills School" I am committed to create a surrounding where student feel respected safe and inspired to learn and grow. I believe in open and effective communication with children, faculty, the parents not only to insure transparency and accountable governance, but more so, because and see it us a powerful means of converting a good idea into an implemented initiatives. Our school is constantly scaling new heights in the sphere of academic and co curricular activities so that they evolve as excellent individuals. We consider it a great privilege to thank all the parents who trust us and support whenever required. We assure to do our best always. I keep an office open to all that allows direct access to me to discuss all the matter related to the student, parent and school life.',
    ],
    keyPillars: [
      {
        title: 'Playful & Sensory Pedagogy',
        desc: 'Blending phonics, storytelling, music, and motor skills into joyful daily routines.',
      },
      {
        title: 'Nurturing & Secure Haven',
        desc: 'A comforting, safe environment where children develop social trust and self-worth.',
      },
      {
        title: 'Celebrating Unique Talents',
        desc: 'Providing personalized attention to encourage diverse learning styles and creative expression.',
      },
    ],
    highlightQuote:
      'When children feel safe, loved, and heard, their natural curiosity unfolds into limitless academic and creative brilliance.',
    signatureText: 'Mrs. Brajmohini Yadav — Director',
  },
];

export const LeadershipMessagesPage: React.FC<LeadershipMessagesPageProps> = ({
  onBackToHome,
  onOpenAdmission,
  initialAuthorityId = 'all',
}) => {
  const [selectedTab, setSelectedTab] = useState<string>(initialAuthorityId);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const filteredAuthorities =
    selectedTab === 'all'
      ? authorityMessages
      : authorityMessages.filter((auth) => auth.id === selectedTab);

  return (
    <div className="bg-[#FAF9FF] min-h-screen text-slate-800 pb-20">
      {/* Header Banner & Breadcrumb */}
      <div className="bg-gradient-to-r from-[#1B154B] via-[#2A1D72] to-[#6355EE] text-white pt-10 pb-16 px-4 sm:px-8 relative overflow-hidden">
        {/* Background Subtle Doodles / Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-72 h-72 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Back Button & Breadcrumbs */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold backdrop-blur-md transition-all cursor-pointer border border-white/15 hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>

            <nav className="flex items-center gap-2 text-xs sm:text-sm text-white/70 font-medium">
              <button
                onClick={onBackToHome}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Home
              </button>
              <span>/</span>
              <button
                onClick={onBackToHome}
                className="hover:text-white transition-colors cursor-pointer"
              >
                About
              </button>
              <span>/</span>
              <span className="text-amber-300 font-bold">Leadership Messages</span>
            </nav>
          </div>

          {/* Page Title */}
          <div className="max-w-3xl">
            <AnimatedText
              tag="h1"
              delay={0.1}
              distance={22}
              direction="up"
              className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight mb-4 spotlight-text-white"
            >
              Messages from Our School Authorities
            </AnimatedText>

            <AnimatedText
              tag="p"
              delay={0.2}
              distance={18}
              direction="up"
              className="text-base sm:text-lg text-white/85 font-normal leading-relaxed spotlight-text-white"
            >
              Read the guiding vision, foundational principles, and heartfelt addresses from the leadership team dedicated to your child's holistic growth at The Silver Hills School.
            </AnimatedText>
          </div>
        </div>
      </div>

      {/* Navigation Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-7 relative z-10">
        <div className="bg-white rounded-2xl p-2 sm:p-2.5 shadow-xl shadow-indigo-950/5 border border-indigo-100 flex items-center gap-2 overflow-x-auto no-scrollbar sm:flex-wrap py-0.5">
          <button
            onClick={() => setSelectedTab('all')}
            className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              selectedTab === 'all'
                ? 'bg-[#6355EE] text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-600 hover:bg-indigo-50 hover:text-[#6355EE]'
            }`}
          >
            All Leadership Messages
          </button>

          {authorityMessages.map((auth) => (
            <button
              key={auth.id}
              onClick={() => setSelectedTab(auth.id)}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-2 ${
                selectedTab === auth.id
                  ? 'bg-[#111638] text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: auth.themeColor }} />
              <span>{auth.name}</span>
              <span className="hidden md:inline text-[11px] opacity-75 font-normal">({auth.badge})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area with Detailed Authority Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-12 space-y-16">
        {filteredAuthorities.map((auth, index) => (
          <article
            key={auth.id}
            id={`message-${auth.id}`}
            className="bg-white rounded-[36px] border border-indigo-100/90 shadow-xl shadow-indigo-950/5 overflow-hidden transition-all duration-300 hover:shadow-2xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 p-4 sm:p-8 lg:p-12">
              
              {/* Left Column: Authority Profile Card */}
              <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
                {/* Photo with Styled Frame */}
                <div className="relative w-48 h-56 xs:w-56 xs:h-64 sm:w-64 sm:h-72 rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-xl border-4 border-white ring-4 ring-indigo-100 mb-5 sm:mb-6 bg-slate-900 shrink-0">
                  <img
                    src={auth.image}
                    alt={auth.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-[center_15%]"
                  />
                  {/* Badge */}
                  <div
                    className="absolute top-3 left-3 px-3 py-1 rounded-full text-white text-[11px] font-black uppercase tracking-wider shadow-md"
                    style={{ backgroundColor: auth.themeColor }}
                  >
                    {auth.badge}
                  </div>
                </div>

                {/* Name & Credentials */}
                <h2 className="text-2xl sm:text-3xl font-black text-[#111638] leading-tight mb-1 spotlight-text-dark">
                  {auth.name}
                </h2>
                <p className="text-sm font-bold text-[#6355EE] mb-1 spotlight-text-purple">
                  {auth.role}
                </p>

                {/* Experience & Credential Tag */}
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-6 border border-slate-200">
                  <Award className="w-3.5 h-3.5 text-[#ED5B2D]" />
                  <span className="spotlight-text-slate">{auth.experience}</span>
                </div>

                {/* Highlight Quote Box */}
                <div className="w-full bg-gradient-to-br from-indigo-50/70 to-purple-50/50 rounded-2xl p-4 sm:p-5 border border-indigo-100/80 relative text-left mb-6">
                  <Quote className="w-6 h-6 text-[#6355EE]/40 mb-2" />
                  <p className="text-xs sm:text-sm text-slate-700 italic font-medium leading-relaxed spotlight-text-slate">
                    "{auth.highlightQuote}"
                  </p>
                </div>


              </div>

              {/* Right Column: Full Address / Message Body */}
              <div className="lg:col-span-8 flex flex-col justify-between">
                <div>
                  {/* Category Pill & Heading */}
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: auth.themeColor }}
                    />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 spotlight-text-slate">
                      Official Address
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-[#111638] tracking-tight leading-snug mb-4 spotlight-text-dark">
                    {auth.heading}
                  </h3>

                  {/* Salutation */}
                  <p className="text-base sm:text-lg font-bold text-[#6355EE] mb-4 spotlight-text-purple">
                    {auth.salutation}
                  </p>

                  {/* Message Paragraphs */}
                  <div className="space-y-4 text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                    {auth.paragraphs.map((para, pIdx) => (
                      <p key={pIdx} className="spotlight-text-slate">{para}</p>
                    ))}
                  </div>

                  {/* Key Educational Commitments / Pillars */}
                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2 spotlight-text-dark">
                      <ShieldCheck className="w-4 h-4 text-[#6355EE]" />
                      <span>Guiding Pillars of this Leadership</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      {auth.keyPillars.map((pillar, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-50 hover:bg-indigo-50/40 rounded-2xl p-3.5 border border-slate-200/80 transition-colors"
                        >
                          <div className="flex items-center gap-1.5 text-xs font-black text-[#111638] mb-1 spotlight-text-dark">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                            <span>{pillar.title}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium leading-normal spotlight-text-slate">
                            {pillar.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sign-off & Signature Area */}
                <div className="mt-10 pt-6 border-t border-dashed border-indigo-100 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="block text-xs font-semibold text-slate-400 spotlight-text-slate">
                      Warm regards & blessings,
                    </span>
                    <span className="text-base sm:text-lg font-black text-[#111638] font-serif spotlight-text-dark">
                      {auth.name}
                    </span>
                    <span className="block text-xs font-bold text-slate-500 spotlight-text-slate">
                      {auth.signatureText}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/80 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>The Silver Hills School</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </article>
        ))}
      </div>

      {/* Bottom CTA Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-16">
        <div className="bg-gradient-to-r from-[#6355EE] to-[#4F41D9] rounded-[32px] p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-indigo-950/15 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-black uppercase tracking-wider text-amber-300 mb-2 block spotlight-text-white">
              Join Our School Family
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white mb-2 leading-tight spotlight-text-white">
              Ready to Give Your Child an Inspiring Educational Journey?
            </h3>
            <p className="text-sm sm:text-base text-white/80 font-normal spotlight-text-white">
              Book a campus walk-through, interact with our educators, and explore how we support every child’s potential.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onBackToHome}
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition-all border border-white/20 cursor-pointer"
            >
              Explore Campus & Classes
            </button>
            {onOpenAdmission && (
              <button
                onClick={onOpenAdmission}
                className="px-6 py-3 rounded-full bg-[#ED5B2D] hover:bg-[#d94a1d] text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg shadow-orange-950/20 cursor-pointer hover:scale-105"
              >
                Apply for Admission
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
