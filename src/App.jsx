import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import KatalogPage from './pages/KatalogPage';
import AdminPage from './pages/AdminPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProjectDetailModal from './components/ProjectDetailModal';
import FloatingControls from './components/FloatingControls';

export default function App() {
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  const fetchWebsites = async () => {
    try {
      const res = await fetch('/api/websites');
      const data = await res.json();
      if (data.success) {
        setWebsites(data.data);
      }
    } catch (err) {
      console.error('Failed to load websites:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebsites();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF9] text-slate-800">
      <Routes>
        {/* Halaman Admin Terpisah (URL: /admin) */}
        <Route 
          path="/admin" 
          element={<AdminPage onWebsitesChanged={fetchWebsites} />} 
        />
        
        {/* Halaman Publik (URL: /) */}
        <Route 
          path="/" 
          element={
            <>
              <Navbar />
              <main className="flex-1">
                <HomePage 
                  websites={websites} 
                  loading={loading} 
                  onSelectProject={setSelectedProject} 
                />
              </main>
              <Footer />
            </>
          } 
        />

        {/* Halaman Katalog Publik Lengkap (URL: /katalog) */}
        <Route 
          path="/katalog" 
          element={
            <>
              <Navbar />
              <main className="flex-1">
                <KatalogPage 
                  websites={websites} 
                  loading={loading} 
                  onSelectProject={setSelectedProject} 
                />
              </main>
              <Footer />
            </>
          } 
        />
      </Routes>

      {/* Modal Detail & Demo Website */}
      {selectedProject && (
        <ProjectDetailModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}

      {/* Floating Controls: Reading progress, WhatsApp chat, and Smooth Scroll-to-Top */}
      <FloatingControls />
    </div>
  );
}
