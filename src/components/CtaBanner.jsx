import React from 'react';
import { Rocket, ArrowRight } from 'lucide-react';

export default function CtaBanner() {
  return (
    <section className="py-12 bg-[#F8FAF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-900 via-brand-850 to-brand-800 p-8 sm:p-12 text-white shadow-hero flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Decorative background glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none"></div>

          {/* Text and Rocket Icon */}
          <div className="flex items-center gap-5 relative z-10 text-center md:text-left flex-col md:flex-row">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
              <Rocket className="w-8 h-8 text-amber-400 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Siap Memiliki Website Impian?
              </h3>
              <p className="text-emerald-100/90 text-sm sm:text-base mt-1 max-w-xl">
                Hubungi kami sekarang juga dan wujudkan ide Anda bersama afifedu!
              </p>
            </div>
          </div>

          {/* Golden CTA Button */}
          <div className="relative z-10 shrink-0">
            <a
              href="https://wa.me/6285815455474?text=Halo%20afifedu,%20saya%20siap%20membuat%20website%20impian"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-base shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              <span>Beli Sekarang</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
