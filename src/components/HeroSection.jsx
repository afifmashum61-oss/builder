import React from 'react';
import { 
  ShoppingCart, 
  Play, 
  Sparkles, 
  ArrowRight
} from 'lucide-react';

export default function HeroSection({ onExploreClick }) {
  return (
    <section id="beranda" className="relative bg-gradient-to-b from-[#0A342B] via-[#0B3E33] to-[#082C24] text-white pt-6 sm:pt-10 pb-20 sm:pb-28 md:pb-36 overflow-hidden">
      {/* Background Decorative Mesh & Dots */}
      <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none"></div>
      <div className="absolute top-1/4 -left-32 w-72 sm:w-96 h-72 sm:h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-0 w-80 sm:w-[500px] h-80 sm:h-[500px] bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Left Column: Headline & Action */}
          <div className="lg:col-span-7 space-y-6 pt-2 sm:pt-6 text-center lg:text-left">

            {/* Main Title - Fluid typography */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.18] sm:leading-[1.15]">
              Website Profesional <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400">
                untuk Masa Depan
              </span> <br />
              Bisnis Anda
            </h1>

            {/* Subtitle */}
            <p className="text-slate-200 text-sm sm:text-base lg:text-lg max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed opacity-90">
              Tingkatkan kredibilitas, perluas jangkauan, dan kembangkan bisnis Anda dengan website modern, cepat, dan mudah dikelola.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-1 sm:pt-2">
              <a
                href="https://wa.me/6285815455474?text=Halo%20afifedu,%20saya%20mau%20konsultasi%20pembuatan%20website"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-sm sm:text-base shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
              >
                <ShoppingCart className="w-4 h-4 stroke-[2.5]" />
                <span>Beli Sekarang</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </a>

              <button
                onClick={onExploreClick}
                className="inline-flex items-center gap-2.5 px-5 sm:px-7 py-3.5 sm:py-4 rounded-full bg-emerald-950/70 hover:bg-emerald-900/90 border border-emerald-400/40 text-white font-semibold text-sm sm:text-base hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-md group"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30">
                  <Play className="w-3.5 h-3.5 text-emerald-300 fill-emerald-300 ml-0.5" />
                </div>
                <span>Lihat Demo</span>
              </button>
            </div>

            {/* Social Proof with Avatar Stack */}
            <div className="pt-4 sm:pt-6 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <div className="flex -space-x-3">
                <img 
                  className="w-9 sm:w-10 h-9 sm:h-10 rounded-full border-2 border-emerald-800 object-cover ring-2 ring-emerald-900" 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                  alt="Pelanggan afifedu" 
                />
                <img 
                  className="w-9 sm:w-10 h-9 sm:h-10 rounded-full border-2 border-emerald-800 object-cover ring-2 ring-emerald-900" 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" 
                  alt="Pelanggan afifedu" 
                />
                <img 
                  className="w-9 sm:w-10 h-9 sm:h-10 rounded-full border-2 border-emerald-800 object-cover ring-2 ring-emerald-900" 
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80" 
                  alt="Pelanggan afifedu" 
                />
                <img 
                  className="w-9 sm:w-10 h-9 sm:h-10 rounded-full border-2 border-emerald-800 object-cover ring-2 ring-emerald-900" 
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" 
                  alt="Pelanggan afifedu" 
                />
              </div>

              <div className="text-center sm:text-left text-xs sm:text-sm">
                <span className="font-bold text-white block">+1.000 Pelanggan Puas</span>
                <span className="text-emerald-200/80">Telah mempercayai afifedu</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual with Seamless Cutout Model */}
          <div className="lg:col-span-5 relative flex justify-center items-end min-h-[380px] sm:min-h-[460px] lg:min-h-[540px] mt-4 lg:mt-0">
            
            {/* Circular halo / spotlight behind person */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full bg-gradient-to-b from-emerald-600/25 via-emerald-800/30 to-emerald-950/40 border border-emerald-400/20 pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/20 via-transparent to-transparent rounded-full blur-3xl pointer-events-none"></div>

            {/* Decorative Stars / Sparkles */}
            <div className="absolute top-10 left-4 sm:left-6 text-amber-300 text-xl sm:text-2xl select-none animate-pulse pointer-events-none">
              ✦
            </div>
            <div className="absolute top-24 right-4 text-amber-300 text-lg sm:text-xl select-none animate-pulse pointer-events-none [animation-delay:1s]">
              ✦
            </div>

            {/* Handwritten note annotation */}
            <div className="absolute top-2 sm:top-6 right-0 sm:-right-4 z-30 text-right">
              <div className="flex items-center justify-end gap-1 text-amber-300 mb-0.5">
                <Sparkles className="w-4 h-4 fill-amber-300 animate-spin [animation-duration:8s]" />
              </div>
              <p className="font-handwriting text-xl sm:text-2xl lg:text-3xl text-emerald-100 rotate-2 leading-none drop-shadow-md">
                Website Lebih Mudah, <br />
                <span className="text-amber-300 font-bold">Bisnis Lebih Maju!</span>
              </p>
            </div>

            {/* Main Hero Person - Flexible responsive cutout */}
            <div className="relative z-20 flex justify-center items-end w-full">
              <img 
                src="/images/hero-person.png" 
                alt="afifedu Founder & Web Expert"
                loading="eager"
                className="w-auto h-[340px] sm:h-[440px] lg:h-[510px] max-w-full object-contain object-bottom drop-shadow-[0_20px_35px_rgba(0,0,0,0.45)] hover:scale-[1.02] transition-transform duration-500"
              />
            </div>

          </div>

        </div>
      </div>

      {/* Organic Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none pointer-events-none">
        <svg 
          className="relative block w-full h-10 sm:h-16 md:h-20 text-[#F8FAF9]" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M0,0 C150,90 350,-40 500,60 C650,140 900,10 1200,40 L1200,120 L0,120 Z"></path>
        </svg>
      </div>
    </section>
  );
}
