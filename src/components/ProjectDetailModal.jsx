import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Github, 
  Eye, 
  Calendar, 
  User, 
  Check, 
  MessageSquare,
  Sparkles,
  Maximize2,
  Smartphone,
  Monitor
} from 'lucide-react';

export default function ProjectDetailModal({ project, onClose }) {
  const [deviceMode, setDeviceMode] = useState('desktop'); // desktop or mobile
  const [showIframe, setShowIframe] = useState(false);

  if (!project) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              {project.category}
            </span>
            <h3 className="font-bold text-lg text-slate-900 truncate max-w-md">
              {project.title}
            </h3>
            {project.isFeatured && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 fill-amber-500" />
                Unggulan
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-200/60 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Preview Viewport & Controls */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Tampilan Screenshot Website:</span>
              <div className="flex items-center gap-2">
                {project.demoUrl && (
                  <button
                    onClick={() => setShowIframe(!showIframe)}
                    className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>{showIframe ? 'Lihat Gambar' : 'Coba Live Preview'}</span>
                  </button>
                )}
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner max-h-[380px] flex items-center justify-center">
              {showIframe && project.demoUrl ? (
                <iframe
                  src={project.demoUrl}
                  title={project.title}
                  className="w-full h-[380px] border-0"
                />
              ) : (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-auto max-h-[380px] object-cover"
                />
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Deskripsi Proyek
            </h4>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
              {project.description || 'Tidak ada deskripsi khusus.'}
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Kategori</span>
              <span className="font-bold text-slate-800">{project.category}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Klien / Instansi</span>
              <span className="font-bold text-slate-800">{project.client || '-'}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Tahun Rilis</span>
              <span className="font-bold text-slate-800">{project.year || '2026'}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Total Dilihat</span>
              <span className="font-bold text-emerald-700">{project.views || 0}x</span>
            </div>
          </div>

          {/* Tech Stack */}
          {project.tags && project.tags.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Teknologi yang Digunakan
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/60 font-semibold text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer / CTAs */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Source Code</span>
              </a>
            )}

            <a
              href={`https://wa.me/6285815455474?text=Halo%20afifedu,%20saya%20tertarik%20dengan%20proyek%20${encodeURIComponent(project.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Tanya Pembuatan Serupa</span>
            </a>
          </div>

          {project.demoUrl ? (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm flex items-center gap-2 shadow-md hover:scale-105 transition-all"
            >
              <span>Buka Live Demo</span>
              <ExternalLink className="w-4 h-4 stroke-[2.2]" />
            </a>
          ) : (
            <button
              disabled
              className="px-5 py-2.5 rounded-full bg-slate-200 text-slate-400 font-bold text-xs cursor-not-allowed"
            >
              Demo Belum Tersedia
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
