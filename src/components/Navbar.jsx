import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ChevronDown, 
  ArrowRight, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';
import AfifeduLogo from './AfifeduLogo';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('beranda');
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Scrollspy to detect active section smoothly
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      if (location.pathname !== '/') return;

      const sections = ['keunggulan', 'portofolio', 'harga', 'testimoni', 'faq'];
      const scrollPos = window.scrollY + 120;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          return;
        }
      }
      setActiveSection('beranda');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Smooth scroll handler helper
  const handleScrollTo = (e, targetId) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (location.pathname !== '/') {
      navigate('/#' + targetId);
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }

    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (targetId === 'beranda') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${
      scrolled 
        ? 'bg-[#0A342B]/95 backdrop-blur-md shadow-lg shadow-black/10 border-b border-white/10' 
        : 'bg-[#0A342B] border-b border-white/5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand */}
          <Link 
            to="/" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center group shrink-0"
          >
            <AfifeduLogo variant="white" showSubtext={true} />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            <Link 
              to="/" 
              onClick={(e) => handleScrollTo(e, 'beranda')}
              className={`hover:text-emerald-300 transition-colors py-1 ${
                location.pathname === '/' && activeSection === 'beranda'
                  ? 'text-white border-b-2 border-emerald-400 font-semibold' 
                  : 'text-slate-300'
              }`}
            >
              Beranda
            </Link>

            {/* Dropdown Layanan */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-slate-300 hover:text-emerald-300 transition-colors py-2">
                <span>Layanan</span>
                <ChevronDown className="w-4 h-4 text-emerald-300 group-hover:rotate-180 transition-transform duration-200" />
              </button>
              <div className="absolute top-full left-0 w-52 py-2 bg-slate-900/95 backdrop-blur-xl border border-slate-700/60 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                <a 
                  href="#keunggulan" 
                  onClick={(e) => handleScrollTo(e, 'keunggulan')}
                  className="block px-4 py-2.5 text-xs text-slate-200 hover:bg-emerald-800/40 hover:text-white transition-colors"
                >
                  ⚡ Fitur & Keunggulan
                </a>
                <a 
                  href="#harga" 
                  onClick={(e) => handleScrollTo(e, 'harga')}
                  className="block px-4 py-2.5 text-xs text-slate-200 hover:bg-emerald-800/40 hover:text-white transition-colors"
                >
                  💎 Paket Pembuatan Web
                </a>
                <a 
                  href="#testimoni" 
                  onClick={(e) => handleScrollTo(e, 'testimoni')}
                  className="block px-4 py-2.5 text-xs text-slate-200 hover:bg-emerald-800/40 hover:text-white transition-colors"
                >
                  ⭐ Ulasan Klien
                </a>
              </div>
            </div>

            <a 
              href="#portofolio" 
              onClick={(e) => handleScrollTo(e, 'portofolio')}
              className={`hover:text-emerald-300 transition-colors py-1 ${
                location.pathname === '/' && activeSection === 'portofolio'
                  ? 'text-white border-b-2 border-emerald-400 font-semibold' 
                  : 'text-slate-300'
              }`}
            >
              Portofolio
            </a>

            <Link 
              to="/katalog" 
              className={`hover:text-emerald-300 transition-colors py-1 ${
                location.pathname === '/katalog' 
                  ? 'text-white border-b-2 border-emerald-400 font-semibold' 
                  : 'text-slate-300'
              }`}
            >
              Katalog Lengkap
            </Link>

            <a 
              href="#testimoni" 
              onClick={(e) => handleScrollTo(e, 'testimoni')}
              className={`hover:text-emerald-300 transition-colors py-1 ${
                location.pathname === '/' && activeSection === 'testimoni'
                  ? 'text-white border-b-2 border-emerald-400 font-semibold' 
                  : 'text-slate-300'
              }`}
            >
              Testimoni
            </a>
          </nav>

          {/* Action Button: Beli Sekarang */}
          <div className="hidden sm:flex items-center gap-3">
            <a 
              href="https://wa.me/6285815455474?text=Halo%20afifedu,%20saya%20tertarik%20untuk%20membuat%20website" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-sm shadow-md hover:shadow-amber-500/25 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
            >
              <span>Beli Sekarang</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation with Smooth Backdrop */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A342B]/98 backdrop-blur-2xl border-b border-slate-800 px-5 pt-3 pb-6 space-y-2 animate-fade-in-up">
          <Link 
            to="/" 
            onClick={(e) => handleScrollTo(e, 'beranda')}
            className="block py-2.5 px-3 rounded-xl text-slate-100 hover:bg-white/10 font-medium text-sm"
          >
            Beranda
          </Link>
          <a 
            href="#keunggulan" 
            onClick={(e) => handleScrollTo(e, 'keunggulan')}
            className="block py-2.5 px-3 rounded-xl text-slate-100 hover:bg-white/10 font-medium text-sm"
          >
            Keunggulan & Layanan
          </a>
          <a 
            href="#portofolio" 
            onClick={(e) => handleScrollTo(e, 'portofolio')}
            className="block py-2.5 px-3 rounded-xl text-slate-100 hover:bg-white/10 font-medium text-sm"
          >
            Portofolio Unggulan
          </a>
          <Link 
            to="/katalog" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2.5 px-3 rounded-xl text-emerald-300 hover:bg-white/10 font-semibold text-sm"
          >
            Katalog Lengkap Seluruh Website
          </Link>
          <a 
            href="#harga" 
            onClick={(e) => handleScrollTo(e, 'harga')}
            className="block py-2.5 px-3 rounded-xl text-slate-100 hover:bg-white/10 font-medium text-sm"
          >
            Paket Harga
          </a>
          <a 
            href="#testimoni" 
            onClick={(e) => handleScrollTo(e, 'testimoni')}
            className="block py-2.5 px-3 rounded-xl text-slate-100 hover:bg-white/10 font-medium text-sm"
          >
            Testimoni Klien
          </a>

          <div className="pt-3 border-t border-white/10">
            <a 
              href="https://wa.me/6285815455474?text=Halo%20afifedu,%20saya%20tertarik%20untuk%20membuat%20website" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-sm shadow-md active:scale-95 transition-all"
            >
              <span>Beli Sekarang</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
