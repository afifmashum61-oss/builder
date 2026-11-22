import React, { useState, useEffect } from 'react';
import { ArrowUp, MessageCircle } from 'lucide-react';

export default function FloatingControls() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = windowHeight > 0 ? (totalScroll / windowHeight) * 100 : 0;
      
      setScrollProgress(scrollPercent);
      setShowScrollTop(totalScroll > 280);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 pointer-events-none">
        <div 
          className="h-full bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Action Buttons (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-3">
        
        {/* WhatsApp Fast Contact Pill */}
        <a
          href="https://wa.me/6285815455474?text=Halo%20afifedu,%20saya%20ingin%20konsultasi%20website"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Konsultasi WhatsApp"
          className="group flex items-center gap-2 p-3 sm:px-4 sm:py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-950/20 hover:shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <MessageCircle className="w-5 h-5 fill-white stroke-emerald-600" />
          <span className="hidden sm:inline-block text-xs font-bold tracking-wide">
            Konsultasi
          </span>
        </a>

        {/* Scroll to Top with Smooth Circular Progress */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            aria-label="Kembali ke atas"
            className="w-11 h-11 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white shadow-xl border border-white/20 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 backdrop-blur-md group animate-fade-in-up"
          >
            <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        )}

      </div>
    </>
  );
}
