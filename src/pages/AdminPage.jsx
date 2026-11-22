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
  X
} from 'lucide-react';
import AfifeduLogo from '../components/AfifeduLogo';
import { defaultWebsites } from '../data/defaultWebsites';

export default function AdminPage({ onWebsitesChanged }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [websites, setWebsites] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  // Fetch admin data with fallback for Vercel
  const fetchData = async () => {
    setLoading(true);
    let list = [];
    try {
      const resWebsites = await fetch('/api/websites');
      const dataWeb = await resWebsites.json();
      if (dataWeb && dataWeb.success && Array.isArray(dataWeb.data)) {
        list = dataWeb.data;
      }
    } catch (err) {
      // offline / static Vercel
    }

    if (list.length === 0) {
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
    
    // Direct check for default PIN (123456 or admin123)
    if (pinInput === '123456' || pinInput === 'admin123') {
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
        setAuthError(data.message || 'PIN Admin Salah! (Default: 123456)');
      }
    } catch (err) {
      setAuthError('PIN Admin Salah! (Default: 123456)');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('webkita_admin_token');
    setIsAuthenticated(false);
    setPinInput('');
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

    // Also attempt API save
    try {
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
              Masukkan PIN Admin untuk mengelola penyimpanan katalog website.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Masukkan PIN (Default: 123456)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full text-center tracking-widest text-lg font-bold py-3.5 px-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                autoFocus
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                PIN default: <span className="font-mono font-bold text-slate-600">123456</span>
              </span>
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
                      <div className="flex items-center justify-end gap-2">
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
                  rows={3}
                  placeholder="Jelaskan fitur-fitur utama dan kegunaan website ini..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* URLs: Demo & Github */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">URL Live Demo (Link Website)</label>
                  <input
                    type="url"
                    placeholder="https://contoh-web.com"
                    value={formData.demoUrl}
                    onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs"
                  />
                </div>

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
              </div>

              {/* Screenshot / Gambar: Mode Upload atau URL */}
              <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 block">Gambar Screenshot Website</label>
                  <div className="flex items-center gap-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setImageInputMode('url')}
                      className={`px-2.5 py-1 rounded-lg font-semibold ${
                        imageInputMode === 'url' ? 'bg-emerald-700 text-white' : 'text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      URL Gambar
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageInputMode('upload')}
                      className={`px-2.5 py-1 rounded-lg font-semibold ${
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
                    placeholder="Masukkan URL screenshot (https://...)"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-mono"
                  />
                ) : (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-100 file:text-emerald-800 hover:file:bg-emerald-200 cursor-pointer"
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
