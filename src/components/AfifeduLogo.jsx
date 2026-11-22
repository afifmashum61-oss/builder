import React from 'react';

export default function AfifeduLogo({ variant = 'white', showSubtext = true, className = '' }) {
  const isWhite = variant === 'white';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Stylized 'A' Logo Icon matching uploaded image */}
      <div className={`relative flex items-center justify-center shrink-0 w-10 h-10 rounded-xl ${
        isWhite 
          ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-950/40 text-white' 
          : 'bg-emerald-900 text-white shadow-md'
      }`}>
        {/* Custom stylized 'A' vector mark from afifedu logo */}
        <svg 
          viewBox="0 0 32 32" 
          className="w-6 h-6 fill-current" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main A legs */}
          <path 
            d="M 16 5 L 8.5 25 L 12.5 25 L 14.5 19.5 L 17.5 19.5 L 19.5 25 L 23.5 25 Z M 16 12 L 14.8 16.5 L 17.2 16.5 Z" 
            fill="currentColor"
          />
          {/* Dynamic crossing leaf / ribbon swoosh across the A */}
          <path 
            d="M 6 20 C 10 17, 18 15, 25 11 C 26 10.5, 25 13, 23 15 C 18 19, 11 21, 6 22 Z" 
            fill="#34D399" 
            opacity="0.95"
          />
        </svg>
      </div>

      {/* Logo Typography */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center">
          <span className={`text-2xl font-black tracking-tight ${isWhite ? 'text-white' : 'text-slate-900'}`}>
            afif
          </span>
          <span className={`text-2xl font-black tracking-tight ${isWhite ? 'text-emerald-400' : 'text-emerald-700'}`}>
            edu
          </span>
        </div>
        {showSubtext && (
          <span className={`text-[9px] font-bold tracking-widest uppercase mt-0.5 ${
            isWhite ? 'text-emerald-200/80' : 'text-slate-400'
          }`}>
            Portfolio & Katalog
          </span>
        )}
      </div>
    </div>
  );
}
