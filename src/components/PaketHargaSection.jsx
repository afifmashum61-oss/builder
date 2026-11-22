import React from 'react';
import { Send, Crown, Rocket, Check, ArrowRight } from 'lucide-react';

const pricingPlans = [
  {
    name: 'Paket Starter',
    icon: Send,
    subtitle: 'Cocok untuk profil bisnis sederhana',
    price: 'Rp 499.000',
    priceSuffix: 'Mulai dari',
    isPopular: false,
    ctaText: 'Pilih Paket',
    features: [
      'Desain Modern & Responsif',
      'Domain & Hosting 1 Tahun',
      'Support 24/7'
    ]
  },
  {
    name: 'Paket Profesional',
    icon: Crown,
    subtitle: 'Solusi terbaik untuk bisnis Anda',
    price: 'Rp 999.000',
    priceSuffix: 'Mulai dari',
    isPopular: true,
    ctaText: 'Pilih Paket',
    features: [
      'Fitur Lengkap & Custom',
      'Domain & Hosting 1 Tahun',
      'Support Prioritas',
      'SEO Friendly Google',
      'Integrasi WhatsApp & Sosial Media'
    ]
  },
  {
    name: 'Paket Enterprise',
    icon: Rocket,
    subtitle: 'Untuk kebutuhan skala besar',
    price: 'Rp 1.999.000',
    priceSuffix: 'Mulai dari',
    isPopular: false,
    ctaText: 'Hubungi Kami',
    features: [
      'Fitur Premium & Custom',
      'Keamanan Tingkat Tinggi',
      'Dukungan Prioritas VIP',
      'Database & Backend Fleksibel'
    ]
  }
];

export default function PaketHargaSection() {
  return (
    <section id="harga" className="py-20 bg-[#F8FAF9] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wide uppercase mb-3">
            Paket Harga
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Pilih Paket <span className="text-emerald-700">Terbaik</span> untuk Anda
          </h2>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {pricingPlans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <div
                key={index}
                className={`relative rounded-3xl p-8 transition-all duration-300 flex flex-col justify-between ${
                  plan.isPopular
                    ? 'bg-white border-2 border-emerald-600 shadow-2xl scale-105 z-10'
                    : 'bg-white border border-slate-200/90 shadow-soft hover:shadow-card'
                }`}
              >
                {/* Popular Badge */}
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-brand-800 text-white text-xs font-extrabold tracking-wide uppercase shadow-md flex items-center gap-1.5">
                    <span>★</span>
                    <span>Paling Populer</span>
                  </div>
                )}

                <div>
                  {/* Icon & Title */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      plan.isPopular ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      <Icon className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 flex items-center gap-1">
                        {plan.name}
                        <span className="text-emerald-600">✦</span>
                      </h3>
                      <p className="text-xs text-slate-500">{plan.subtitle}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="my-6 pb-6 border-b border-slate-100">
                    <span className="text-xs font-medium text-slate-400 block">
                      {plan.priceSuffix}
                    </span>
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                      {plan.price}
                    </span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 mb-8">
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600">
                        <Check className="w-4 h-4 text-emerald-600 stroke-[2.5] mt-0.5 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <a
                  href={`https://wa.me/6285815455474?text=Halo%20afifedu,%20saya%20tertarik%20dengan%20${encodeURIComponent(plan.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3.5 px-6 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    plan.isPopular
                      ? 'bg-brand-800 hover:bg-brand-900 text-white shadow-lg shadow-emerald-950/20 hover:scale-[1.02]'
                      : 'border border-slate-300 hover:border-emerald-700 text-slate-800 hover:text-emerald-800 hover:bg-emerald-50/50'
                  }`}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.2]" />
                </a>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
