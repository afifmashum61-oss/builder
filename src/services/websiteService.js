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

// 1. Ambil semua website dari Cloud Firestore
export const fetchWebsitesFromFirebase = async () => {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(colRef);
    
    if (snapshot.empty) {
      // Jika Firestore masih kosong, kita inisialisasi dengan data default
      await seedFirestoreDefaults();
      return defaultWebsites;
    }

    const items = [];
    snapshot.forEach((docSnap) => {
      items.push({ id: docSnap.id, ...docSnap.data() });
    });

    // Urutkan dari yang terbaru
    items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return items;
  } catch (error) {
    console.warn("Firestore fetch error, fallback ke penyimpanan lokal:", error);
    const saved = localStorage.getItem("afifedu_websites");
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return defaultWebsites;
  }
};

// 2. Real-time Subscription (Sinkronisasi Otomatis Tanpa Refresh)
export const subscribeToFirebaseWebsites = (onUpdate, onError) => {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (snapshot.empty) {
          onUpdate(defaultWebsites);
          return;
        }
        const items = [];
        snapshot.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...docSnap.data() });
        });
        items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        localStorage.setItem("afifedu_websites", JSON.stringify(items));
        onUpdate(items);
      },
      (error) => {
        console.warn("Real-time listener warning:", error);
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

// 5. Hapus Website dari Cloud Firestore
export const deleteWebsiteFromFirebase = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.warn("Gagal hapus dari Firebase, hapus lokal:", error);
    const saved = localStorage.getItem("afifedu_websites");
    if (saved) {
      const current = JSON.parse(saved);
      const updated = current.filter((w) => w.id !== id);
      localStorage.setItem("afifedu_websites", JSON.stringify(updated));
    }
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
