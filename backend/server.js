// ═══════════════════════════════════════════════════════════════════════════
// Forensic Medicine Department Database System — Backend API Server
// Clinical Forensic Examinations & Medico-Legal Reports
// ═══════════════════════════════════════════════════════════════════════════

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

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

dotenv.config();

// Import routes
import authRoutes from './routes/auth.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import patientRoutes from './routes/patient.routes.js';
import caseRoutes from './routes/case.routes.js';
import mlefRoutes from './routes/mlef.routes.js';
import autopsyRoutes from './routes/autopsy.routes.js';
import evidenceRoutes from './routes/evidence.routes.js';
import labtestRoutes from './routes/labtest.routes.js';
import reportRoutes from './routes/report.routes.js';
import doctorRoutes from './routes/doctor.routes.js';

// Import middleware
import errorHandler from './middleware/errorHandler.js';

// Import DB pool (triggers connection test on load)
import './config/db.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Global Middleware ────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger (dev only)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// ─── API Routes ───────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/cases', caseRoutes);
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

// ─── Health Check ─────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Forensic Medicine DB API',
    module: 'Clinical Forensic & MLR',
    timestamp: new Date().toISOString()
  });
});

// ─── 404 Handler ──────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.url} not found.` });
});

// ─── Global Error Handler ─────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🏥 Forensic Medicine DB API Server`);
  console.log(`   Module: Clinical Forensic & MLR`);
  console.log(`   Running on: http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
});
