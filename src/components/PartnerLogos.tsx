import React from 'react';

export const PartnerLogos: React.FC = () => {
  return (
    <section className="py-6 sm:py-8 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-8 relative z-30">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-6 items-center">
          {/* 1. Inflatables */}
          <div className="bg-[#FFF3EC] border border-orange-100 rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center text-center h-24 sm:h-28 hover:scale-105 transition-transform">
            <div className="w-10 h-10 mb-1 flex items-center justify-center text-orange-500">
              <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
                <rect x="12" y="24" width="40" height="32" rx="4" fill="#60A5FA" />
                <polygon points="12,24 20,8 28,24" fill="#F87171" />
                <polygon points="36,24 44,8 52,24" fill="#F87171" />
                <rect x="26" y="38" width="12" height="18" rx="2" fill="#FDE047" />
              </svg>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-800">Inflatables</span>
            <span className="text-[8px] text-slate-500 font-bold">KIDS TOYS</span>
          </div>

          {/* 2. Kids Toys */}
          <div className="bg-[#FFF3EC] border border-orange-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center h-28 hover:scale-105 transition-transform">
            <div className="w-10 h-10 mb-1 flex items-center justify-center">
              <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
                <circle cx="24" cy="22" r="8" fill="#FCD34D" />
                <circle cx="40" cy="22" r="8" fill="#F472B6" />
                <rect x="22" y="34" width="20" height="18" rx="3" fill="#60A5FA" />
              </svg>
            </div>
            <span className="text-[10px] font-black text-indigo-900 uppercase">Kids Toys</span>
          </div>

          {/* 3. Kids Fun */}
          <div className="bg-[#FFF3EC] border border-orange-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center h-28 hover:scale-105 transition-transform">
            <div className="w-10 h-10 mb-1 flex items-center justify-center">
              <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
                <polygon points="20,16 26,10 32,16 38,10 44,16 40,24 24,24" fill="#FACC15" />
                <circle cx="32" cy="32" r="10" fill="#F87171" />
              </svg>
            </div>
            <span className="text-[10px] font-black text-emerald-600 uppercase">Kids Fun</span>
          </div>

          {/* 4. My School */}
          <div className="bg-[#FFF3EC] border border-orange-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center h-28 hover:scale-105 transition-transform">
            <div className="w-10 h-10 mb-1 flex items-center justify-center">
              <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
                <path d="M20 20 A16 16 0 0 1 44 20" stroke="#F43F5E" strokeWidth="3" />
                <path d="M24 20 A12 12 0 0 1 40 20" stroke="#FBBF24" strokeWidth="3" />
                <polygon points="32,24 44,34 20,34" fill="#3B82F6" />
                <rect x="24" y="34" width="16" height="12" fill="#EC4899" />
              </svg>
            </div>
            <span className="text-[10px] font-black text-teal-600 uppercase">My School</span>
            <span className="text-[7px] text-slate-400 font-bold">Study at Home</span>
          </div>
        </div>
      </div>
    </section>
  );
};
