import React from 'react';

export default function AfifeduLogo({ variant = 'white', showSubtext = true, className = '' }) {
  const isWhite = variant === 'white';
  const logoSrc = isWhite ? '/images/afifedu-logo-light.png' : '/images/afifedu-logo.png';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="flex flex-col">
        <img 
          src={logoSrc} 
          alt="afifedu" 
          className="h-9 sm:h-10 md:h-11 w-auto object-contain transition-transform hover:scale-105 duration-200"
          onError={(e) => {
            e.currentTarget.src = '/images/afifedu-logo.png';
          }}
        />
        {showSubtext && (
          <span className={`text-[8.5px] sm:text-[9px] font-bold tracking-[0.22em] uppercase pl-1 -mt-0.5 ${
            isWhite ? 'text-emerald-200/80' : 'text-slate-500'
          }`}>
            Portfolio & Katalog
          </span>
        )}
      </div>
    </div>
  );
}
