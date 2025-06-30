import cors from 'cors';

const corsOptions = {
  origin: [
    'http://localhost:3000',  // Frontend en desarrollo
    'http://localhost:3001',  // Frontend alternativo
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma'
  ]
};

export const corsMiddleware = cors(corsOptions); 