import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Path to data file and upload folder
const DATA_DIR = path.join(__dirname, '../data');
const DATA_FILE = path.join(DATA_DIR, 'websites.json');
const UPLOAD_DIR = path.join(__dirname, '../uploads');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Static serve uploads
app.use('/uploads', express.static(UPLOAD_DIR));

// Static serve frontend build (dist)
const DIST_DIR = path.join(__dirname, '../dist');
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
}

// Setup multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'web-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Hanya file gambar yang diperbolehkan!'));
    }
  }
});

// Helper: read data
function getWebsites() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading websites file:', err);
    return [];
  }
}

// Helper: write data
function saveWebsites(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving websites file:', err);
    return false;
  }
}

// Routes

// 1. Get all websites with optional filter/search
app.get('/api/websites', (req, res) => {
  const { category, search, featured } = req.query;
  let items = getWebsites();

  if (category && category !== 'Semua') {
    items = items.filter(w => w.category?.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const query = search.toLowerCase();
    items = items.filter(w => 
      w.title.toLowerCase().includes(query) ||
      (w.description && w.description.toLowerCase().includes(query)) ||
      (w.category && w.category.toLowerCase().includes(query)) ||
      (w.tags && w.tags.some(t => t.toLowerCase().includes(query)))
    );
  }

  if (featured === 'true') {
    items = items.filter(w => w.isFeatured);
  }

  res.json({ success: true, count: items.length, data: items });
});

// 2. Get single website
app.get('/api/websites/:id', (req, res) => {
  const items = getWebsites();
  const index = items.findIndex(w => w.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Website tidak ditemukan' });
  }

  // increment view
  items[index].views = (items[index].views || 0) + 1;
  saveWebsites(items);

  res.json({ success: true, data: items[index] });
});

// 3. Create website
app.post('/api/websites', (req, res) => {
  const {
    title,
    category,
    description,
    demoUrl,
    githubUrl,
    image,
    tags,
    isFeatured,
    client,
    year
  } = req.body;

  if (!title) {
    return res.status(400).json({ success: false, message: 'Judul website wajib diisi' });
  }

  const items = getWebsites();
  const slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  const newWebsite = {
    id: 'web-' + Date.now(),
    title: title.trim(),
    slug: slug + '-' + Math.floor(Math.random() * 1000),
    category: category || 'Umum',
    description: description || '',
    demoUrl: demoUrl || '',
    githubUrl: githubUrl || '',
    image: image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80',
    tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
    isFeatured: Boolean(isFeatured),
    views: 0,
    createdAt: new Date().toISOString(),
    client: client || '',
    year: year || new Date().getFullYear().toString()
  };

  items.unshift(newWebsite);
  saveWebsites(items);

  res.status(201).json({ success: true, message: 'Website berhasil disimpan ke katalog!', data: newWebsite });
});

// 4. Update website
app.put('/api/websites/:id', (req, res) => {
  const items = getWebsites();
  const index = items.findIndex(w => w.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Website tidak ditemukan' });
  }

  const existing = items[index];
  const {
    title,
    category,
    description,
    demoUrl,
    githubUrl,
    image,
    tags,
    isFeatured,
    client,
    year
  } = req.body;

  items[index] = {
    ...existing,
    title: title !== undefined ? title : existing.title,
    category: category !== undefined ? category : existing.category,
    description: description !== undefined ? description : existing.description,
    demoUrl: demoUrl !== undefined ? demoUrl : existing.demoUrl,
    githubUrl: githubUrl !== undefined ? githubUrl : existing.githubUrl,
    image: image !== undefined ? image : existing.image,
    tags: tags !== undefined ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : existing.tags,
    isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : existing.isFeatured,
    client: client !== undefined ? client : existing.client,
    year: year !== undefined ? year : existing.year,
    updatedAt: new Date().toISOString()
  };

  saveWebsites(items);
  res.json({ success: true, message: 'Website berhasil diperbarui!', data: items[index] });
});

// 5. Delete website
app.delete('/api/websites/:id', (req, res) => {
  let items = getWebsites();
  const exists = items.some(w => w.id === req.params.id);
  if (!exists) {
    return res.status(404).json({ success: false, message: 'Website tidak ditemukan' });
  }

  items = items.filter(w => w.id !== req.params.id);
  saveWebsites(items);

  res.json({ success: true, message: 'Website berhasil dihapus dari katalog!' });
});

// 6. Upload image screenshot
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Tidak ada file yang diunggah' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, url: fileUrl, filename: req.file.filename });
});

// 7. Stats for admin
app.get('/api/stats', (req, res) => {
  const items = getWebsites();
  const categories = [...new Set(items.map(i => i.category || 'Umum'))];
  const totalViews = items.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const featuredCount = items.filter(i => i.isFeatured).length;

  res.json({
    success: true,
    data: {
      totalWebsites: items.length,
      categoriesCount: categories.length,
      categories,
      totalViews,
      featuredCount
    }
  });
});

// 8. Simple admin auth check (default PIN: 123456)
app.post('/api/auth/verify', (req, res) => {
  const { pin } = req.body;
  if (pin === '123456' || pin === 'admin123') {
    res.json({ success: true, token: 'webkita-admin-session-auth' });
  } else {
    res.status(401).json({ success: false, message: 'PIN Admin salah! (Default: 123456)' });
  }
});

// SPA fallback for React Router
if (fs.existsSync(DIST_DIR)) {
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      res.sendFile(path.join(DIST_DIR, 'index.html'));
    }
  });
}

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
