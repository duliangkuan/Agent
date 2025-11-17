// Vercel Serverless Functions wrapper for Express app
// This adapts the Express app to work with Vercel's serverless environment

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Import routes (without Socket.io for serverless)
const detectionRoutes = require('../backend/src/routes/detection');
const reportsRoutes = require('../backend/src/routes/reports');
const dashboardRoutes = require('../backend/src/routes/dashboard');
const pool = require('../backend/src/db/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Mock Socket.io for serverless (routes will check if io exists)
// In serverless, we'll use polling instead of WebSocket
app.set('io', null);

// Routes
app.use('/api/detection', detectionRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running on Vercel' });
});

// Database health check
app.get('/api/health/db', async (req, res) => {
  try {
    const connected = await pool.testConnection();
    if (connected) {
      res.json({ status: 'ok', message: 'Database connected' });
    } else {
      res.status(500).json({ status: 'error', message: 'Database connection failed' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Export for Vercel
module.exports = app;

