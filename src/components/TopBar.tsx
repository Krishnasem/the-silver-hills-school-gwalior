import React from 'react';
import { Phone, Mail, Instagram, Facebook, ShieldCheck } from 'lucide-react';

export const TopBar: React.FC<{ onLearnMoreClick?: () => void; onOpenAdmin?: () => void }> = ({
  onLearnMoreClick,
  onOpenAdmin,
}) => {
  return (
    <div className="bg-[#ED5B2D] text-white text-[11px] sm:text-xs md:text-sm font-medium py-1.5 sm:py-2 px-3 sm:px-6 md:px-8 relative z-30">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-x-3 gap-y-1 flex-wrap sm:flex-nowrap">
        {/* Left: Contact Info */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center gap-1 sm:gap-1.5 hover:opacity-90 transition-opacity py-0.5">
            <Phone className="w-3.5 h-3.5 fill-white shrink-0" />
            <a href="tel:8602456620" className="hover:underline whitespace-nowrap font-bold">
              <span>8602456620</span>
            </a>
            <span className="opacity-75 hidden xs:inline">,</span>
            <a href="tel:07512461474" className="hover:underline whitespace-nowrap hidden xs:inline font-bold">
              <span>0751-2461474</span>
            </a>
          </div>
          <span className="opacity-60 hidden sm:inline">/</span>
          <a
            href="mailto:info@thesilverhillsschools.com"
            className="hidden md:flex items-center gap-1 sm:gap-1.5 hover:opacity-90 transition-opacity truncate max-w-[200px] lg:max-w-none py-0.5"
            title="info@thesilverhillsschools.com"
          >
            <Mail className="w-3.5 h-3.5 fill-white text-[#ED5B2D] shrink-0" />
            <span className="truncate">info@thesilverhillsschools.com</span>
          </a>
        </div>

        {/* Center: Announcement */}
        <div className="hidden lg:flex items-center gap-1.5 text-white/95 text-xs">
          <span>A Safe, Joyful Place for Early Childhood TSHS –</span>
          <button
            onClick={onLearnMoreClick}
            className="font-bold underline hover:text-amber-200 transition-colors cursor-pointer"
          >
            Learn More
          </button>
        </div>

        {/* Right: Social Follow & Staff Portal */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto sm:ml-0 shrink-0">
          {onOpenAdmin && (
            <button
              type="button"
              onClick={onOpenAdmin}
              className="flex items-center gap-1 bg-black/20 hover:bg-black/35 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wide transition-all border border-white/25 cursor-pointer shadow-2xs text-amber-200 hover:text-white shrink-0 active:scale-95"
              title="Daily updates for Thought of Day and News & Events"
            >
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Staff Portal</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-white/90 hidden md:inline text-xs font-semibold">Follow On:</span>
            <div className="flex items-center gap-1.5">
              <a
                href="https://www.instagram.com/thesilverhills_school/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-7 h-7 sm:w-6 sm:h-6 rounded-full bg-[#1A44C2] hover:bg-[#1538a0] text-white flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61593871000346"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-7 h-7 sm:w-6 sm:h-6 rounded-full bg-[#1A44C2] hover:bg-[#1538a0] text-white flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
              >
                <Facebook className="w-3.5 h-3.5 fill-current" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
