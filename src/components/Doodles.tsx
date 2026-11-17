import React from 'react';

// Lightning / Flash doodle in hero top-left
export const LightningDoodle: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Black sketchy outline rays */}
    <path d="M15 25 L5 15 M50 15 L50 2 M85 25 L95 15 M88 60 L98 65 M12 60 L2 65 M50 92 L50 98" stroke="#1E1B4B" strokeWidth="4" strokeLinecap="round" />
    {/* Yellow lightning bolt */}
    <polygon points="50,10 20,55 48,55 35,90 80,42 52,42" fill="#FACC15" stroke="#1E1B4B" strokeWidth="4.5" strokeLinejoin="round" />
    <path d="M35 30 L45 30 M30 40 L40 40" stroke="#EAB308" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// Pencil doodle with eraser in hero top-right
export const PencilDoodle: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="rotate(35 50 50)">
      {/* Eraser */}
      <rect x="38" y="10" width="24" height="16" rx="4" fill="#F472B6" stroke="#1E1B4B" strokeWidth="4" />
      {/* Metal band */}
      <rect x="38" y="24" width="24" height="6" fill="#CBD5E1" stroke="#1E1B4B" strokeWidth="3" />
      {/* Wooden Body */}
      <rect x="38" y="30" width="24" height="40" fill="#FACC15" stroke="#1E1B4B" strokeWidth="4" />
      <line x1="46" y1="30" x2="46" y2="70" stroke="#EAB308" strokeWidth="3" />
      <line x1="54" y1="30" x2="54" y2="70" stroke="#EAB308" strokeWidth="3" />
      {/* Tip */}
      <polygon points="38,70 62,70 50,92" fill="#FED7AA" stroke="#1E1B4B" strokeWidth="4" strokeLinejoin="round" />
      {/* Graphite */}
      <polygon points="46,84 54,84 50,92" fill="#1E1B4B" />
    </g>
  </svg>
);

// Yellow Concentric Rings behind Hero Boy
export const YellowRingsDoodle: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg viewBox="0 0 300 300" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="150" cy="150" r="130" stroke="#FACC15" strokeWidth="16" opacity="0.95" />
    <circle cx="150" cy="150" r="95" stroke="#FACC15" strokeWidth="16" opacity="0.95" />
    <circle cx="150" cy="150" r="60" stroke="#FACC15" strokeWidth="16" opacity="0.95" />
  </svg>
);

// Lightbulb doodle with rays
export const LightbulbDoodle: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Rays */}
    <path d="M20 30 L10 20 M50 15 L50 4 M80 30 L90 20 M85 55 L96 55 M15 55 L4 55" stroke="#1E1B4B" strokeWidth="3.5" strokeLinecap="round" />
    {/* Bulb body */}
    <path d="M30 45 C30 30 40 22 50 22 C60 22 70 30 70 45 C70 55 62 62 60 68 L40 68 C38 62 30 55 30 45 Z" fill="#FEF08A" stroke="#1E1B4B" strokeWidth="4" />
    {/* Base */}
    <rect x="42" y="68" width="16" height="5" rx="1" fill="#CBD5E1" stroke="#1E1B4B" strokeWidth="3" />
    <rect x="44" y="73" width="12" height="4" rx="1" fill="#CBD5E1" stroke="#1E1B4B" strokeWidth="2.5" />
    <path d="M46 78 C46 82 54 82 54 78 Z" fill="#1E1B4B" />
    {/* Inner filament */}
    <path d="M45 48 Q50 40 55 48" stroke="#EAB308" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// Cartoon Red Car in Hero
