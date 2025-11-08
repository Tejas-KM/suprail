import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import { getMe } from './controllers/authController.js';
import { protect } from './middleware/authMiddleware.js';
import projectRoutes from './routes/projectRoutes.js';
import { upload } from './middleware/upload.js';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const app = express();
// Behind Render/Proxies, trust X-Forwarded-* headers for correct client IP
app.set('trust proxy', true);

// Simple request logger to aid debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Allow list for CORS origins. Set ALLOWED_ORIGINS in your host (comma-separated), e.g.
// ALLOWED_ORIGINS="https://your-frontend.vercel.app,https://app.example.com"
// Include localhost and the default Vercel app host by default; override with ALLOWED_ORIGINS in prod
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,https://apptest-xplp.vercel.app').split(',');
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (mobile apps, curl, same-origin)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('CORS policy: origin not allowed'), false);
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/uploads', express.static('uploads'));
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);


app.get('/api/me', protect, getMe);

// Proxy endpoint: forward image to ML server (allows browser to call over HTTPS)
// Accepts multipart upload with field 'file' and forwards to ML server configured by ML_SERVER_URL env
app.post('/api/predict', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    // Log received file info for debugging (path, size, mimetype)
    try {
      console.log('Predict proxy received file:', {
        hasBuffer: !!req.file.buffer,
        originalname: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
      });
    } catch (e) {
      console.error('Predict proxy file log error', e);
    }

  // Use ML_SERVER_URL from env when present; otherwise default to the new ML host.
  // Keep the /predict path to preserve existing behavior.
  const mlUrl = process.env.ML_SERVER_URL || 'https://supreme_ai.baipl-system.top/predict';

    const form = new FormData();
    // Append buffer directly; no temporary file needed
    form.append('file', req.file.buffer, {
      filename: req.file.originalname || 'upload.jpg',
      contentType: req.file.mimetype || 'application/octet-stream',
    });

    const headers = form.getHeaders();

    const mlRes = await axios.post(mlUrl, form, {
      headers,
      timeout: 120000,
    });

    res.json(mlRes.data);
  } catch (err) {
    // Detailed logging to help debug ML server failures from Render
    console.error('Predict proxy error - message:', err?.message);
    console.error('Predict proxy error - code:', err?.code);
    if (err?.response) {
      console.error('Predict proxy error - response status:', err.response.status);
      console.error('Predict proxy error - response data:', err.response.data);
    }
    const statusCode = err?.response?.status || 502;
    const details = err?.response?.data || err?.message || 'Prediction failed';
    res.status(statusCode).json({ error: 'Prediction failed', details });
  }
});

// Temporary debug endpoint to list registered routes
app.get('/api/debug/routes', (req, res) => {
  try {
    const routes = [];
    const stack = app._router && app._router.stack ? app._router.stack : [];
    stack.forEach((layer) => {
      try {
        if (layer.route && layer.route.path) {
          routes.push({ path: layer.route.path, methods: layer.route.methods });
        } else if (layer.name === 'router' && layer.handle && layer.handle.stack) {
          layer.handle.stack.forEach((handler) => {
            if (handler.route && handler.route.path) {
              routes.push({ path: handler.route.path, methods: handler.route.methods });
            }
          });
        }
      } catch (e) {
        // ignore per-layer errors
      }
    });
    res.json(routes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to enumerate routes' });
  }
});
// Serve frontend static files when available (single-service deployment)
try {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
  if (fs.existsSync(frontendDist)) {
    // Serve static build
    app.use(express.static(frontendDist));

    // Return index.html for any non-API route (client-side routing)
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();
      res.sendFile(path.join(frontendDist, 'index.html'));
    });
  }
} catch (err) {
  console.error('Error setting up frontend static serving:', err);
}
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch((err) => console.error(err));