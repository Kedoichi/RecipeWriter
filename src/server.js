require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const recipeRoutes = require('./routes/recipe-routes');

const app = express();
const uri = process.env.MONGODB_URI;

// Create MongoDB client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logger
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

// MongoDB Connection and Server Start
async function startServer() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB!");

    // Test the connection
    await client.db("admin").command({ ping: 1 });
    console.log("MongoDB connection tested successfully!");

    // Make the client available to routes
    app.locals.db = client.db(); // Store db instance for use in routes

    // Routes
    app.use('/api/recipes', recipeRoutes);

    // Health check
    app.get('/api/health', (req, res) => {
      res.json({ 
        status: 'healthy',
        mongodb: 'connected'
      });
    });

    // 404 handler
    app.use((req, res) => {
      res.status(404).json({ message: 'Route not found' });
    });

    // Error handler
    app.use((err, req, res, next) => {
      console.error('Error:', err);

      if (err.name === 'ValidationError') {
        return res.status(400).json({
          message: 'Validation Error',
          errors: Object.values(err.errors).map(e => e.message)
        });
      }

      if (err.name === 'CastError') {
        return res.status(400).json({
          message: 'Invalid ID format'
        });
      }

      res.status(err.status || 500).json({
        message: err.message || 'Something went wrong!',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
      });
    });

    // Start server
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('SIGTERM received. Shutting down gracefully');
      server.close(async () => {
        await client.close();
        console.log('MongoDB connection closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

// Start the server
startServer().catch(console.error);

module.exports = app;