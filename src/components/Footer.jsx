import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Youtube, 
  Instagram, 
  Send,
  ShieldCheck
} from 'lucide-react';
import AfifeduLogo from './AfifeduLogo';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200/80 pt-16 pb-12 text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <AfifeduLogo variant="dark" showSubtext={false} />
            <p className="text-xs text-slate-500 leading-relaxed">
              Bersama Membangun Dunia Digital. Platform katalog dan penyimpanan portofolio website modern untuk kemajuan bisnis Anda.
            </p>
            
            {/* Direct Admin Link indicator */}
            <div className="pt-2">
              <Link 
                to="/admin" 
                className="inline-flex items-center gap-1.5 text-xs text-emerald-800 font-semibold hover:underline"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Panel Admin: /admin</span>
              </Link>
            </div>
          </div>

          {/* Quick Menu */}
          <div>
            <h4 className="font-bold text-slate-900 mb-4 text-xs tracking-wider uppercase">Menu</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:text-emerald-700 transition-colors">Beranda</Link></li>
              <li><Link to="/katalog" className="hover:text-emerald-700 transition-colors">Katalog Website</Link></li>
              <li><a href="#keunggulan" className="hover:text-emerald-700 transition-colors">Layanan & Fitur</a></li>
              <li><a href="#portofolio" className="hover:text-emerald-700 transition-colors">Portofolio</a></li>
              <li><a href="#testimoni" className="hover:text-emerald-700 transition-colors">Testimoni Klien</a></li>
              <li><a href="#harga" className="hover:text-emerald-700 transition-colors">Paket Harga</a></li>
            </ul>
          </div>

          {/* Kontak Kami */}
          <div>
            <h4 className="font-bold text-slate-900 mb-4 text-xs tracking-wider uppercase">Kontak Kami</h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
                <a 
                  href="https://wa.me/6285815455474?text=Halo%20afifedu,%20saya%20ingin%20konsultasi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-700 font-medium transition-colors"
                >
                  0858 1545 5474
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>info@afifedu.id</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>Jl. Teknologi No. 1, Indonesia</span>
              </li>
            </ul>
          </div>

          {/* Ikuti Kami */}
          <div>
            <h4 className="font-bold text-slate-900 mb-4 text-xs tracking-wider uppercase">Ikuti Kami</h4>
            <div className="flex items-center gap-3 text-slate-500">
              <a href="#" className="w-9 h-9 rounded-full bg-slate-100 hover:bg-emerald-100 hover:text-emerald-700 flex items-center justify-center transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-100 hover:bg-emerald-100 hover:text-emerald-700 flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-100 hover:bg-emerald-100 hover:text-emerald-700 flex items-center justify-center transition-colors">
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-slate-100 pt-8 text-center text-xs text-slate-400">
          © 2026 afifedu. Semua hak cipta dilindungi.
        </div>
      </div>
    </footer>
  );
}
