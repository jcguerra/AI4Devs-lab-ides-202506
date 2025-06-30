import { Router } from 'express';
import candidateRoutes from './candidate.routes';
import documentRoutes from './document.routes';

const router = Router();

// Versioning de la API
const API_VERSION = process.env.API_VERSION || 'v1';

// Rutas principales
router.use(`/api/${API_VERSION}/candidates`, candidateRoutes);
router.use(`/api/${API_VERSION}`, documentRoutes);

// Ruta de health check
router.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: API_VERSION,
    service: 'ATS Backend'
  });
});

export default router; 