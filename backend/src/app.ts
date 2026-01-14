import express, { Application } from 'express';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/authRoutes';
import boardRoutes from './routes/boardRoutes';
import streamRoutes from './routes/streamRoutes';
import subjectRoutes from './routes/subjectRoutes';
import noteRoutes from './routes/noteRoutes';
import orderRoutes from './routes/orderRoutes';
import contactRoutes from './routes/contactRoutes';
import { errorHandler } from './middleware/errorHandler';

/**
 * Initialize Express application
 */
const app: Application = express();

/**
 * Middleware
 */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Serve static files (uploaded PDFs)
 */
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

/**
 * API Routes
 */
app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/streams', streamRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);

/**
 * Health check route
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

/**
 * API status route (no database required)
 */
app.get('/api/status', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    endpoints: {
      auth: '/api/auth',
      boards: '/api/boards',
      streams: '/api/streams',
      subjects: '/api/subjects',
      notes: '/api/notes',
      orders: '/api/orders',
    },
    database: 'Connect MongoDB to enable all features - see MONGODB_SETUP.md',
  });
});

/**
 * 404 handler
 */
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

/**
 * Global error handler
 */
app.use(errorHandler);

export default app;