export const CartoonCarDoodle: React.FC<{ className?: string }> = ({ className = "w-16 h-12" }) => (
  <svg viewBox="0 0 120 90" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Car body */}
    <path d="M15 55 Q15 45 25 45 L35 45 L45 25 Q50 20 60 20 L80 20 Q90 20 95 32 L105 45 L110 45 Q115 45 115 55 L115 65 Q115 70 110 70 L10 70 Q5 70 5 65 Z" fill="#EF4444" stroke="#1E1B4B" strokeWidth="4" />
    {/* Roof & Windows */}
    <path d="M48 26 L78 26 Q85 26 88 35 L94 45 L42 45 Z" fill="#93C5FD" stroke="#1E1B4B" strokeWidth="3.5" />
    <line x1="68" y1="26" x2="68" y2="45" stroke="#1E1B4B" strokeWidth="3" />
    {/* Yellow Headlight */}
    <path d="M108 50 Q114 50 114 56 Q114 62 108 62 Z" fill="#FACC15" stroke="#1E1B4B" strokeWidth="2" />
    {/* Wheels */}
    <circle cx="32" cy="70" r="14" fill="#334155" stroke="#1E1B4B" strokeWidth="4" />
    <circle cx="32" cy="70" r="6" fill="#FACC15" stroke="#1E1B4B" strokeWidth="2" />
    <circle cx="92" cy="70" r="14" fill="#334155" stroke="#1E1B4B" strokeWidth="4" />
    <circle cx="92" cy="70" r="6" fill="#FACC15" stroke="#1E1B4B" strokeWidth="2" />
  </svg>
);

// Stacking Rings Pyramid Toy
export const StackingToyDoodle: React.FC<{ className?: string }> = ({ className = "w-16 h-20" }) => (
  <svg viewBox="0 0 100 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Top Topper Ball */}
    <circle cx="50" cy="18" r="10" fill="#38BDF8" stroke="#1E1B4B" strokeWidth="3.5" />
    {/* Ring 1 - Purple/Pink */}
    <path d="M38 32 C38 28 62 28 62 32 C62 38 38 38 38 32 Z" fill="#A855F7" stroke="#1E1B4B" strokeWidth="3" />
    {/* Ring 2 - Green */}
    <path d="M32 46 C32 40 68 40 68 46 C68 53 32 53 32 46 Z" fill="#4ADE80" stroke="#1E1B4B" strokeWidth="3.5" />
    {/* Ring 3 - Teal */}
    <path d="M26 62 C26 55 74 55 74 62 C74 70 26 70 26 62 Z" fill="#2DD4BF" stroke="#1E1B4B" strokeWidth="3.5" />
    {/* Ring 4 - Orange/Pink */}
    <path d="M18 80 C18 72 82 72 82 80 C82 89 18 89 18 80 Z" fill="#FB7185" stroke="#1E1B4B" strokeWidth="4" />
    {/* Base - Yellow */}
    <path d="M10 98 C10 90 90 90 90 98 C90 108 10 108 10 98 Z" fill="#FACC15" stroke="#1E1B4B" strokeWidth="4" />
    {/* Cute Face on base */}
    <circle cx="42" cy="98" r="2" fill="#1E1B4B" />
    <circle cx="58" cy="98" r="2" fill="#1E1B4B" />
    <path d="M48 102 Q50 105 52 102" stroke="#1E1B4B" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Flying Kite with colorful ribbons
export const KiteDoodle: React.FC<{ className?: string }> = ({ className = "w-16 h-20" }) => (
  <svg viewBox="0 0 120 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Kite diamond segments */}
    <polygon points="50,10 85,45 50,90 15,45" fill="#38BDF8" stroke="#1E1B4B" strokeWidth="4" />
    <polygon points="50,10 85,45 50,45" fill="#EF4444" />
    <polygon points="15,45 50,45 50,90" fill="#FACC15" />
    <polygon points="50,45 85,45 50,90" fill="#4ADE80" />
    {/* Kite cross lines */}
    <line x1="50" y1="10" x2="50" y2="90" stroke="#1E1B4B" strokeWidth="3" />
    <line x1="15" y1="45" x2="85" y2="45" stroke="#1E1B4B" strokeWidth="3" />
    {/* Cute Eyes on Kite */}
    <path d="M35 40 Q38 35 41 40" stroke="#1E1B4B" strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M59 40 Q62 35 65 40" stroke="#1E1B4B" strokeWidth="3" strokeLinecap="round" fill="none" />
    {/* Tail string */}
    <path d="M50 90 Q30 110 55 125 T40 155" stroke="#1E1B4B" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    {/* Tail Ribbons/Bows */}
    <ellipse cx="40" cy="110" rx="7" ry="4" fill="#EC4899" stroke="#1E1B4B" strokeWidth="2" transform="rotate(-20 40 110)" />
    <ellipse cx="55" cy="128" rx="7" ry="4" fill="#FACC15" stroke="#1E1B4B" strokeWidth="2" transform="rotate(30 55 128)" />
    <ellipse cx="42" cy="148" rx="7" ry="4" fill="#38BDF8" stroke="#1E1B4B" strokeWidth="2" transform="rotate(-15 42 148)" />
  </svg>
);

// Rainbow with Smiling Clouds
export const RainbowCloudDoodle: React.FC<{ className?: string }> = ({ className = "w-24 h-20" }) => (
  <svg viewBox="0 0 140 110" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Rainbow Arcs */}
    <path d="M25 80 A45 45 0 0 1 115 80" stroke="#EF4444" strokeWidth="8" fill="none" strokeLinecap="round" />
    <path d="M33 80 A37 37 0 0 1 107 80" stroke="#F59E0B" strokeWidth="8" fill="none" strokeLinecap="round" />
    <path d="M41 80 A29 29 0 0 1 99 80" stroke="#10B981" strokeWidth="8" fill="none" strokeLinecap="round" />
    <path d="M49 80 A21 21 0 0 1 91 80" stroke="#3B82F6" strokeWidth="8" fill="none" strokeLinecap="round" />
    <path d="M57 80 A13 13 0 0 1 83 80" stroke="#8B5CF6" strokeWidth="8" fill="none" strokeLinecap="round" />
    
    {/* Left Cloud */}
    <g>
      <path d="M15 85 Q10 75 20 70 Q25 60 40 65 Q50 60 55 70 Q65 75 60 85 Q65 95 50 95 L20 95 Q10 95 15 85 Z" fill="#FFFFFF" stroke="#1E1B4B" strokeWidth="3.5" />
      {/* Eyes & smile */}
      <circle cx="30" cy="80" r="2.5" fill="#1E1B4B" />
      <circle cx="45" cy="80" r="2.5" fill="#1E1B4B" />
      <path d="M35 85 Q37.5 88 40 85" stroke="#1E1B4B" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="26" cy="83" r="2" fill="#F472B6" />
      <circle cx="49" cy="83" r="2" fill="#F472B6" />
    </g>
  </svg>
);

