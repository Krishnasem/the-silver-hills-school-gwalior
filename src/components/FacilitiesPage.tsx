import React, { useState } from 'react';
import { AnimatedText } from './AnimatedText';
import {
  ArrowLeft,
  Maximize2,
  CheckCircle2,
  PhoneCall,
  X,
  ChevronRight
} from 'lucide-react';

interface FacilitiesPageProps {
  onBackToHome: () => void;
  onOpenAdmission: () => void;
}

interface FacilityItem {
  id: string;
  category: 'academic' | 'sports' | 'safety' | 'arts' | 'wellness';
  title: string;
  subtitle: string;
  imageUrl: string;
  badge: string;
  description: string;
  keyFeatures: string[];
  capacityOrSpec: string;
  safetyProtocol: string;
}

const mockFacilities: FacilityItem[] = [
  {
    id: 'fac-1',
    category: 'academic',
    title: 'Smart Interactive Digital Classrooms',
    subtitle: 'Digitally Enabled Ergonomic Learning Spaces',
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
    badge: 'Tech-Enabled Learning',
    description: 'Every classroom is equipped with high-definition interactive smartboards, sound-absorbing acoustics, age-adapted ergonomic furniture, and high-speed fiber internet for immersive audio-visual lessons.',
    keyFeatures: [
      'Interactive 75-inch 4K Touch Displays',
      'Child-safe rounded corner wooden desks & chairs',
      'Rich multi-sensory curriculum software integration',
      'Abundant natural sunlight and cross-ventilation',
      'Dedicated reading corner and activity table in every section',
    ],
    capacityOrSpec: '25-30 Students per section for optimal teacher-student ratio',
    safetyProtocol: 'Child-safe electrical sockets, non-toxic wall paints, and smoke detection sensors.',
  },
  {
    id: 'fac-4',
    category: 'academic',
    title: 'Central Library & Reading Wonderland',
    subtitle: 'A Treasure House of 3,000+ Books, Encyclopedias & Story Nooks',
    imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80',
    badge: 'Literary Hub',
    description: 'A warm and vibrant sanctuary filled with award-winning illustrated storybooks, graded reader series, young encyclopedias, and plush bean-bag reading corners to cultivate a lifelong love for reading.',
    keyFeatures: [
      'Over 3,000+ handpicked children’s titles & journals',
      'Weekly storytelling circles with audio-visual props',
      'Graded phonics & reading levels from Pre-K to Class 8',
      'Digital library search kiosk with automated book issuing',
      'Comfortable carpeted lounge and quiet focus alcoves',
    ],
    capacityOrSpec: 'Seating capacity for 60+ avid young readers',
    safetyProtocol: 'Low-height accessible shelving, soft rounded floor cushions, and eco-friendly sanitized book handling.',
  },
  {
    id: 'fac-6',
    category: 'safety',
    title: 'GPS-Tracked Safe School Fleet',
    subtitle: 'Air-Conditioned Buses with Lady Attendants & Live Location Sharing',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    badge: 'Safe Commute',
    description: 'Fleet of school buses covering all prime neighborhoods across the city, equipped with verified professional drivers, female attendants, speed regulators, and mobile app live GPS tracking.',
    keyFeatures: [
      'Live GPS location feed on parent mobile portal',
      'Trained lady attendant on every single vehicle route',
      'Speed limiters strictly capped at 40 km/h',
      'Interior HD CCTV cameras with 30-day cloud backup',
      'First-aid box, fire extinguishers, and emergency exit doors',
    ],
    capacityOrSpec: 'Extensive coverage across 12+ city routes with dedicated stops',
    safetyProtocol: 'Police-verified drivers, periodic breathalyzer checks, and mandatory attendance check-in/check-out log.',
  },
  {
    id: 'fac-7',
    category: 'safety',
    title: '360° CCTV Campus Security',
    subtitle: 'Round-the-Clock Physical & Digital Safety Infrastructure',
    imageUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80',
    badge: '100% Child Safety',
    description: 'Uncompromised security grid featuring 60+ high-resolution surveillance cameras covering all entry points, corridors, stairs, and playgrounds, complemented by strict digital visitor pass protocols.',
    keyFeatures: [
      'Central security command monitoring all campus cameras 24/7',
      'Strict visitor registration and photographic ID badge issuance',
      'Biometric staff attendance and authorized pickup ID cards for parents',
      'Perimeter boundary walls with security guard stations',
      'Comprehensive fire hydrant network & regular evacuation drills',
    ],
    capacityOrSpec: 'Continuous 24/7 surveillance coverage across 100% common areas',
    safetyProtocol: 'Child cannot leave school gates without matching Parent Pickup Card & SMS OTP confirmation.',
  },
  {
    id: 'fac-10',
    category: 'wellness',
    title: 'RO Drinking Water Facility',
    subtitle: 'Certified Medical Care & Pure Hydration Everywhere',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
    badge: 'Health & Hygiene',
    description: 'A fully equipped on-campus infirmary managed by a registered full-time nurse for immediate medical care, regular health checkups, along with touchless multi-stage RO purified drinking water stations.',
    keyFeatures: [
      'Resident qualified nurse on duty during all school operating hours',
      'Two comfortable recovery beds, oxygen support, and basic triage equipment',
      'Annual pediatric dental, vision, and general health screening',
      '5-stage UV + RO drinking water dispensers across every building floor',
      'Sanitized, child-friendly washrooms with dedicated cleaning staff',
    ],
    capacityOrSpec: 'Immediate first-response capability + tie-up with nearby tertiary hospital',
    safetyProtocol: 'Maintained digital health logs, immediate emergency parent calling, and 100% sterile medical supplies.',
  },
];

