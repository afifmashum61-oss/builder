import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  Eye, 
  Sparkles, 
  Layers, 
  Globe, 
  Tag, 
  Calendar,
  ArrowUpDown
} from 'lucide-react';

export default function KatalogPage({ websites, loading, onSelectProject }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedTag, setSelectedTag] = useState('Semua');
  const [sortBy, setSortBy] = useState('terbaru');

  const safeWebsites = Array.isArray(websites) ? websites : [];

  // Extract all unique categories and tags
  const categories = useMemo(() => {
    const set = new Set(safeWebsites.map((w) => w.category).filter(Boolean));
    return ['Semua', ...Array.from(set)];
  }, [safeWebsites]);

  const allTags = useMemo(() => {
    const set = new Set();
    safeWebsites.forEach((w) => {
      if (Array.isArray(w.tags)) {
        w.tags.forEach((t) => set.add(t));
      }
    });
    return ['Semua', ...Array.from(set)];
  }, [safeWebsites]);

  // Filter & Sort
  const filteredWebsites = useMemo(() => {
    return safeWebsites
      .filter((item) => {
        // Category filter
        if (selectedCategory !== 'Semua' && item.category !== selectedCategory) {
          return false;
        }

        // Tag filter
        if (selectedTag !== 'Semua' && (!item.tags || !item.tags.includes(selectedTag))) {
          return false;
        }

        // Search query
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title?.toLowerCase().includes(q);
          const matchDesc = item.description?.toLowerCase().includes(q);
          const matchClient = item.client?.toLowerCase().includes(q);
          const matchTag = item.tags?.some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchClient && !matchTag) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'terpopuler') {
          return (b.views || 0) - (a.views || 0);
        }
        if (sortBy === 'judul') {
          return a.title.localeCompare(b.title);
        }
        // default terbaru
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [websites, searchQuery, selectedCategory, selectedTag, sortBy]);

  return (
    <div className="py-12 bg-[#F8FAF9] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-block px-4 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wide uppercase mb-3">
            Pusat Katalog Web
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Koleksi Portofolio <span className="text-emerald-700">Website Kami</span>
          </h1>
          <p className="text-slate-500 mt-2 text-sm sm:text-base">
            Jelajahi seluruh karya website yang telah kami rancang dan kembangkan dengan teknologi modern.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama website, teknologi, deskripsi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-sm"
              />
            </div>

            {/* Tag / Tech filter */}
            <div className="md:col-span-3">
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-700 font-medium"
              >
                <option value="Semua">Semua Teknologi Stack</option>
                {allTags.filter((t) => t !== 'Semua').map((tag) => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-700 font-medium"
              >
                <option value="terbaru">Terbaru Ditambahkan</option>
                <option value="terpopuler">Paling Sering Dilihat</option>
                <option value="judul">Urutkan Abjad (A-Z)</option>
              </select>
            </div>

          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Kategori:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-brand-800 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 text-xs text-slate-500 font-medium px-2">
          <span>Menampilkan {filteredWebsites.length} website</span>
          {searchQuery && (
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('Semua'); setSelectedTag('Semua'); }}
              className="text-emerald-700 hover:underline"
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* Websites Grid */}
        {filteredWebsites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredWebsites.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectProject(item)}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer"
              >
                {/* Browser bar */}
                <div className="bg-slate-100 px-4 py-2 flex items-center justify-between border-b border-slate-200/80">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 truncate max-w-[140px]">
                    {item.title}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {item.category}
                  </span>
                </div>

                {/* Screenshot */}
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProject(item);
                      }}
                      className="px-4 py-2 rounded-full bg-white text-slate-900 font-bold text-xs flex items-center gap-1.5 shadow"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Lihat Detail</span>
                    </button>
                    {item.demoUrl && (
                      <a
                        href={item.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-4 py-2 rounded-full bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Buka Live</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {item.title}
                      </h3>
                      {item.isFeatured && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                          <Sparkles className="w-3 h-3 fill-amber-500" />
                          Unggulan
                        </span>
                      )}
                    </div>
                    
                    <p className="text-xs text-slate-500 line-clamp-3 mb-4 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div>
                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {item.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Metadata Footer */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                      <span>Klien: {item.client || 'Umum'}</span>
                      <span>Dilihat: {item.views || 0}x</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <Globe className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-700">Tidak ada website yang cocok</h3>
            <p className="text-slate-500 text-sm mt-1">
              Coba sesuaikan kata kunci pencarian atau ganti kategori.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
