import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  Eye, 
  ArrowRight,
  Sparkles,
  Globe
} from 'lucide-react';

export default function PortofolioSection({ websites, onSelectProject }) {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [carouselIndex, setCarouselIndex] = useState(0);

  const categories = ['Semua', 'Sekolah', 'Bisnis', 'UMKM', 'E-Commerce', 'SaaS'];

  const safeWebsites = Array.isArray(websites) ? websites : [];
  
  // Hapus item duplikat otomatis
  const uniqueWebsites = [];
  const seenKeys = new Set();
  for (const item of safeWebsites) {
    if (!item) continue;
    const titleKey = (item.title || '').trim().toLowerCase();
    const demoKey = (item.demoUrl || '').trim().toLowerCase();
    const key = `${item.id || ''}:::${titleKey}:::${demoKey}`;
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      uniqueWebsites.push(item);
    }
  }

  const filteredWebsites = uniqueWebsites.filter(item => {
    if (activeCategory === 'Semua') return true;
    return item.category?.toLowerCase() === activeCategory.toLowerCase();
  });

  const nextSlide = () => {
    if (filteredWebsites.length <= 1) return;
    setCarouselIndex((prev) => (prev + 1) % filteredWebsites.length);
  };

  const prevSlide = () => {
    if (filteredWebsites.length <= 1) return;
    setCarouselIndex((prev) => (prev - 1 + filteredWebsites.length) % filteredWebsites.length);
  };

  // Determine items to display in carousel
  const visibleItems = [];
  const total = filteredWebsites.length;
  if (total > 0) {
    const count = Math.min(3, total);
    for (let i = 0; i < count; i++) {
      visibleItems.push(filteredWebsites[(carouselIndex + i) % total]);
    }
  }

  return (
    <section id="portofolio" className="py-16 sm:py-24 bg-gradient-to-b from-[#F8FAF9] via-emerald-50/40 to-[#F8FAF9] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-6">
          <div>
            <span className="inline-block px-4 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wide uppercase mb-3">
              Portofolio Kami
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Hasil Karya <span className="text-emerald-700">Terbaik Kami</span>
            </h2>
            <p className="text-slate-500 mt-2 text-sm sm:text-base">
              Berbagai website berkualitas untuk berbagai kebutuhan bisnis dan instansi
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/katalog"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-emerald-600/30 bg-white hover:bg-emerald-50 text-emerald-800 font-bold text-xs sm:text-sm shadow-sm hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>
        </div>

        {/* Category Filters with smooth horizontal scroll on mobile */}
        <div className="flex items-center gap-2 mb-8 sm:mb-10 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setCarouselIndex(0);
              }}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold shrink-0 transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-brand-800 text-white shadow-md scale-105'
                  : 'bg-white text-slate-600 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 3D Perspective Showcase with responsive navigation */}
        <div className="relative my-4 sm:my-8">
          
          {/* Navigation arrow buttons */}
          {total > 1 && (
            <>
              <button 
                onClick={prevSlide}
                aria-label="Previous Website"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 sm:-translate-x-5 z-20 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-white/95 backdrop-blur-md shadow-xl border border-slate-200 flex items-center justify-center text-slate-700 hover:text-emerald-700 hover:scale-110 active:scale-95 transition-all"
              >
                <ChevronLeft className="w-5 sm:w-6 h-5 sm:h-6 stroke-[2.5]" />
              </button>

              <button 
                onClick={nextSlide}
                aria-label="Next Website"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 sm:translate-x-5 z-20 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-white/95 backdrop-blur-md shadow-xl border border-slate-200 flex items-center justify-center text-slate-700 hover:text-emerald-700 hover:scale-110 active:scale-95 transition-all"
              >
                <ChevronRight className="w-5 sm:w-6 h-5 sm:h-6 stroke-[2.5]" />
              </button>
            </>
          )}

          {/* Cards Grid / Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {visibleItems.map((item, index) => {
              const isCenter = index === 1 || visibleItems.length === 1;

              return (
                <div
                  key={`${item.id}-${index}`}
                  onClick={() => onSelectProject(item)}
                  className={`cursor-pointer group relative rounded-3xl bg-white border border-slate-200/80 shadow-soft hover:shadow-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between ${
                    isCenter 
                      ? 'lg:scale-105 lg:-translate-y-2 ring-2 ring-emerald-500/30 shadow-xl z-10' 
                      : 'hover:-translate-y-1'
                  }`}
                >
                  <div>
                    {/* Browser Mockup Header */}
                    <div className="bg-slate-100/90 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 truncate max-w-[150px]">
                        {item.title}
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                        {item.category}
                      </span>
                    </div>

                    {/* Thumbnail Image with smooth zoom */}
                    <div className="relative h-48 sm:h-56 bg-slate-100 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2.5 backdrop-blur-xs p-4">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectProject(item);
                          }}
                          className="px-4 py-2 rounded-full bg-white text-slate-900 font-bold text-xs flex items-center gap-1.5 shadow-lg hover:scale-105 active:scale-95 transition-transform"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detail</span>
                        </button>
                        
                        {item.demoUrl && (
                          <a
                            href={item.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="px-4 py-2 rounded-full bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg hover:scale-105 active:scale-95 transition-transform"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Buka Web</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-1.5">
                        <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {item.title}
                        </h3>
                        {item.isFeatured && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">
                            <Sparkles className="w-3 h-3 fill-amber-400" />
                            Unggulan
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer with Tags */}
                  <div className="px-5 pb-5">
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {item.tags.slice(0, 3).map((tag, i) => (
                          <span 
                            key={i} 
                            className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty state */}
          {filteredWebsites.length === 0 && (
            <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300">
              <Globe className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">Belum ada website dalam kategori ini.</p>
              <Link to="/katalog" className="text-xs text-emerald-700 font-semibold underline mt-1 inline-block">
                Lihat semua website di katalog
              </Link>
            </div>
          )}

          {/* Carousel dots pagination */}
          {total > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-8">
              {filteredWebsites.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCarouselIndex(i)}
                  aria-label={`Ke slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    carouselIndex === i 
                      ? 'w-7 bg-brand-800' 
                      : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
