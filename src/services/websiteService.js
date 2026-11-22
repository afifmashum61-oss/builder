import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot 
} from "firebase/firestore";
import { db } from "../firebase";
import { defaultWebsites } from "../data/defaultWebsites";

const COLLECTION_NAME = "websites";

// Helper: Catat ID yang sudah dihapus agar tidak pernah muncul lagi dari data bawaan
export const addDeletedId = (id) => {
  try {
    const saved = localStorage.getItem("afifedu_deleted_ids");
    const ids = saved ? JSON.parse(saved) : [];
    if (!ids.includes(id)) {
      ids.push(id);
      localStorage.setItem("afifedu_deleted_ids", JSON.stringify(ids));
    }
  } catch (e) {
    console.warn("Gagal simpan status hapus:", e);
  }
};

// Helper: Filter website agar website yang dihapus tidak pernah tampil
export const filterDeleted = (items) => {
  if (!Array.isArray(items)) return [];
  try {
    const saved = localStorage.getItem("afifedu_deleted_ids");
    if (!saved) return items;
    const deletedIds = JSON.parse(saved);
    if (!Array.isArray(deletedIds) || deletedIds.length === 0) return items;
    return items.filter((item) => !deletedIds.includes(item.id));
  } catch {
    return items;
  }
};

// 1. Ambil semua website dari Cloud Firestore
export const fetchWebsitesFromFirebase = async () => {
  try {
    if (!db) {
      const saved = localStorage.getItem("afifedu_websites");
      if (saved) {
        try { return filterDeleted(JSON.parse(saved)); } catch {}
      }
      return filterDeleted(defaultWebsites);
    }

    const colRef = collection(db, COLLECTION_NAME);
    
    // Timeout 3 detik agar halaman tidak pernah macet
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Timeout koneksi Firestore")), 3000)
    );
    const snapshot = await Promise.race([getDocs(colRef), timeoutPromise]);
    
    if (snapshot.empty) {
      const initial = filterDeleted(defaultWebsites);
      seedFirestoreDefaults().catch(() => {});
      return initial;
    }

    const items = [];
    snapshot.forEach((docSnap) => {
      items.push({ id: docSnap.id, ...docSnap.data() });
    });

    // Urutkan dari yang terbaru dan buang item yang sudah dihapus
    items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    const filtered = filterDeleted(items);
    localStorage.setItem("afifedu_websites", JSON.stringify(filtered));
    return filtered;
  } catch (error) {
    console.warn("Firestore fetch error, fallback ke penyimpanan lokal:", error);
    const saved = localStorage.getItem("afifedu_websites");
    if (saved) {
      try { return filterDeleted(JSON.parse(saved)); } catch {}
    }
    return filterDeleted(defaultWebsites);
  }
};

// 2. Real-time Subscription (Sinkronisasi Otomatis Tanpa Refresh)
export const subscribeToFirebaseWebsites = (onUpdate, onError) => {
  if (!db) return () => {};
  try {
    const colRef = collection(db, COLLECTION_NAME);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (snapshot.empty) {
          const initial = filterDeleted(defaultWebsites);
          onUpdate(initial);
          return;
        }
        const items = [];
        snapshot.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...docSnap.data() });
        });
        items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        const filtered = filterDeleted(items);
        localStorage.setItem("afifedu_websites", JSON.stringify(filtered));
        onUpdate(filtered);
      },
      (error) => {
        console.warn("Real-time listener notice:", error);
        const saved = localStorage.getItem("afifedu_websites");
        if (saved) {
          try { onUpdate(filterDeleted(JSON.parse(saved))); return; } catch {}
        }
        onUpdate(filterDeleted(defaultWebsites));
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.warn("Gagal inisialisasi real-time listener:", err);
    return () => {};
  }
};

// 3. Tambah Website Baru ke Cloud Firestore
export const addWebsiteToFirebase = async (websiteData) => {
  const id = websiteData.id || "web-" + Date.now();
  const docRef = doc(db, COLLECTION_NAME, id);
  
  const payload = {
    ...websiteData,
    id,
    createdAt: websiteData.createdAt || new Date().toISOString()
  };

  try {
    await setDoc(docRef, payload);
    return { success: true, data: payload };
  } catch (error) {
    console.error("Gagal simpan ke Firebase:", error);
    // Simpan lokal sebagai cadangan
    const saved = localStorage.getItem("afifedu_websites");
    const current = saved ? JSON.parse(saved) : defaultWebsites;
    const updated = [payload, ...current];
    localStorage.setItem("afifedu_websites", JSON.stringify(updated));
    return { success: true, data: payload, offline: true };
  }
};

// 4. Update Website di Cloud Firestore
export const updateWebsiteInFirebase = async (id, updatedFields) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...updatedFields,
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    console.warn("Gagal update ke Firebase, update lokal:", error);
    const saved = localStorage.getItem("afifedu_websites");
    if (saved) {
      const current = JSON.parse(saved);
      const updated = current.map((w) => (w.id === id ? { ...w, ...updatedFields } : w));
      localStorage.setItem("afifedu_websites", JSON.stringify(updated));
    }
    return { success: true, offline: true };
  }
};

// 5. Hapus Website dari Cloud Firestore & Cache Lokal
export const deleteWebsiteFromFirebase = async (id) => {
  // Catat ID ke daftar terhapus agar tidak muncul lagi dari default/cache
  addDeletedId(id);

  // Hapus dari localStorage
  const saved = localStorage.getItem("afifedu_websites");
  if (saved) {
    try {
      const current = JSON.parse(saved);
      const updated = current.filter((w) => w.id !== id);
      localStorage.setItem("afifedu_websites", JSON.stringify(updated));
    } catch {}
  }

  try {
    if (db) {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    }
    return { success: true };
  } catch (error) {
    console.warn("Gagal hapus dari Firebase, hapus lokal:", error);
    return { success: true, offline: true };
  }
};

// 6. Inisialisasi data awal ke Firebase
export const seedFirestoreDefaults = async () => {
  try {
    for (const item of defaultWebsites) {
      const docRef = doc(db, COLLECTION_NAME, item.id);
      await setDoc(docRef, item);
    }
  } catch (err) {
    console.warn("Gagal seeding default ke Firebase:", err);
  }
};
