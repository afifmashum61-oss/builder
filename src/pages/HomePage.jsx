import React from 'react';
import HeroSection from '../components/HeroSection';
import KeunggulanSection from '../components/KeunggulanSection';
import PortofolioSection from '../components/PortofolioSection';
import PaketHargaSection from '../components/PaketHargaSection';
import TestimoniSection from '../components/TestimoniSection';
import CtaBanner from '../components/CtaBanner';

export default function HomePage({ websites, loading, onSelectProject }) {
  const scrollToPortfolio = () => {
    const el = document.getElementById('portofolio');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      {/* 1. Hero Section (exact visual match to reference image) */}
      <HeroSection onExploreClick={scrollToPortfolio} />

      {/* 2. Keunggulan Kami (4 feature cards) */}
      <KeunggulanSection />

      {/* 3. Portofolio Kami / Katalog Web Karya */}
      <PortofolioSection 
        websites={websites} 
        onSelectProject={onSelectProject} 
      />

      {/* 4. Paket Harga (Starter, Profesional, Enterprise) */}
      <PaketHargaSection />

      {/* 5. Testimoni Pelanggan */}
      <TestimoniSection />

      {/* 6. Call to Action Banner */}
      <CtaBanner />
    </div>
  );
}
