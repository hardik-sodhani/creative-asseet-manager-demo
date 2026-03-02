const express = require('express');
const cors = require('cors');
const assetRoutes = require('./routes/assets');
const { initializeDatabase } = require('../db/database');

const PORT = process.env.PORT || 3001;
const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

/**
 * Initialize the database and start the Express server.
 * Ensures the database schema exists before accepting requests.
 */
async function startServer() {
  try {
    initializeDatabase();
    console.log('Database initialized successfully');

    // Register routes
    app.use('/api/assets', assetRoutes);

    // Health check endpoint
    app.get('/api/health', (req, res) => {
      res.json({ success: true, data: { status: 'healthy', timestamp: new Date().toISOString() } });
    });

    // Global error handler
    app.use((err, req, res, next) => {
      console.error('Unhandled server error:', err.message);
      res.status(500).json({
        success: false,
        error: 'An internal server error occurred. Please try again later.',
      });
    });

    app.listen(PORT, () => {
      console.log(`Creative Asset Manager API running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
