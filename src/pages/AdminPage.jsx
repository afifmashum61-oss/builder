import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Globe, 
  ShieldCheck, 
  Lock, 
  Upload, 
  Link as LinkIcon, 
  Eye, 
  Sparkles, 
  Layers, 
  TrendingUp, 
  Search, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  Camera
} from 'lucide-react';
import AfifeduLogo from '../components/AfifeduLogo';
import { defaultWebsites } from '../data/defaultWebsites';
import { 
  fetchWebsitesFromFirebase, 
  addWebsiteToFirebase, 
  updateWebsiteInFirebase, 
  deleteWebsiteFromFirebase 
} from '../services/websiteService';

// Helper: Auto-generate live screenshot URL from any website link (like Vercel does)
const generateScreenshotUrl = (url) => {
  if (!url) return '';
  let cleanUrl = url.trim();
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    cleanUrl = 'https://' + cleanUrl;
  }
  return `https://s0.wp.com/mshots/v1/${encodeURIComponent(cleanUrl)}?w=1280`;
};

// Helper: Extract a readable title from domain/URL
const extractTitleFromUrl = (url) => {
  try {
    let clean = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    clean = clean.replace(/\.vercel\.app$/, '').replace(/\.(com|my\.id|id|org|net|io|dev|app)$/, '');
    return clean
      .split(/[-_.]/)
      .map(s => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ');
  } catch {
    return 'Website Baru';
  }
};

export default function AdminPage({ onWebsitesChanged }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [websites, setWebsites] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [quickUrl, setQuickUrl] = useState('');
  const [autoCaptureScreenshot, setAutoCaptureScreenshot] = useState(true);

  // Modal form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    title: '',
    category: 'Bisnis',
    description: '',
    demoUrl: '',
    githubUrl: '',
    image: '',
    tags: '',
    client: '',
    year: new Date().getFullYear().toString(),
    isFeatured: false
  });
  const [imageInputMode, setImageInputMode] = useState('url'); // 'url' or 'upload'

  // Check auth session
  useEffect(() => {
    const savedToken = localStorage.getItem('webkita_admin_token');
    if (savedToken === 'webkita-admin-session-auth') {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch admin data from Firebase Cloud Firestore with fallback
  const fetchData = async () => {
    setLoading(true);
    let list = [];
    try {
      list = await fetchWebsitesFromFirebase();
    } catch (err) {
      console.warn("Firestore fetch error:", err);
    }

    if (!list || list.length === 0) {
      const saved = localStorage.getItem('afifedu_websites');
      if (saved) {
        try { list = JSON.parse(saved); } catch { list = defaultWebsites; }
      } else {
        list = defaultWebsites;
      }
    }

    setWebsites(list);
    localStorage.setItem('afifedu_websites', JSON.stringify(list));

    const categories = [...new Set(list.map(i => i.category || 'Umum'))];
    const totalViews = list.reduce((acc, curr) => acc + (curr.views || 0), 0);
    const featuredCount = list.filter(i => i.isFeatured).length;
    setStats({
      totalWebsites: list.length,
      categoriesCount: categories.length,
      totalViews,
      featuredCount
    });
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  // Handle Login (supports both API & offline/Vercel PIN check)
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    
    // Direct check for admin password (n4j4h123)
    if (pinInput === 'n4j4h123') {
      localStorage.setItem('webkita_admin_token', 'webkita-admin-session-auth');
      setIsAuthenticated(true);
      return;
    }

    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinInput })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('webkita_admin_token', data.token);
        setIsAuthenticated(true);
      } else {
        setAuthError(data.message || 'Password Admin Salah!');
      }
    } catch (err) {
      setAuthError('Password Admin Salah!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('webkita_admin_token');
    setIsAuthenticated(false);
    setPinInput('');
  };

  // Quick Add website only by entering URL (Auto-screenshot like Vercel)
  const handleQuickAddByUrl = async (e) => {
    e.preventDefault();
    if (!quickUrl.trim()) return;

    let cleanUrl = quickUrl.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'https://' + cleanUrl;
    }

    const title = extractTitleFromUrl(cleanUrl);
    const screenshot = generateScreenshotUrl(cleanUrl);
    const slug = title.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');

    const newSite = {
      id: 'web-' + Date.now(),
      title: title,
      slug: slug + '-' + Math.floor(Math.random() * 1000),
      category: 'Bisnis',
      description: `Website ${title} hasil rilis/deployment modern yang responsif dan siap digunakan.`,
      demoUrl: cleanUrl,
      githubUrl: '',
      image: screenshot,
      tags: ['React', 'Tailwind CSS', 'Vercel'],
      isFeatured: true,
      views: 0,
      createdAt: new Date().toISOString(),
      client: 'Portofolio',
      year: new Date().getFullYear().toString()
    };

    const updated = [newSite, ...websites];
    localStorage.setItem('afifedu_websites', JSON.stringify(updated));
    setWebsites(updated);
    setQuickUrl('');

    // Simpan ke Cloud Firestore Firebase & Local API
    try {
      await addWebsiteToFirebase(newSite);
      await fetch('/api/websites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSite)
      });
    } catch (err) {
      // offline/vercel
    }

    fetchData();
    if (onWebsitesChanged) onWebsitesChanged();
  };

  // When typing/pasting Demo URL in the modal, automatically generate screenshot
  const handleDemoUrlChange = (url) => {
    let cleanUrl = url.trim();
    if (cleanUrl && !cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'https://' + cleanUrl;
    }

    const newImage = autoCaptureScreenshot && cleanUrl ? generateScreenshotUrl(cleanUrl) : formData.image;
    const autoTitle = (!formData.title || formData.title === 'Website Baru') && cleanUrl 
      ? extractTitleFromUrl(cleanUrl) 
      : formData.title;

    setFormData({
      ...formData,
      demoUrl: url,
      image: newImage,
      title: autoTitle
    });
  };

  // Re-generate screenshot for any item from its demo link
  const handleRefreshScreenshot = async (item) => {
    if (!item.demoUrl) {
      alert('Website ini belum memiliki URL Live Demo');
      return;
    }
    const newScreenshot = generateScreenshotUrl(item.demoUrl);
    const updated = websites.map(w => w.id === item.id ? { ...w, image: newScreenshot } : w);
    localStorage.setItem('afifedu_websites', JSON.stringify(updated));
    setWebsites(updated);

    try {
      await updateWebsiteInFirebase(item.id, { image: newScreenshot });
      await fetch(`/api/websites/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: newScreenshot })
      });
    } catch {
      // offline
    }

    fetchData();
    if (onWebsitesChanged) onWebsitesChanged();
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      category: 'Bisnis',
      description: '',
      demoUrl: '',
      githubUrl: '',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80',
      tags: 'React, Tailwind CSS',
      client: '',
      year: new Date().getFullYear().toString(),
      isFeatured: false
    });
    setImageInputMode('url');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      category: item.category || 'Bisnis',
      description: item.description || '',
      demoUrl: item.demoUrl || '',
      githubUrl: item.githubUrl || '',
      image: item.image || '',
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || '',
      client: item.client || '',
      year: item.year || new Date().getFullYear().toString(),
      isFeatured: Boolean(item.isFeatured)
    });
    setImageInputMode('url');
    setIsModalOpen(true);
  };

  // Handle Image File Upload
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const bodyFormData = new FormData();
    bodyFormData.append('image', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: bodyFormData
      });
      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, image: data.url }));
      } else {
        alert(data.message || 'Gagal upload gambar');
      }
    } catch (err) {
      alert('Error saat mengunggah file gambar');
    } finally {
      setUploadingImage(false);
    }
  };

  // Save Website (Create or Update)
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Judul website wajib diisi!');
      return;
    }

    const tagsArray = Array.isArray(formData.tags)
      ? formData.tags
      : formData.tags.split(',').map((t) => t.trim()).filter(Boolean);

    let updatedList = [...websites];

    if (editingItem) {
      updatedList = updatedList.map((w) =>
        w.id === editingItem.id
          ? {
              ...w,
              ...formData,
              tags: tagsArray,
              updatedAt: new Date().toISOString()
            }
          : w
      );
    } else {
      const slug = formData.title.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
      const newSite = {
        ...formData,
        id: 'web-' + Date.now(),
        slug: slug + '-' + Math.floor(Math.random() * 1000),
        tags: tagsArray,
        views: 0,
        createdAt: new Date().toISOString()
      };
      updatedList.unshift(newSite);
    }

    // Save to localStorage immediately
    localStorage.setItem('afifedu_websites', JSON.stringify(updatedList));
    setWebsites(updatedList);
    setIsModalOpen(false);

    // Save to Cloud Firestore & API
    try {
      if (editingItem) {
        await updateWebsiteInFirebase(editingItem.id, {
          ...formData,
          tags: tagsArray
        });
      } else {
        const newSite = updatedList[0];
        await addWebsiteToFirebase(newSite);
      }

      const url = editingItem ? `/api/websites/${editingItem.id}` : '/api/websites';
      const method = editingItem ? 'PUT' : 'POST';
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
    } catch (err) {
      // offline/static
    }

    fetchData();
    if (onWebsitesChanged) onWebsitesChanged();
  };

  // Delete Website
  const handleDelete = async (id, title) => {
    if (!window.confirm(`Yakin ingin menghapus website "${title}" dari katalog?`)) {
      return;
    }

    const updated = websites.filter(w => w.id !== id);
    localStorage.setItem('afifedu_websites', JSON.stringify(updated));
    setWebsites(updated);

    try {
      await deleteWebsiteFromFirebase(id);
      await fetch(`/api/websites/${id}`, { method: 'DELETE' });
    } catch (err) {
      // offline
    }

    fetchData();
    if (onWebsitesChanged) onWebsitesChanged();
  };

  // Toggle Featured status
  const handleToggleFeatured = async (item) => {
    const updated = websites.map(w => w.id === item.id ? { ...w, isFeatured: !w.isFeatured } : w);
    localStorage.setItem('afifedu_websites', JSON.stringify(updated));
    setWebsites(updated);

    try {
      await updateWebsiteInFirebase(item.id, { isFeatured: !item.isFeatured });
      await fetch(`/api/websites/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !item.isFeatured })
      });
    } catch (err) {
      // offline
    }

    fetchData();
    if (onWebsitesChanged) onWebsitesChanged();
  };

  // If not logged in, show PIN login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A342B] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8 stroke-[2.2]" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Akses Admin <span className="text-emerald-700">afifedu</span>
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Masukkan Password Admin untuk mengelola penyimpanan katalog website.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Masukkan Password Admin"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full text-center tracking-widest text-lg font-bold py-3.5 px-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                autoFocus
              />
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs font-semibold flex items-center gap-2 justify-center">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-brand-800 hover:bg-brand-900 text-white font-bold text-sm shadow-md transition-all"
            >
              Buka Panel Admin
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-700 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Web Publik (/)</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filtered list in admin
  const filteredList = websites.filter(w => 
    w.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAF9] pb-16">
      
      {/* Top Admin Navbar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <AfifeduLogo variant="white" showSubtext={false} />
            <span className="hidden sm:inline-block ml-1 text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md font-mono">
              /admin
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              Firebase Firestore: builder-386e1
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Link kembali ke publik */}
            <Link
              to="/"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Lihat Web Publik (/)</span>
            </Link>

            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-200 border border-red-800/40 text-xs font-semibold transition-colors"
            >
              Keluar
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Header Title & Quick Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Penyimpanan & Manajemen Website
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Kelola katalog website yang sudah Anda buat agar tampil di web publik.
            </p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-brand-800 hover:bg-brand-900 text-white font-bold text-sm shadow-md transition-all self-start sm:self-auto hover:scale-105"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Tambah Website Baru</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft">
            <span className="text-xs font-semibold text-slate-400 block mb-1">Total Web Tersimpan</span>
            <span className="text-2xl font-black text-slate-900">{stats?.totalWebsites || websites.length}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft">
            <span className="text-xs font-semibold text-slate-400 block mb-1">Total Kategori</span>
            <span className="text-2xl font-black text-emerald-700">{stats?.categoriesCount || 0}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft">
            <span className="text-xs font-semibold text-slate-400 block mb-1">Total Dilihat / Klik</span>
            <span className="text-2xl font-black text-amber-600">{stats?.totalViews || 0}x</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft">
            <span className="text-xs font-semibold text-slate-400 block mb-1">Web Unggulan (Carousel)</span>
            <span className="text-2xl font-black text-teal-700">{stats?.featuredCount || 0}</span>
          </div>
        </div>

        {/* Quick Add Website by Link (Auto-Capture Live Preview like Vercel) */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 rounded-3xl p-6 sm:p-7 text-white shadow-xl mb-8 border border-emerald-500/30">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Otomatis Ambil Tampilan Beranda (Seperti Vercel)</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold">
                Tambah Website Cukup Masukkan Link Web
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-0.5">
                Cukup tempelkan link website yang sudah dideploy (misal: https://proyek-anda.vercel.app), sistem akan otomatis mengambil tampilan beranda untuk katalog.
              </p>
            </div>
          </div>

          <form onSubmit={handleQuickAddByUrl} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Globe className="w-5 h-5 text-emerald-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Masukkan link web, contoh: https://builder.idarah.my.id atau https://nama.vercel.app"
                value={quickUrl}
                onChange={(e) => setQuickUrl(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white/15 text-xs sm:text-sm font-mono"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shrink-0 hover:scale-105 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Simpan Otomatis</span>
            </button>
          </form>
        </div>

        {/* Search bar inside admin */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-soft mb-6 flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400 ml-2" />
          <input
            type="text"
            placeholder="Cari berdasarkan judul atau kategori website..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-sm bg-transparent focus:outline-none"
          />
        </div>

        {/* Website List Table / Cards */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
          
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">
              Daftar Website ({filteredList.length})
            </h3>
            <span className="text-xs text-slate-400">
              Perubahan otomatis tersimpan ke server
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 text-[11px] uppercase tracking-wider font-bold">
                  <th className="py-3 px-6">Website</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Teknologi</th>
                  <th className="py-3 px-4">Unggulan</th>
                  <th className="py-3 px-4">Tampilan</th>
                  <th className="py-3 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    
                    {/* Website details */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-14 h-10 object-cover rounded-lg border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{item.title}</span>
                            {item.demoUrl && (
                              <a
                                href={item.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-400 hover:text-emerald-700"
                                title="Buka live demo"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                          <span className="text-xs text-slate-400 line-clamp-1">
                            {item.client ? `Klien: ${item.client}` : item.description}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Kategori */}
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold text-xs border border-emerald-100">
                        {item.category}
                      </span>
                    </td>

                    {/* Tags */}
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {item.tags?.slice(0, 2).map((t, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                            {t}
                          </span>
                        ))}
                        {item.tags?.length > 2 && (
                          <span className="text-[10px] text-slate-400">+{item.tags.length - 2}</span>
                        )}
                      </div>
                    </td>

                    {/* Featured toggle */}
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleFeatured(item)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                          item.isFeatured
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                        }`}
                        title="Klik untuk mengubah status unggulan di halaman utama"
                      >
                        <Sparkles className={`w-3 h-3 ${item.isFeatured ? 'fill-amber-500 text-amber-500' : ''}`} />
                        <span>{item.isFeatured ? 'Ya' : 'Tidak'}</span>
                      </button>
                    </td>

                    {/* Views */}
                    <td className="py-4 px-4 text-xs text-slate-500 font-medium">
                      {item.views || 0}x klik
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {item.demoUrl && (
                          <button
                            onClick={() => handleRefreshScreenshot(item)}
                            className="p-2 rounded-xl text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 transition-colors"
                            title="Ambil Ulang Screenshot Beranda dari Link Web"
                          >
                            <Camera className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-2 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                          title="Edit Website"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Hapus dari katalog"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredList.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-xs">
              Tidak ada website yang ditemukan. Klik tombol "Tambah Website Baru" di atas.
            </div>
          )}

        </div>

      </main>

      {/* Modal Add / Edit Website */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col">
            
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-lg text-slate-900">
                {editingItem ? 'Edit Website Katalog' : 'Tambah Website Baru ke Katalog'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
              
              {/* 1. Primary: Input URL Web (Auto-capture preview like Vercel) */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5 text-xs sm:text-sm">
                    <Globe className="w-4 h-4 text-emerald-700" />
                    <span>URL Link Website (Live Demo) *</span>
                  </label>
                  <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-100 px-2 py-0.5 rounded-full">
                    ⚡ Auto-Generate Tampilan
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="url"
                    placeholder="Tempelkan link web, contoh: https://proyek-anda.vercel.app"
                    value={formData.demoUrl}
                    onChange={(e) => handleDemoUrlChange(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl bg-white border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs sm:text-sm shadow-sm"
                  />
                </div>

                {/* Live Preview Card */}
                {formData.demoUrl && (
                  <div className="rounded-xl overflow-hidden border border-emerald-200 bg-white shadow-sm mt-2">
                    <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-400"></span>
                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span className="truncate max-w-[200px]">{formData.demoUrl}</span>
                      </div>
                      <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                        <Camera className="w-3 h-3" />
                        Preview Beranda Vercel
                      </span>
                    </div>
                    <div className="relative h-44 bg-slate-100 overflow-hidden flex items-center justify-center">
                      <img
                        src={formData.image || generateScreenshotUrl(formData.demoUrl)}
                        alt="Preview Live"
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Judul & Kategori */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-slate-700 block">Judul Website *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Website Profil Sekolah SMPN 1"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    <option value="Sekolah">Sekolah</option>
                    <option value="Bisnis">Bisnis</option>
                    <option value="UMKM">UMKM</option>
                    <option value="E-Commerce">E-Commerce</option>
                    <option value="SaaS">SaaS</option>
                    <option value="Media">Media / Berita</option>
                    <option value="Portofolio">Portofolio</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>

              {/* Deskripsi */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Deskripsi Singkat</label>
                <textarea
                  rows={2}
                  placeholder="Jelaskan fitur-fitur utama dan kegunaan website ini..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Repository GitHub */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">URL GitHub / Repository (Opsional)</label>
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs"
                />
              </div>

              {/* Custom Screenshot (Opsional bila ingin ganti manual) */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-600 text-xs">Ubah Gambar Manual (Opsional)</label>
                  <div className="flex items-center gap-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setImageInputMode('url')}
                      className={`px-2 py-0.5 rounded-md font-semibold ${
                        imageInputMode === 'url' ? 'bg-emerald-700 text-white' : 'text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      URL Gambar
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageInputMode('upload')}
                      className={`px-2 py-0.5 rounded-md font-semibold ${
                        imageInputMode === 'upload' ? 'bg-emerald-700 text-white' : 'text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      Upload File
                    </button>
                  </div>
                </div>

                {imageInputMode === 'url' ? (
                  <input
                    type="text"
                    placeholder="URL gambar (otomatis terisi dari link demo)"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-mono"
                  />
                ) : (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-100 file:text-emerald-800 hover:file:bg-emerald-200 cursor-pointer"
                    />
                    {uploadingImage && <span className="text-xs text-emerald-700 mt-1 block">Sedang mengunggah...</span>}
                  </div>
                )}

                {/* Preview Image */}
                {formData.image && (
                  <div className="mt-2 flex items-center gap-3">
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className="w-20 h-14 object-cover rounded-lg border border-slate-300"
                    />
                    <span className="text-[11px] text-slate-400 truncate max-w-sm">
                      {formData.image}
                    </span>
                  </div>
                )}
              </div>

              {/* Tags, Klien, Tahun */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Teknologi Stack (pisahkan koma)</label>
                  <input
                    type="text"
                    placeholder="React, Next.js, Tailwind"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Klien / Nama Bisnis</label>
                  <input
                    type="text"
                    placeholder="Contoh: PT Harapan Jaya"
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Tahun Rilis</label>
                  <input
                    type="text"
                    placeholder="2026"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Toggle Featured */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <label htmlFor="isFeatured" className="font-semibold text-slate-700 cursor-pointer">
                  Tampilkan sebagai Proyek Unggulan (Carousel Utama)
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-800 hover:bg-brand-900 text-white font-bold shadow-md"
                >
                  {editingItem ? 'Simpan Perubahan' : 'Tambahkan ke Katalog'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
