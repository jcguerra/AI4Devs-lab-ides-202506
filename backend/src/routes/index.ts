import { Router } from 'express';
import candidateRoutes from './candidate.routes';
import documentRoutes from './document.routes';

const router = Router();

// Rutas principales (sin prefijo /api/v1 porque ya se monta en index.ts)
router.use('/candidates', candidateRoutes);
router.use('/', documentRoutes);

// Ruta de health check adicional (pero la principal está en index.ts)
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: 'v1',
    service: 'ATS Backend API',
    endpoints: [
      'GET /api/v1/candidates',
      'POST /api/v1/candidates',
      'GET /api/v1/candidates/:id',
      'PUT /api/v1/candidates/:id',
      'DELETE /api/v1/candidates/:id',
      'GET /api/v1/candidates/search'
    ]
  });
});

export default router; 