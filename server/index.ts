import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import { generalLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import { checkDbHealth } from './db';
import logger from './utils/logger';

// Routes
import authRoutes from './routes/auth.routes';
import organizationsRoutes from './routes/organizations.routes';
import projectsRoutes from './routes/projects.routes';
import sourcesRoutes from './routes/sources.routes';
import processingRoutes from './routes/processing.routes';
import datasetsRoutes from './routes/datasets.routes';
import integrationsRoutes from './routes/integrations.routes';

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

// Security middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use('/api', generalLimiter);

// Health check
app.get('/api/health', async (_req, res) => {
  const dbHealthy = await checkDbHealth();
  res.json({
    status: dbHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    database: dbHealthy ? 'connected' : 'disconnected',
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/organizations', organizationsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/projects/:projectId/sources', sourcesRoutes);
app.use('/api/projects/:projectId/processing-runs', processingRoutes);
app.use('/api/projects/:projectId/datasets', datasetsRoutes);
app.use('/api/organizations/:organizationId/integrations', integrationsRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const publicPath = path.join(__dirname, '../dist/public');
  app.use(express.static(publicPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });
}

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app;
