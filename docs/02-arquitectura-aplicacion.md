# Arquitectura de la Aplicación - Sistema ATS

## Visión General de la Arquitectura

El sistema ATS sigue una arquitectura de **3 capas** con separación entre frontend, backend y base de datos, implementada con tecnologías modernas y patrones de diseño escalables.

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Layer                       │
│              React + TypeScript + SPA                   │
└─────────────────────────┬───────────────────────────────┘
                          │ HTTP/REST API
┌─────────────────────────▼───────────────────────────────┐
│                    Backend Layer                        │
│           Node.js + Express + TypeScript                │
│     ┌─────────────┬─────────────┬─────────────────────┐ │
│     │ Controllers │  Services   │     Middleware      │ │
│     └─────────────┴─────────────┴─────────────────────┘ │
└─────┬───────────────────┬───────────────────────────────┘
      │ Prisma ORM        │ MinIO SDK
┌─────▼─────────────┐   ┌─▼───────────┐   ┌─────────────┐
│   PostgreSQL      │   │    MinIO    │   │   Mailpit   │
│   Database        │   │  (Storage)  │   │   (Email)   │
└───────────────────┘   └─────────────┘   └─────────────┘
```

## Stack Tecnológico

### Frontend
- **Framework**: React 18.3.1
- **Lenguaje**: TypeScript 4.9.5
- **Build Tool**: Create React App
- **Testing**: Jest + React Testing Library
- **UI/UX**: CSS personalizado (futuro: Material-UI o Tailwind CSS)
- **HTTP Client**: Fetch API (futuro: Axios)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 4.19.2
- **Lenguaje**: TypeScript 4.9.5
- **ORM**: Prisma 5.13.0
- **Documentación API**: Swagger UI Express
- **Testing**: Jest + Supertest
- **Linting**: ESLint + Prettier

### Base de Datos
- **Motor**: PostgreSQL 
- **Gestión de esquemas**: Prisma Migrations
- **Conexión**: Prisma Client

### DevOps e Infraestructura
- **Contenedorización**: Docker Compose
- **Environment**: Variables de entorno con dotenv
- **Build**: TypeScript Compiler
- **Almacenamiento**: MinIO (S3-compatible)
- **Email Testing**: Mailpit

## Patrones de Arquitectura

### 1. Arquitectura por Capas (Layered Architecture)

```
📁 Backend Structure
├── src/
│   ├── controllers/     # Capa de Presentación
│   ├── services/        # Capa de Lógica de Negocio  
│   ├── repositories/    # Capa de Acceso a Datos
│   ├── middleware/      # Cross-cutting concerns
│   ├── types/          # Definiciones de tipos
│   ├── utils/          # Utilidades compartidas
│   └── config/         # Configuración de la aplicación
```

### 2. Repository Pattern
Abstracción de la capa de acceso a datos para facilitar testing y mantenibilidad.

```typescript
// Ejemplo de Repository Pattern para Candidatos
interface CandidateRepository {
  create(data: CreateCandidateDto): Promise<Candidate>;
  findById(id: number): Promise<Candidate | null>;
  findByEmail(email: string): Promise<Candidate | null>;
  update(id: number, data: UpdateCandidateDto): Promise<Candidate>;
  delete(id: number): Promise<void>;
  findAll(filters?: CandidateFilters): Promise<Candidate[]>;
}
```

### 3. Service Layer Pattern
Encapsulación de la lógica de negocio en servicios reutilizables.

```typescript
// Ejemplo de Service Layer para Candidatos
class CandidateService {
  constructor(
    private candidateRepo: CandidateRepository,
    private documentService: DocumentService,
    private emailService: EmailService
  ) {}

