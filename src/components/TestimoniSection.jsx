import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    quote: '"afifedu sangat membantu untuk website sekolah kami. Prosesnya cepat dan hasilnya luar biasa!"',
    name: 'Ahmad Fauzi',
    role: 'Kepala Sekolah',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    rating: 5
  },
  {
    quote: '"Desainnya keren, fiturnya lengkap, dan support-nya responsif. Sangat puas!"',
    name: 'Siti Nurhaliza',
    role: 'Pebisnis Online',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    rating: 5
  },
  {
    quote: '"Harga terjangkau dengan kualitas terbaik. Recommended banget untuk UMKM!"',
    name: 'Budi Santoso',
    role: 'Pengusaha',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    rating: 5
  }
];

export default function TestimoniSection() {
  return (
    <section id="testimoni" className="py-20 bg-gradient-to-b from-[#F8FAF9] via-emerald-50/30 to-[#F8FAF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wide uppercase mb-3">
            Testimoni Pelanggan
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Apa Kata <span className="text-emerald-700">Mereka</span>?
          </h2>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-soft hover:shadow-card transition-all flex flex-col justify-between"
            >
              <p className="text-slate-600 text-sm italic mb-6 leading-relaxed">
                {item.quote}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500/20"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{item.name}</h4>
                    <p className="text-xs text-slate-400">{item.role}</p>
                  </div>
                </div>

                {/* 5 Stars */}
                <div className="flex text-amber-400 gap-0.5">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
