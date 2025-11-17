require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const morgan = require('morgan');
const pool = require('./db/database');

const detectionRoutes = require('./routes/detection');
const reportsRoutes = require('./routes/reports');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Attach io instance to app for use in routes
app.set('io', io);

// Routes
app.use('/api/detection', detectionRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
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

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 8000;

// Test database connection before starting
async function startServer() {
  try {
    console.log('Testing database connection...');
    const connected = await pool.testConnection();
    if (!connected) {
      console.error('❌ Database connection failed!');
      console.error('Please check:');
      console.error('1. Is PostgreSQL running?');
      console.error('2. Has the database "agent_security" been created?');
      console.error('3. Is DATABASE_URL in .env file correct?');
      console.error('\nRun "npm run db:init" to initialize the database');
      process.exit(1);
    }

    server.listen(PORT, () => {
      console.log(`\n✅ Server running on port ${PORT}`);
      console.log(`✅ Database connection successful`);
      console.log(`\nFrontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
      console.log(`API URL: http://localhost:${PORT}/api\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  pool.end().then(() => {
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
});

startServer();