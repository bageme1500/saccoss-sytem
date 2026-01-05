import express from 'express';
import cors from 'cors';
import database from './src/config/database.js';
import config from './src/config/env.js';
import apiRouter from './src/routes/index.js';
import { errorHandler, notFoundHandler } from './src/middleware/errorHandler.js';

const app = express();

// Middleware
app.use(cors({ origin: config.corsOrigin }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to SACCOS Management System API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      roles: '/api/roles',
      memberships: '/api/memberships',
      contributions: '/api/monthly_contributions',
      payments: '/api/payments',
    },
  });
});

app.use('/api', apiRouter);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await database.connect();

    // Start listening
    app.listen(config.port, () => {
      console.log(`Server running on http://localhost:${config.port}`);
      console.log(`Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await database.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nShutting down gracefully...');
  await database.close();
  process.exit(0);
});

