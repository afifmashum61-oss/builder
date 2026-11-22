import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import KatalogPage from './pages/KatalogPage';
import AdminPage from './pages/AdminPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProjectDetailModal from './components/ProjectDetailModal';
import FloatingControls from './components/FloatingControls';
import { defaultWebsites } from './data/defaultWebsites';
import { subscribeToFirebaseWebsites, fetchWebsitesFromFirebase, filterDeleted } from './services/websiteService';

export default function App() {
  const [websites, setWebsites] = useState(() => {
    const saved = localStorage.getItem('afifedu_websites');
    if (saved) {
      try { return filterDeleted(JSON.parse(saved)); } catch {}
    }
    return filterDeleted(defaultWebsites);
  });
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const reloadWebsites = async () => {
    try {
      const data = await fetchWebsitesFromFirebase();
      if (data && data.length >= 0) {
        setWebsites(data);
      }
    } catch (e) {
      console.warn("Reload websites warning:", e);
    }
  };

  const fetchWebsites = reloadWebsites;

  useEffect(() => {
    // 1. Initial fetch
    fetchWebsitesFromFirebase().then((data) => {
      if (data) {
        setWebsites(data);
      }
      setLoading(false);
    }).catch(() => setLoading(false));

    // 2. Real-time Cloud Firestore synchronization
    const unsubscribe = subscribeToFirebaseWebsites(
      (realtimeWebsites) => {
        if (realtimeWebsites) {
          setWebsites(realtimeWebsites);
        }
        setLoading(false);
      },
      (err) => {
        console.warn('Firebase real-time sync notice:', err);
        setLoading(false);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF9] text-slate-800">
      <Routes>
        {/* Halaman Admin Terpisah (URL: /admin & /login) */}
        <Route 
          path="/admin" 
          element={
            <AdminPage 
              websites={websites}
              onUpdateWebsites={setWebsites}
              onWebsitesChanged={fetchWebsites} 
            />
          } 
        />
        <Route 
          path="/login" 
          element={
            <AdminPage 
              websites={websites}
              onUpdateWebsites={setWebsites}
              onWebsitesChanged={fetchWebsites} 
            />
          } 
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