export const FacilitiesPage: React.FC<FacilitiesPageProps> = ({
  onBackToHome,
  onOpenAdmission,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeFacilityModal, setActiveFacilityModal] = useState<FacilityItem | null>(null);

  const categories = [
    { id: 'all', label: 'All Facilities' },
    { id: 'academic', label: 'Smart Classrooms' },
    { id: 'sports', label: 'Activities' },
    { id: 'safety', label: 'Safety & GPS Fleet' },
    { id: 'wellness', label: 'Infirmary & Hygiene' },
  ];

  const filteredFacilities = mockFacilities.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="bg-[#F8F9FE] min-h-screen pb-24 relative">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#6355EE] via-[#5446e8] to-[#4839de] text-white pt-10 pb-20 px-4 sm:px-8 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-amber-400/15 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumb / Back Button */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
            <span className="text-white/40 text-xs font-bold">/</span>
            <span className="text-amber-300 text-xs font-bold">Campus Life & Infrastructure</span>
          </div>

          {/* Title Area */}
          <div className="max-w-3xl">
            <AnimatedText
              tag="h1"
              delay={0.15}
              distance={22}
              direction="up"
              className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight mb-4 spotlight-text-white"
            >
              School Facilities & Campus Amenities
            </AnimatedText>
            <AnimatedText
              tag="p"
              delay={0.25}
              distance={18}
              direction="up"
              className="text-base sm:text-lg text-white/85 font-normal leading-relaxed spotlight-text-white"
            >
              Designed thoughtfully to inspire curiosity, ensure 100% physical safety, and foster well-rounded academic, creative, and physical excellence for every child.
            </AnimatedText>
          </div>
        </div>
      </div>

      {/* Category Navigation Pills */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl p-2 sm:p-2.5 shadow-xl shadow-indigo-950/5 border border-indigo-100 flex items-center gap-2 overflow-x-auto no-scrollbar sm:flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-[#6355EE] text-white shadow-md shadow-indigo-500/25 scale-[1.02]'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Facilities Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFacilities.map((fac) => (
            <div
              key={fac.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-950/10 transition-all duration-300 flex flex-col group"
            >
              {/* Photo Frame */}
              <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                <img
                  src={fac.imageUrl}
                  alt={fac.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3.5 py-1.5 rounded-full bg-white/95 text-[#6355EE] text-xs font-black shadow-md backdrop-blur-sm">
                    {fac.badge}
                  </span>
                </div>

                {/* Zoom overlay trigger */}
                <button
                  onClick={() => setActiveFacilityModal(fac)}
                  className="absolute bottom-3 right-3 p-2 rounded-xl bg-black/50 hover:bg-black/80 text-white transition-colors cursor-pointer backdrop-blur-sm"
                  title="View full facility details"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              {/* Body Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-black text-[#111638] group-hover:text-[#6355EE] transition-colors leading-snug mb-1 spotlight-text-dark">
                    {fac.title}
                  </h3>
                  <p className="text-xs font-bold text-[#6355EE] mb-3 spotlight-text-purple">
                    {fac.subtitle}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed mb-4 line-clamp-3 spotlight-text-slate">
                    {fac.description}
                  </p>

                  {/* Highlights Pill checklist */}
                  <div className="space-y-1.5 mb-6">
                    {fac.keyFeatures.slice(0, 3).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Area */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setActiveFacilityModal(fac)}
                    className="inline-flex items-center gap-1 text-xs font-black text-[#6355EE] hover:text-indigo-800 transition-colors cursor-pointer"
                  >
                    <span>View Specifications</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={onOpenAdmission}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-[#6355EE] hover:text-white text-[#6355EE] text-xs font-bold transition-all cursor-pointer"
                  >
                    Book Campus Tour
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule a Campus Tour Call to Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-16">
        <div className="bg-gradient-to-r from-[#6355EE] to-[#4F41D9] rounded-[32px] p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-indigo-950/15 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-black uppercase tracking-wider text-amber-300 mb-2 block spotlight-text-white">
              Experience It In Person
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white mb-2 leading-tight spotlight-text-white">
              Schedule a Guided Campus Walk-Through
            </h3>
            <p className="text-sm sm:text-base text-white/80 font-normal spotlight-text-white">
              Bring your child along to explore our classrooms, meet our caring educators, and see firsthand how our environment fosters happiness and high achievement.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap gap-3 shrink-0">
            <button
              onClick={onOpenAdmission}
              className="px-6 py-3.5 rounded-full bg-[#ED5B2D] hover:bg-[#d94a1d] text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-orange-950/20 transition-all cursor-pointer"
            >
              Book Tour Now
            </button>
            <a
              href="tel:+91 8602456620"
              className="px-6 py-3.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm tracking-wider transition-all cursor-pointer backdrop-blur-sm flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Campus Desk</span>
            </a>
          </div>
        </div>
      </div>

      {/* Detailed Facility Modal */}
      {activeFacilityModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-indigo-100 relative animate-fade-in max-h-[92vh] flex flex-col">
            {/* Modal Image Header */}
            <div className="relative h-48 xs:h-56 sm:h-72 w-full bg-slate-900 shrink-0">
              <img
                src={activeFacilityModal.imageUrl}
                alt={activeFacilityModal.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              <button
                onClick={() => setActiveFacilityModal(null)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-6 sm:right-6 text-white">
                <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-900 text-[11px] sm:text-xs font-black uppercase tracking-wider mb-1.5 sm:mb-2 inline-block">
                  {activeFacilityModal.badge}
                </span>
                <h3 className="text-xl sm:text-3xl font-black leading-tight">
                  {activeFacilityModal.title}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-8 overflow-y-auto space-y-4 sm:space-y-6 flex-1">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                  Overview & Facility Purpose
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  {activeFacilityModal.description}
                </p>
              </div>

              {/* Key Features List */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
                  Infrastructure & Equipment Highlights
                </h4>
                <div className="space-y-2">
                  {activeFacilityModal.keyFeatures.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <CheckCircle2 className="w-4 h-4 text-[#6355EE] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Capacity & Safety Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-100">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#6355EE] block mb-1">
                    Capacity / Layout Specs
                  </span>
                  <p className="text-xs text-slate-700 font-medium">
                    {activeFacilityModal.capacityOrSpec}
                  </p>
                </div>

                <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100">
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 block mb-1">
                    Safety & Sanitation Standard
                  </span>
                  <p className="text-xs text-slate-700 font-medium">
                    {activeFacilityModal.safetyProtocol}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shrink-0">
              <button
                onClick={() => setActiveFacilityModal(null)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors text-center cursor-pointer"
              >
                Close
              </button>

              <button
                onClick={() => {
                  setActiveFacilityModal(null);
                  onOpenAdmission();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#ED5B2D] hover:bg-[#d94a1d] text-white text-xs sm:text-sm font-black shadow-md shadow-orange-500/25 transition-all cursor-pointer"
              >
                <span>Book a Guided Campus Visit</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
