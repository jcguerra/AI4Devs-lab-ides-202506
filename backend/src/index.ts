import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { corsMiddleware } from './middleware/cors.middleware';
import routes from './routes';

// Configurar variables de entorno
dotenv.config();

// Crear instancia de Prisma
export const prisma = new PrismaClient();

// Crear aplicación Express
export const app = express();

// Configurar port
const port = process.env.PORT || 3010;

// Middleware de seguridad
app.use(helmet());

// Middleware de CORS
app.use(corsMiddleware);

// Middleware de logging
app.use(morgan('combined'));

// Middleware para parsear JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ruta de health check principal
app.get('/', (req, res) => {
  res.json({
    message: 'ATS Backend API',
    version: 'v1',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      candidates: '/api/v1/candidates',
      docs: '/api/docs'
    }
  });
});

// Ruta de health check para monitoreo
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: 'v1'
  });
});

// Montar rutas principales
app.use('/api/v1', routes);

// Middleware para rutas no encontradas (debe ir antes del error handler)
app.use(notFoundHandler);

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('🚨 Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Iniciar servidor solo si no estamos en testing
if (require.main === module) {
  app.listen(port, () => {
    console.log(`🚀 Servidor ATS ejecutándose en puerto ${port}`);
    console.log(`📋 Health check: http://localhost:${port}/api/health`);
    console.log(`🎯 API Base: http://localhost:${port}/api/v1`);
    console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
    
    // Verificar conexión a la base de datos
    prisma.$connect()
      .then(() => console.log('✅ Conexión a base de datos establecida'))
      .catch((error) => console.error('❌ Error conectando a base de datos:', error));
  });
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Cerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Cerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});