// ABC Alphabet Blocks Doodle
export const AbcBlocksDoodle: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => (
  <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Block A (Red) */}
    <rect x="15" y="55" width="40" height="40" rx="8" fill="#EF4444" stroke="#1E1B4B" strokeWidth="4" />
    <text x="35" y="84" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="900" fontSize="26" fill="#FFFFFF" textAnchor="middle">A</text>
    
    {/* Block B (Yellow/Orange) */}
    <rect x="60" y="55" width="40" height="40" rx="8" fill="#F59E0B" stroke="#1E1B4B" strokeWidth="4" />
    <text x="80" y="84" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="900" fontSize="26" fill="#FFFFFF" textAnchor="middle">B</text>
    
    {/* Block C (Green) on top */}
    <rect x="38" y="15" width="40" height="40" rx="8" fill="#10B981" stroke="#1E1B4B" strokeWidth="4" />
    <text x="58" y="44" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="900" fontSize="26" fill="#FFFFFF" textAnchor="middle">C</text>
  </svg>
);

// Hot Air Balloon Doodle
export const HotAirBalloonDoodle: React.FC<{ className?: string }> = ({ className = "w-20 h-28" }) => (
  <svg viewBox="0 0 120 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Balloon Main Shape */}
    <path d="M20 50 C20 15 100 15 100 50 C100 78 75 95 68 105 L52 105 C45 95 20 78 20 50 Z" fill="#FACC15" stroke="#1E1B4B" strokeWidth="4" />
    {/* Colored Stripes */}
    <path d="M40 22 C32 35 32 68 45 105" stroke="#EF4444" strokeWidth="8" fill="none" />
    <path d="M80 22 C88 35 88 68 75 105" stroke="#EF4444" strokeWidth="8" fill="none" />
    <path d="M50 16 C48 35 48 75 55 105" stroke="#38BDF8" strokeWidth="6" fill="none" />
    <path d="M70 16 C72 35 72 75 65 105" stroke="#38BDF8" strokeWidth="6" fill="none" />
    {/* Scallop lower band */}
    <path d="M28 85 Q38 95 48 85 Q58 95 68 85 Q78 95 88 85 L92 88 L26 88 Z" fill="#EF4444" stroke="#1E1B4B" strokeWidth="3" />
    {/* Ropes */}
    <line x1="53" y1="105" x2="48" y2="122" stroke="#1E1B4B" strokeWidth="3" />
    <line x1="67" y1="105" x2="72" y2="122" stroke="#1E1B4B" strokeWidth="3" />
    {/* Basket */}
    <rect x="46" y="122" width="28" height="20" rx="4" fill="#F59E0B" stroke="#1E1B4B" strokeWidth="3.5" />
    <line x1="53" y1="122" x2="53" y2="142" stroke="#B45309" strokeWidth="2" />
    <line x1="60" y1="122" x2="60" y2="142" stroke="#B45309" strokeWidth="2" />
    <line x1="67" y1="122" x2="67" y2="142" stroke="#B45309" strokeWidth="2" />
  </svg>
);

