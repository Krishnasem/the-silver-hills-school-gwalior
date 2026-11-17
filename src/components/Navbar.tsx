import React, { useState } from 'react';
import { ChevronDown, Search, ArrowRight, Menu, X } from 'lucide-react';
import { NavItem } from '../types';
import schoolLogo from '../assets/images/logo3.png';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenAdmission: () => void;
  onNavigateHome?: () => void;
  onNavigateGallery?: () => void;
  onNavigateAcademics?: (subTab?: 'syllabus' | 'timetable' | 'results') => void;
  onNavigateFacilities?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  onOpenAdmission,
  onNavigateHome,
  onNavigateGallery,
  onNavigateAcademics,
  onNavigateFacilities,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navItems: NavItem[] = [
    { name: 'Home', href: '#' },
    { name: 'About', href: '#about' },
    {
      name: 'Academics',
      href: '#academics',
      hasDropdown: true,
      dropdownItems: [
        { name: 'Syllabus', href: '#syllabus' },
        { name: 'Exam Time-Table', href: '#timetable' },
        { name: 'Exam result', href: '#results' },
      ],
    },
    { name: 'Facilities', href: '#facilities' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact Us', href: '#contact' },
  ];

  const handleLogoClick = (e: React.MouseEvent) => {
    if (onNavigateHome) {
      e.preventDefault();
      onNavigateHome();
    }
  };

  const handleSubItemClick = (e: React.MouseEvent, subName: string) => {
    e.preventDefault();
    setActiveDropdown(null);
    if (!onNavigateAcademics) return;

    if (subName.toLowerCase().includes('syllabus')) {
      onNavigateAcademics('syllabus');
    } else if (subName.toLowerCase().includes('table') || subName.toLowerCase().includes('time')) {
      onNavigateAcademics('timetable');
    } else if (subName.toLowerCase().includes('result')) {
      onNavigateAcademics('results');
    } else {
      onNavigateAcademics('syllabus');
    }
  };

  const handleNavClick = (e: React.MouseEvent, item: NavItem) => {
    if (item.name === 'Home' && onNavigateHome) {
      e.preventDefault();
      onNavigateHome();
    } else if (item.name === 'Academics' && onNavigateAcademics) {
      e.preventDefault();
      onNavigateAcademics('syllabus');
    } else if (item.name === 'Facilities' && onNavigateFacilities) {
      e.preventDefault();
      onNavigateFacilities();
    } else if (item.name === 'Gallery' && onNavigateGallery) {
      e.preventDefault();
      onNavigateGallery();
    } else if (item.name === 'About' && onNavigateHome) {
      onNavigateHome();
      setTimeout(() => {
        const el = document.getElementById('about');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else if (item.name === 'Contact Us' && onNavigateHome) {
      onNavigateHome();
      setTimeout(() => {
        const el = document.getElementById('contact');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  return (
    <nav className="min-h-[72px] sm:min-h-[84px] lg:h-[105px] bg-[#6355EE] text-white sticky top-0 z-[80] shadow-lg shadow-indigo-950/10">
      <div className="min-h-[72px] sm:min-h-[84px] lg:h-[107px] max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-1.5 sm:py-2.5 flex items-center justify-between gap-2">
        {/* Brand Logo - Scales fluidly without causing overflow on narrow 320px screens */}
        <a
          href="#"
          onClick={handleLogoClick}
          className="flex items-center group select-none py-0.5 shrink-0"
        >
          <img
            src={schoolLogo}
            alt="The Silver Hills School"
            className="-ml-1 sm:-ml-2 lg:-ml-[34px] h-9 xs:h-11 sm:h-14 md:h-18 lg:h-[84px] xl:h-[93px] w-auto max-w-[190px] xs:max-w-[230px] sm:max-w-[270px] md:max-w-[310px] object-contain drop-shadow-sm transition-all"
            referrerPolicy="no-referrer"
          />
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden xl:flex items-center gap-7 text-sm font-semibold text-white/95">
          {navItems.map((item) => (
            <div
              key={item.name}
              className="relative group py-2"
              onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <a
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className="flex items-center gap-1 hover:text-amber-300 transition-colors spotlight-text-white py-1"
              >
                <span>{item.name}</span>
                {item.hasDropdown && (
                  <ChevronDown className="w-4 h-4 text-white/80 group-hover:rotate-180 transition-transform duration-200" />
                )}
              </a>

              {/* Dropdown Menu */}
              {item.hasDropdown && activeDropdown === item.name && (
                <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-2xl shadow-xl border border-purple-100 py-2 text-slate-700 z-50 animate-fade-in">
                  {item.dropdownItems?.map((sub, idx) => (
                    <a
                      key={idx}
                      href={sub.href}
                      onClick={(e) => handleSubItemClick(e, sub.name)}
                      className="block px-4 py-2.5 text-xs font-semibold hover:bg-purple-50 hover:text-[#6355EE] transition-colors"
                    >
                      {sub.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right CTA Area */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* START LEARNING Pill Button (Desktop / Tablet) */}
          <button
            onClick={onOpenAdmission}
            className="hidden sm:flex items-center gap-2 sm:gap-3 pl-4 sm:pl-5 pr-1.5 sm:pr-2 py-1.5 sm:py-2 bg-[#ED5B2D] hover:bg-[#d94a1d] text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider rounded-full shadow-lg shadow-orange-950/20 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer group"
          >
            <span>START LEARNING</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-slate-900 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-900 stroke-[2.5]" />
            </div>
          </button>

          {/* Mobile Burger Toggle with 44px min touch target */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="xl:hidden w-11 h-11 rounded-xl bg-white/15 hover:bg-white/25 active:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu & Backdrop */}
      {mobileMenuOpen && (
        <>
          {/* Dark Backdrop */}
          <div
            className="fixed inset-0 top-[72px] sm:top-[84px] bg-slate-950/60 z-40 xl:hidden animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Container */}
          <div className="fixed inset-x-0 top-[72px] sm:top-[84px] z-50 xl:hidden max-h-[calc(100vh-72px)] sm:max-h-[calc(100vh-84px)] overflow-y-auto bg-[#5345dd] border-t border-white/10 px-5 sm:px-6 py-5 text-white space-y-2 shadow-2xl animate-in slide-in-from-top-2 duration-200">
            {navItems.map((item) => (
              <div key={item.name} className="py-0.5 border-b border-white/10 last:border-b-0">
                <div className="flex items-center justify-between">
                  <a
                    href={item.href}
                    onClick={(e) => {
                      if (!item.hasDropdown) {
                        setMobileMenuOpen(false);
                        handleNavClick(e, item);
                      } else {
                        e.preventDefault();
                        setActiveDropdown(activeDropdown === item.name ? null : item.name);
                      }
                    }}
                    className="flex-1 text-base font-semibold hover:text-amber-300 py-3 flex items-center justify-between"
                  >
                    <span>{item.name}</span>
                    {item.hasDropdown && (
                      <ChevronDown
                        className={`w-4 h-4 text-white/70 transition-transform duration-200 ${
                          activeDropdown === item.name ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </a>
                </div>
                {item.dropdownItems && (activeDropdown === item.name || true) && (
                  <div className="pl-4 pb-2 space-y-1 border-l-2 border-white/25 ml-2 my-1">
                    {item.dropdownItems.map((sub, i) => (
                      <a
                        key={i}
                        href={sub.href}
                        onClick={(e) => {
                          setMobileMenuOpen(false);
                          handleSubItemClick(e, sub.name);
                        }}
                        className="block text-sm text-white/85 hover:text-white py-2 font-medium transition-colors"
                      >
                        • {sub.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="pt-3 pb-4">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmission();
                }}
                className="w-full min-h-[48px] flex items-center justify-center gap-3 py-3.5 bg-[#ED5B2D] active:bg-[#c84116] text-white font-bold text-sm uppercase rounded-full shadow-lg cursor-pointer"
              >
                <span>START LEARNING</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};