  async createCandidate(data: CreateCandidateDto, recruiterId: number): Promise<Candidate> {
    // Lógica de negocio para crear candidato
    // Validaciones, transformaciones, notificaciones, etc.
  }
}
```

## Flujo de Datos - Añadir Candidato

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   React     │────│  Express    │────│  Service    │────│ Repository  │
│ Component   │    │ Controller  │    │   Layer     │    │   Layer     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       │ 1. POST /candidates│                   │                   │
       ├──────────────────►│                   │                   │
       │                   │ 2. Validate & Call│                   │
       │                   ├──────────────────►│                   │
       │                   │                   │ 3. Business Logic │
       │                   │                   │ & Data Validation │
       │                   │                   ├──────────────────►│
       │                   │                   │                   │ 4. Prisma
       │                   │                   │                   │    Query
       │                   │                   │ 5. Return Entity  │
       │                   │                   │◄──────────────────┤
       │                   │ 6. Return Response│                   │
       │                   │◄──────────────────┤                   │
       │ 7. Update UI State│                   │                   │
       │◄──────────────────┤                   │                   │
```

## Seguridad y Middleware

### Middleware Stack
```typescript
// Orden de middleware en Express
app.use(cors());                    // CORS configuration
app.use(helmet());                  // Security headers
app.use(express.json());           // JSON parsing
app.use(express.urlencoded());     // URL encoding
app.use(morgan('combined'));       // Logging
app.use(authMiddleware);           // Authentication
app.use(validationMiddleware);     // Request validation
app.use(errorHandler);             // Error handling
```

### Gestión de Archivos con MinIO
```
📁 File Upload Architecture
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │────│   Multer    │────│   MinIO     │────│   Database  │
│ File Input  │    │ Middleware  │    │  Storage    │    │  Metadata   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                          │
                   ┌─────────────┐
                   │ Validation  │
                   │ - File Type │ 
                   │ - File Size │
                   │ - Virus Scan│
                   └─────────────┘
```

### Arquitectura de Servicios Docker
```
┌─────────────────────────────────────────────────────────────────┐
│                        Docker Compose                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │ PostgreSQL  │  │    MinIO    │  │   Mailpit   │  │ Backend │ │
│  │   Port:     │  │   Port:     │  │   Port:     │  │  Port:  │ │
│  │   5432      │  │ 9000/9001   │  │ 1025/8025   │  │  3001   │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## API Design

### RESTful Endpoints para Candidatos
```
GET    /api/v1/candidates           # Listar candidatos
POST   /api/v1/candidates           # Crear candidato
GET    /api/v1/candidates/:id       # Obtener candidato
PUT    /api/v1/candidates/:id       # Actualizar candidato
DELETE /api/v1/candidates/:id       # Eliminar candidato

# Gestión de documentos con MinIO
POST   /api/v1/candidates/:id/documents     # Subir documento a MinIO
GET    /api/v1/candidates/:id/documents     # Listar documentos
GET    /api/v1/documents/:docId/download    # Descargar documento desde MinIO
DELETE /api/v1/candidates/:id/documents/:docId  # Eliminar documento

# Utilidades
GET    /api/v1/documents/:docId/presigned-url  # URL pre-firmada para descarga
POST   /api/v1/upload/presigned-url            # URL pre-firmada para subida
```

### Formato de Respuesta Estándar
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    pagination?: PaginationMeta;
    timestamp: string;
  };
}
```

## Escalabilidad y Performance

### Estrategias de Optimización
1. **Base de Datos**: Índices en campos de búsqueda frecuente
2. **API**: Paginación para listados grandes
3. **Archivos**: MinIO para almacenamiento distribuido (local), migración a AWS S3 (producción)
4. **Cache**: Redis para sesiones y datos frecuentes (futuro)
5. **CDN**: Para assets estáticos (futuro)
6. **Email**: Mailpit para desarrollo, servicios como SendGrid para producción

### Monitoreo y Observabilidad
1. **Logging**: Structured logging con Winston
2. **Métricas**: Health checks endpoints
3. **Error Tracking**: Centralización de errores
4. **Performance**: Monitoring de tiempo de respuesta 