// Cute Teddy Bear Doodle
export const TeddyBearDoodle: React.FC<{ className?: string }> = ({ className = "w-24 h-24" }) => (
  <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Left Ear */}
    <circle cx="35" cy="35" r="14" fill="#FDBA74" stroke="#1E1B4B" strokeWidth="3.5" />
    <circle cx="35" cy="35" r="7" fill="#FED7AA" />
    {/* Right Ear */}
    <circle cx="85" cy="35" r="14" fill="#FDBA74" stroke="#1E1B4B" strokeWidth="3.5" />
    <circle cx="85" cy="35" r="7" fill="#FED7AA" />
    {/* Head */}
    <circle cx="60" cy="58" r="32" fill="#FB923C" stroke="#1E1B4B" strokeWidth="4" />
    {/* Eyes */}
    <circle cx="48" cy="52" r="4" fill="#1E1B4B" />
    <circle cx="72" cy="52" r="4" fill="#1E1B4B" />
    {/* Snout Muzzle */}
    <ellipse cx="60" cy="65" rx="14" ry="10" fill="#FED7AA" stroke="#1E1B4B" strokeWidth="2.5" />
    <ellipse cx="60" cy="61" rx="5" ry="3.5" fill="#1E1B4B" />
    <path d="M60 64.5 L60 70 M56 68 Q60 72 64 68" stroke="#1E1B4B" strokeWidth="2.5" strokeLinecap="round" />
    {/* Cute Yellow Bowtie */}
    <polygon points="50,88 70,88 60,82" fill="#FACC15" stroke="#1E1B4B" strokeWidth="2.5" />
    <polygon points="50,82 70,82 60,88" fill="#FACC15" stroke="#1E1B4B" strokeWidth="2.5" />
    <circle cx="60" cy="85" r="4" fill="#EF4444" stroke="#1E1B4B" strokeWidth="2" />
  </svg>
);

// Paper Airplane with Dotted Trail
export const PaperPlaneDoodle: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 85 Q20 50 40 60 T70 30" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="4 4" fill="none" strokeLinecap="round" />
    <polygon points="75,25 95,15 85,38 78,32 75,37" fill="#FFFFFF" />
  </svg>
);

