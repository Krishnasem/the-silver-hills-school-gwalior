import React from 'react';
import { Facebook, Instagram } from 'lucide-react';
import { FluffyCloudDivider, RainbowCloudDoodle, HotAirBalloonDoodle } from './Doodles';
import schoolLogo from '../assets/images/logo3.png';

interface FooterProps {
  onNavigateHome?: () => void;
  onNavigateAcademics?: (subTab?: 'syllabus' | 'timetable' | 'results') => void;
  onNavigateFacilities?: () => void;
  onNavigateGallery?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateHome,
  onNavigateAcademics,
  onNavigateFacilities,
  onNavigateGallery,
}) => {
  return (
    <footer className="relative bg-[#6355EE] text-white pt-12 overflow-hidden">
      {/* Top Clouds transition */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <FluffyCloudDivider cloudColor="#FFFFFF" inverted={true} className="w-full h-8 sm:h-12" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-30 pt-6">
        {/* Top Header Row: Brand Logo, Tagline & Social Follow */}
        {/* Top Header Row: Brand Logo, Tagline & Social Follow */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 sm:pb-8">
          <div className="space-y-3 max-w-lg">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <img
                src={schoolLogo}
                alt="The Silver Hills School"
                className="h-12 sm:h-16 md:h-20 w-auto object-contain max-w-[240px] sm:max-w-[340px]"
                referrerPolicy="no-referrer"
              />
            </div>

            <p className="text-xs sm:text-sm text-white/85 leading-relaxed font-normal spotlight-text-white">
              The Silver Hills School provides a safe, inspiring, and nurturing environment for students to ignite the spark of wisdom, learn, and grow.
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <a
              href="https://www.facebook.com/profile.php?id=61593871000346"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            >
              <Facebook className="w-4 h-4 fill-current" />
            </a>
            <a
              href="https://www.instagram.com/thesilverhills_school/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            >
              <Instagram className="w-4 h-4 fill-current" />
            </a>
          </div>
        </div>

        {/* Dashed Horizontal Divider */}
        <div className="border-t border-dashed border-white/25 my-4 sm:my-6" />

        {/* 4 Info Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8 py-3 sm:py-4">
          {/* Column 1 */}
          <div className="space-y-1">
            <span className="text-[11px] sm:text-xs text-white/70 font-semibold block spotlight-text-white">Our Location</span>
            <p className="text-sm sm:text-base font-extrabold text-white spotlight-text-white">
              C Block - Hurawali Morar, Gwalior, Madhya Pradesh - 474006
            </p>
            <p className="text-sm sm:text-base font-extrabold text-white spotlight-text-white pt-1">
              AH-32, (8-HIG), DD Nagar, Gwalior, Madhya Pradesh - 474005
            </p>
          </div>

          {/* Column 2 */}
          <div className="space-y-1">
            <span className="text-[11px] sm:text-xs text-white/70 font-semibold block spotlight-text-white">Email Address</span>
            <a
              href="mailto:info@thesilverhillsschools.com"
              className="text-sm sm:text-base font-extrabold text-white hover:text-amber-200 transition-colors block spotlight-text-white break-all sm:break-normal"
            >
              info@thesilverhillsschools.com
            </a>
          </div>

          {/* Column 3 */}
          <div className="space-y-1">
            <span className="text-[11px] sm:text-xs text-white/70 font-semibold block spotlight-text-white">Call for inquiries</span>
            <a
              href="tel:+918602456620"
              className="text-sm sm:text-base font-extrabold text-white hover:text-amber-200 transition-colors block spotlight-text-white"
            >
              +91 8602456620, 0751-2461474
            </a>
          </div>

          {/* Column 4 */}
          <div className="space-y-1">
            <span className="text-[11px] sm:text-xs text-white/70 font-semibold block spotlight-text-white">Days Open</span>
            <p className="text-sm sm:text-base font-extrabold text-white spotlight-text-white">
              Mon – Sat , (Closed: Sunday)
            </p>
          </div>
        </div>

        {/* Navigation Links and Copyright Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 pb-4 text-sm font-semibold border-t border-white/10 mt-6 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-4 sm:gap-6 flex-wrap">
            <button
              onClick={() => {
                if (onNavigateHome) onNavigateHome();
                else window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-amber-300 transition-colors spotlight-text-white cursor-pointer py-1"
            >
              Home
            </button>
            <button
              onClick={() => {
                if (onNavigateAcademics) onNavigateAcademics('syllabus');
              }}
              className="hover:text-amber-300 transition-colors spotlight-text-white cursor-pointer py-1"
            >
              Academics
            </button>
            <button
              onClick={() => {
                if (onNavigateFacilities) onNavigateFacilities();
              }}
              className="hover:text-amber-300 transition-colors spotlight-text-white cursor-pointer py-1"
            >
              Facilities
            </button>
            <button
              onClick={() => {
                if (onNavigateGallery) onNavigateGallery();
              }}
              className="hover:text-amber-300 transition-colors spotlight-text-white cursor-pointer py-1"
            >
              Gallery
            </button>
            <button
              onClick={() => {
                if (onNavigateHome) onNavigateHome();
                setTimeout(() => {
                  const el = document.getElementById('contact');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }}
              className="hover:text-amber-300 transition-colors spotlight-text-white cursor-pointer py-1"
            >
              Contact Us
            </button>
          </div>

          <div className="text-xs text-white/80 spotlight-text-white">
            © All Copyright 2026 by Krishna Sharma, FrameFlicks Pvt Ltd.
          </div>
        </div>
      </div>

      {/* Whimsical Grass & Kids Landscape Vector Art at the Bottom */}
      <div className="relative w-full h-36 sm:h-52 mt-4 overflow-hidden select-none">
        {/* Rainbow cloud on left */}
        <div className="absolute top-1 sm:top-2 left-2 sm:left-6 z-30 pointer-events-none animate-float">
          <RainbowCloudDoodle className="w-24 h-24 sm:w-38 sm:h-42 md:w-42 md:h-46 drop-shadow-md" />
        </div>

        {/* Hot Air Balloon on right */}
        <div className="absolute top-0 right-2 sm:right-10 z-20 pointer-events-none animate-float" style={{ animationDelay: '1.5s' }}>
          <HotAirBalloonDoodle className="w-24 h-28 sm:w-38 sm:h-42 md:w-42 md:h-46 drop-shadow-md" />
        </div>

        {/* Green Rolling Hills Vector */}
        <svg
          viewBox="0 0 1440 220"
          className="absolute bottom-0 left-0 right-0 w-full h-full"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Back Hill */}
          <path
            d="M0,120 C300,50 600,140 900,80 C1200,30 1350,90 1440,110 L1440,220 L0,220 Z"
            fill="#84CC16"
            opacity="0.6"
          />
          {/* Foreground Hill */}
          <path
            d="M0,150 C250,90 550,160 850,110 C1150,60 1320,130 1440,140 L1440,220 L0,220 Z"
            fill="#A3E635"
          />
          {/* Grass Blades & Tufts */}
          <path d="M120,140 L125,125 M125,140 L132,128 M130,140 L138,130" stroke="#65A30D" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M380,155 L385,140 M385,155 L392,143 M390,155 L398,145" stroke="#65A30D" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M720,135 L725,120 M725,135 L732,123 M730,135 L738,125" stroke="#65A30D" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M1100,120 L1105,105 M1105,120 L1112,108 M1110,120 L1118,110" stroke="#65A30D" strokeWidth="2.5" strokeLinecap="round" />
          
          {/* Little Daisies / White Flowers on the hill */}
          <circle cx="220" cy="180" r="5" fill="#FFFFFF" />
          <circle cx="220" cy="180" r="2" fill="#FACC15" />
          <circle cx="580" cy="170" r="6" fill="#FFFFFF" />
          <circle cx="580" cy="170" r="2.5" fill="#FACC15" />
          <circle cx="950" cy="165" r="5" fill="#FFFFFF" />
          <circle cx="950" cy="165" r="2" fill="#FACC15" />
          <circle cx="1280" cy="180" r="6" fill="#FFFFFF" />
          <circle cx="1280" cy="180" r="2.5" fill="#FACC15" />
        </svg>

        {/* Center-Left: Little Girl Playing with Blocks illustration */}
        <div className="absolute bottom-1 sm:bottom-2 left-1/3 z-20 pointer-events-none transform -translate-x-1/2">
          <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-38 sm:h-42 md:w-42 md:h-46 drop-shadow-md" fill="none">
            {/* Girl with pink dress */}
            <circle cx="45" cy="30" r="12" fill="#FDE68A" />
            {/* Hair brown */}
            <path d="M33 28 C33 18 57 18 57 28 C57 36 33 36 33 28 Z" fill="#92400E" />
            <circle cx="33" cy="30" r="4" fill="#92400E" />
            <circle cx="57" cy="30" r="4" fill="#92400E" />
            {/* Eyes & smile */}
            <circle cx="41" cy="30" r="1.5" fill="#1E1B4B" />
            <circle cx="49" cy="30" r="1.5" fill="#1E1B4B" />
            <path d="M43 34 Q45 37 47 34" stroke="#1E1B4B" strokeWidth="1.5" strokeLinecap="round" />
            {/* Pink Dress */}
            <polygon points="45,42 62,75 28,75" fill="#F472B6" />
            {/* Arms reaching */}
            <path d="M35 50 L20 62 M55 50 L70 60" stroke="#FDE68A" strokeWidth="4" strokeLinecap="round" />
            {/* Little block in hand */}
            <polygon points="70,55 76,55 73,62" fill="#38BDF8" />
            {/* Blocks tower */}
            <rect x="75" y="70" width="12" height="8" rx="1" fill="#FACC15" />
            <rect x="75" y="62" width="12" height="8" rx="1" fill="#38BDF8" />
            <rect x="78" y="54" width="6" height="8" rx="1" fill="#EF4444" />
          </svg>
        </div>

        {/* Center-Right: ABC Cartoon Alphabet Characters */}
        <div className="absolute bottom-1 sm:bottom-2 left-2/3 z-20 pointer-events-none transform -translate-x-1/2">
          <svg viewBox="0 0 120 70" className="w-24 h-20 sm:w-38 sm:h-42 md:w-42 md:h-46 drop-shadow-md" fill="none">
            {/* Smiling Blue 'A' */}
            <text x="20" y="55" fontFamily="'Outfit', sans-serif" fontWeight="900" fontSize="42" fill="#38BDF8" stroke="#1E1B4B" strokeWidth="2">A</text>
            <circle cx="16" cy="38" r="2" fill="#1E1B4B" />
            <circle cx="24" cy="38" r="2" fill="#1E1B4B" />
            
            {/* Smiling Pink 'B' */}
            <text x="50" y="55" fontFamily="'Outfit', sans-serif" fontWeight="900" fontSize="40" fill="#EC4899" stroke="#1E1B4B" strokeWidth="2">B</text>
            <circle cx="56" cy="32" r="1.5" fill="#1E1B4B" />
            <circle cx="56" cy="44" r="1.5" fill="#1E1B4B" />
            
            {/* Smiling Yellow 'C' */}
            <text x="80" y="55" fontFamily="'Outfit', sans-serif" fontWeight="900" fontSize="42" fill="#FACC15" stroke="#1E1B4B" strokeWidth="2">C</text>
            <circle cx="92" cy="30" r="2" fill="#1E1B4B" />
          </svg>
        </div>
      </div>
    </footer>
  );
};
