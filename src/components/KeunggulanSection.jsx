import React from 'react';
import { Zap, ShieldCheck, LayoutGrid, Headphones } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Cepat & Ringan',
    description: 'Website super cepat untuk pengalaman terbaik pengunjung dan SEO Google optimal.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-500/10'
  },
  {
    icon: ShieldCheck,
    title: 'Aman & Terpercaya',
    description: 'Data dan bisnis Anda selalu terlindungi dengan SSL, proteksi DDoS, dan backup rutin.',
    color: 'text-teal-600',
    bg: 'bg-teal-500/10'
  },
  {
    icon: LayoutGrid,
    title: 'Desain Modern',
    description: 'Tampilan profesional, responsif di semua perangkat (HP, tablet, laptop), dan kekinian.',
    color: 'text-emerald-700',
    bg: 'bg-emerald-500/15'
  },
  {
    icon: Headphones,
    title: 'Support 24/7',
    description: 'Bantuan kapan saja saat Anda butuh perbaikan, update konten, atau kendala teknis.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-500/10'
  }
];

export default function KeunggulanSection() {
  return (
    <section id="keunggulan" className="py-20 bg-[#F8FAF9] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wide uppercase mb-3">
            Keunggulan Kami
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Mengapa Memilih <span className="text-brand-800">afifedu</span>?
          </h2>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index}
                className="bg-white rounded-3xl p-8 border border-emerald-900/5 shadow-soft hover:shadow-card hover:-translate-y-1.5 transition-all duration-300 text-center flex flex-col items-center group"
              >
                <div className={`w-16 h-16 rounded-2xl ${item.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-8 h-8 ${item.color} stroke-[2.2]`} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