// Open Book Doodle for Blog
export const BookDoodle: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 100 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="rotate(-10 50 40)">
      {/* Book Cover Orange */}
      <path d="M10 20 Q50 30 50 70 Q10 60 10 20 Z" fill="#F97316" stroke="#1E1B4B" strokeWidth="3.5" />
      <path d="M90 20 Q50 30 50 70 Q90 60 90 20 Z" fill="#F97316" stroke="#1E1B4B" strokeWidth="3.5" />
      {/* Pages Yellow/White */}
      <path d="M15 22 Q48 30 48 66 Q15 58 15 22 Z" fill="#FEF08A" stroke="#1E1B4B" strokeWidth="2.5" />
      <path d="M85 22 Q52 30 52 66 Q85 58 85 22 Z" fill="#FEF08A" stroke="#1E1B4B" strokeWidth="2.5" />
      {/* Lines on pages */}
      <line x1="22" y1="34" x2="42" y2="38" stroke="#CA8A04" strokeWidth="2" strokeLinecap="round" />
      <line x1="22" y1="44" x2="42" y2="48" stroke="#CA8A04" strokeWidth="2" strokeLinecap="round" />
      <line x1="58" y1="38" x2="78" y2="34" stroke="#CA8A04" strokeWidth="2" strokeLinecap="round" />
      <line x1="58" y1="48" x2="78" y2="44" stroke="#CA8A04" strokeWidth="2" strokeLinecap="round" />
    </g>
  </svg>
);

// Paint Palette & Rainbow for Newsletter
export const PaletteDoodle: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => (
  <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Rainbow arch */}
    <path d="M10 75 A50 50 0 0 1 110 75" stroke="#1E1B4B" strokeWidth="8" fill="none" strokeLinecap="round" />
    <path d="M16 75 A44 44 0 0 1 104 75" stroke="#EF4444" strokeWidth="6" fill="none" />
    <path d="M22 75 A38 38 0 0 1 98 75" stroke="#F59E0B" strokeWidth="6" fill="none" />
    <path d="M28 75 A32 32 0 0 1 92 75" stroke="#3B82F6" strokeWidth="6" fill="none" />
    
    {/* Palette */}
    <path d="M35 75 C35 55 55 45 75 52 C90 58 92 75 80 88 C70 98 48 95 38 85 C35 82 35 78 35 75 Z" fill="#FDE047" stroke="#1E1B4B" strokeWidth="4" />
    {/* Paint blobs */}
    <circle cx="50" cy="62" r="4" fill="#EF4444" />
    <circle cx="65" cy="58" r="4" fill="#3B82F6" />
    <circle cx="78" cy="70" r="4" fill="#10B981" />
    <circle cx="68" cy="82" r="4" fill="#8B5CF6" />
    {/* Brush */}
    <path d="M75 90 L100 105" stroke="#6366F1" strokeWidth="6" strokeLinecap="round" />
  </svg>
);

// Wavy Scallop Divider (Used between sections like hero, class cards, footer)
export const WavyScallopDivider: React.FC<{
  fillColor?: string;
  inverted?: boolean;
  className?: string;
}> = ({ fillColor = "#FFFFFF", inverted = false, className = "w-full h-12 md:h-16" }) => {
  return (
    <div className={`overflow-hidden leading-none select-none ${className}`}>
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className={`w-full h-full ${inverted ? 'rotate-180' : ''}`}
      >
        <path
          d="M0,0 C150,90 350,-40 500,50 C650,140 900,-30 1200,40 L1200,120 L0,120 Z"
          fill={fillColor}
        />
      </svg>
    </div>
  );
};

// Fluffy Cloud Border Divider
export const FluffyCloudDivider: React.FC<{
  cloudColor?: string;
  className?: string;
  inverted?: boolean;
}> = ({ cloudColor = "#FFFFFF", className = "w-full h-10 md:h-14", inverted = false }) => {
  return (
    <div className={`overflow-hidden leading-none select-none ${className}`}>
      <svg
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
        className={`w-full h-full ${inverted ? 'rotate-180' : ''}`}
      >
        <path
          d="M0,60 C30,30 60,30 90,60 C120,20 170,20 200,60 C230,25 280,25 310,60 C340,15 400,15 430,60 C460,30 500,30 530,60 C560,10 630,10 660,60 C690,25 740,25 770,60 C800,15 860,15 890,60 C920,30 960,30 990,60 C1020,10 1090,10 1120,60 C1150,25 1180,25 1200,60 L1200,60 L0,60 Z"
          fill={cloudColor}
        />
      </svg>
    </div>
  );
};
