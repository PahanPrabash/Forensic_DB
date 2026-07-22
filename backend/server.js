// ═══════════════════════════════════════════════════════════════════════════
// Forensic Medicine Department Database System — Backend API Server
// Clinical Forensic Examinations & Medico-Legal Reports
// ═══════════════════════════════════════════════════════════════════════════

// Load environment variables FIRST — must be before any other imports
// that read process.env (e.g., config/db.js)
import 'dotenv/config';

import express from 'express';
import cors from 'cors';

// Route imports
import mlefRoutes from './routes/mlefRoutes.js';
import mlrRoutes from './routes/mlrRoutes.js';
import authRoutes from './routes/authRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import caseRoutes from './routes/caseRoutes.js';
import evidenceRoutes from './routes/evidenceRoutes.js';
import autopsyRoutes from './routes/autopsyRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import referralRoutes from './routes/referralRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── API Routes ──────────────────────────────────────────────────────────
app.use('/api/mlef', mlefRoutes);
app.use('/api/mlr', mlrRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/evidence', evidenceRoutes);
app.use('/api/autopsies', autopsyRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);

// ─── Health Check ────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Forensic Medicine DB API',
    module: 'Clinical Forensic & MLR',
    timestamp: new Date().toISOString()
  });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Global Error Handler ────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ─── Start Server ────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🏥 Forensic Medicine DB API Server`);
  console.log(`   Module: Clinical Forensic & MLR`);
  console.log(`   Running on: http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
});

export default app;
