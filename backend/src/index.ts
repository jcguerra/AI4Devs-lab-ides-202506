import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import { corsMiddleware } from './middleware/cors.middleware';
import { errorHandler } from './middleware/error.middleware';
import routes from './routes';

// Configuración de variables de entorno
dotenv.config();

// Inicialización de Prisma
const prisma = new PrismaClient();

// Creación de la aplicación Express
export const app = express();

// Puerto del servidor
const port = parseInt(process.env.PORT || '3010');

// Middleware de seguridad y configuración
app.use(helmet());
app.use(corsMiddleware);
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use(routes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'ATS Backend API',
    version: process.env.API_VERSION || 'v1',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Cerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor ATS ejecutándose en http://localhost:${port}`);
  console.log(`📚 API Health Check: http://localhost:${port}/api/health`);
  console.log(`📋 API Candidatos: http://localhost:${port}/api/v1/candidates`);
});

export default prisma;
