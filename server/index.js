const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { initDb } = require('./config/db');
const seed = require('./seed/seed');

const authRoutes = require('./routes/auth');
const leadRoutes = require('./routes/leads');
const analyticsRoutes = require('./routes/analytics');
const publicRoutes = require('./routes/public');

const app = express();
const PORT = process.env.PORT || 5001;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Client Lead Management CRM API Running', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/public', publicRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Serve frontend static assets if built
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('Client Lead Management CRM API is active.');
    }
  });
});

// Initialize database, seed if empty, and start server
async function startServer() {
  try {
    await initDb();
    await seed();
    app.listen(PORT, () => {
      console.log(`🚀 Mini CRM Server running on port ${PORT} (http://localhost:${PORT})`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
