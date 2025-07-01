# 🚀 Sistema ATS (Applicant Tracking System) - LTI

## 📋 Descripción General

El Sistema ATS es una aplicación web completa para la gestión de candidatos en procesos de reclutamiento y selección. Desarrollado con tecnologías modernas, proporciona una interfaz intuitiva para administrar candidatos, sus documentos, educación y experiencia laboral.

### 🎯 Características Principales

- ✅ **Gestión completa de candidatos** (CRUD)
- ✅ **Carga y gestión de documentos** (CV, cartas de presentación, certificados)
- ✅ **Gestión de educación y experiencia laboral**
- ✅ **Búsqueda y filtrado avanzado**
- ✅ **Notificaciones por email**
- ✅ **Interfaz responsiva y moderna**
- ✅ **Manejo robusto de errores**
- ✅ **Testing completo**
- ✅ **Almacenamiento distribuido con MinIO**
- ✅ **Base de datos PostgreSQL con Prisma ORM**

### 🛠️ Stack Tecnológico

#### Backend
- **Node.js** con TypeScript 4.9.5
- **Express.js** 4.19.2 como framework web
- **Prisma** 5.13.0 como ORM
- **PostgreSQL** como base de datos
- **MinIO** para almacenamiento de archivos
- **Jest** para testing
- **Joi** para validaciones
- **Nodemailer** para emails

#### Frontend
- **React** 18.3.1 con TypeScript
- **Material-UI** 5.17.1 para componentes
- **Axios** para comunicación con API
- **React Router** para navegación

#### DevOps
- **Docker Compose** para servicios
- **PostgreSQL** 15
- **MinIO** para almacenamiento S3-compatible
- **Mailpit** para testing de emails

---

## 📦 Instalación y Configuración

### Prerrequisitos

- **Node.js** 18.x o superior
- **npm** 9.x o superior
- **Docker** y **Docker Compose**
- **Git**

### 1. Clonar el Repositorio

```bash
git clone https://github.com/jcguerra/AI4Devs-lab-ides-202506
cd AI4Devs-lab-ides-202506
```

### 2. Configurar Variables de Entorno

#### Backend (.env)
Crear archivo `backend/.env`:

```env
# Base de datos
DATABASE_URL="postgresql://LTIdbUser:D1ymf8wyQEGthFR1E9xhCq@localhost:5432/LTIdb"

# Servidor
PORT=3010
NODE_ENV=development

# MinIO
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_NAME=ats-bucket

# Email (Mailpit para desarrollo)
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASS=
DEFAULT_RECRUITER_EMAIL=recruiter@ats.com
```

#### Frontend (.env)
Crear archivo `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:3010/api/v1
REACT_APP_MINIO_ENDPOINT=http://localhost:9000
```

### 3. Levantar Servicios Docker

```bash
# Levantar todos los servicios
docker-compose up -d

# Verificar que los servicios estén corriendo
docker-compose ps
```

**Servicios disponibles:**
- **PostgreSQL**: `localhost:5432`
- **MinIO API**: `localhost:9000`
- **MinIO Console**: `localhost:9001`
- **Mailpit SMTP**: `localhost:1025`
- **Mailpit Web**: `localhost:8025`

### 4. Configurar Base de Datos

```bash
cd backend

# Instalar dependencias
npm install

# Generar cliente Prisma
npm run prisma:generate

# Ejecutar migraciones
npx prisma migrate dev

# (Opcional) Poblar con datos de prueba
npm run prisma:seed
```

### 5. Configurar MinIO

1. **Acceder a MinIO Console**: http://localhost:9001
2. **Credenciales**: `minioadmin` / `minioadmin`
3. **Verificar bucket**: `ats-bucket` (se crea automáticamente)

### 6. Instalar Dependencias del Frontend

```bash
cd frontend
npm install
```

---

## 🚀 Ejecutar el Proyecto

### Desarrollo

#### Backend
```bash
cd backend
npm run dev
```
**Servidor disponible en**: http://localhost:3010

#### Frontend
```bash
cd frontend
npm start
```
**Aplicación disponible en**: http://localhost:3000

### Producción

#### Backend
```bash
cd backend
npm run build
npm start
```

#### Frontend
```bash
cd frontend
npm run build
# Servir archivos estáticos con nginx o similar
```

---

## 📚 Documentación de la API

### Base URL
```
http://localhost:3010/api/v1
```

### Endpoints Principales

#### 🔍 Health Check
```http
GET /
GET /api/health
```

#### 👥 Candidatos

##### Crear Candidato
```http
POST /candidates
Content-Type: application/json

{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan.perez@email.com",
  "phone": "+34612345678",
  "address": "Calle Mayor 123, Madrid",
  "educations": [
    {
      "institution": "Universidad Complutense",
      "degree": "Ingeniero Informático",
      "fieldOfStudy": "Informática",
      "startDate": "2018-09-01",
      "endDate": "2022-06-30",
      "isCurrent": false
    }
  ],
  "experiences": [
    {
      "company": "TechCorp",
      "position": "Desarrollador Full Stack",
      "startDate": "2022-07-01",
      "endDate": null,
      "isCurrent": true,
      "description": "Desarrollo de aplicaciones web"
    }
  ]
}
```

##### Obtener Todos los Candidatos
```http
GET /candidates?page=1&limit=10
```

##### Buscar Candidatos
```http
GET /candidates/search?q=Juan&page=1&limit=10
```

##### Obtener Candidato por ID
```http
GET /candidates/1
```

##### Actualizar Candidato
```http
PUT /candidates/1
Content-Type: application/json

{
  "firstName": "Juan Carlos",
  "lastName": "Pérez García"
}
```

##### Eliminar Candidato
```http
DELETE /candidates/1
```

#### 📄 Documentos

##### Subir Documento
```http
POST /candidates/1/documents
Content-Type: multipart/form-data

file: [archivo PDF/DOCX]
documentType: CV
```

##### Obtener Documentos de Candidato
```http
GET /candidates/1/documents
```

##### Descargar Documento
```http
GET /documents/1/download
```

##### Obtener URL de Descarga
```http
GET /documents/1/download-url
```

##### Eliminar Documento
```http
DELETE /documents/1
```

### Respuestas de la API

#### Respuesta Exitosa
```json
{
  "success": true,
  "data": {
    "id": 1,
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan.perez@email.com"
  },
  "meta": {
    "timestamp": "2025-01-30T10:30:00.000Z",
    "version": "v1"
  }
}
```

#### Respuesta de Error
```json
{
  "success": false,
  "error": {
    "type": "ValidationError",
    "message": "El email es obligatorio",
    "code": "VALIDATION_FAILED",
    "timestamp": "2025-01-30T10:30:00.000Z",
    "path": "/api/v1/candidates",
    "method": "POST",
    "requestId": "req-123"
  },
  "meta": {
    "timestamp": "2025-01-30T10:30:00.000Z",
    "version": "v1",
    "environment": "development"
  }
}
```

---

## 🐳 Servicios Docker

### PostgreSQL
- **Puerto**: 5432
- **Usuario**: LTIdbUser
- **Contraseña**: D1ymf8wyQEGthFR1E9xhCq
- **Base de datos**: LTIdb

**Comandos útiles:**
```bash
# Conectar a la base de datos
docker exec -it ats-db psql -U LTIdbUser -d LTIdb

# Ver logs
docker logs ats-db

# Reiniciar servicio
docker-compose restart db
```

### MinIO
- **API**: http://localhost:9000
- **Console Web**: http://localhost:9001
- **Usuario**: minioadmin
- **Contraseña**: minioadmin
- **Bucket**: ats-bucket

**Comandos útiles:**
```bash
# Ver logs
docker logs ats-minio

# Acceder al cliente MinIO
docker exec -it ats-minio mc ls myminio/

# Reiniciar servicio
docker-compose restart minio
```

### Mailpit
- **SMTP**: localhost:1025
- **Web Interface**: http://localhost:8025

**Uso:**
1. Los emails del sistema se envían a Mailpit
2. Acceder a http://localhost:8025 para ver emails
3. Útil para testing de notificaciones

**Comandos útiles:**
```bash
# Ver logs
docker logs ats-mailpit

# Reiniciar servicio
docker-compose restart mailpit
```

### Comandos Docker Comunes

```bash
# Ver estado de todos los servicios
docker-compose ps

# Ver logs de todos los servicios
docker-compose logs

# Ver logs de un servicio específico
docker-compose logs backend

# Reiniciar todos los servicios
docker-compose restart

# Parar todos los servicios
docker-compose down

# Parar y eliminar volúmenes (¡CUIDADO! Elimina datos)
docker-compose down -v

# Reconstruir imágenes
docker-compose build --no-cache
```

---

## 🧪 Testing

### Backend
```bash
cd backend

# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm test -- --watch

# Ejecutar tests con coverage
npm test -- --coverage

# Ejecutar tests específicos
npm test -- candidate.test.ts
```

### Frontend
```bash
cd frontend

# Ejecutar tests
npm test

# Ejecutar tests con coverage
npm test -- --coverage --watchAll=false
```

### Tests Disponibles

#### Backend
- ✅ **Tests unitarios** de servicios y repositorios
- ✅ **Tests de integración** de endpoints
- ✅ **Tests de validación** de datos
- ✅ **Tests de manejo de errores**
- ✅ **Tests de carga de archivos**

#### Frontend
- ✅ **Tests de componentes** React
- ✅ **Tests de servicios** API
- ✅ **Tests de utilidades** de validación

---

## 📁 Estructura del Proyecto

```
AI4Devs-lab-ides-202506/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuraciones
│   │   ├── controllers/     # Controladores de la API
│   │   ├── middleware/      # Middlewares personalizados
│   │   ├── repositories/    # Capa de acceso a datos
│   │   ├── routes/          # Definición de rutas
│   │   ├── services/        # Lógica de negocio
│   │   ├── tests/           # Tests del backend
│   │   ├── types/           # Tipos TypeScript
│   │   ├── utils/           # Utilidades y constantes
│   │   └── index.ts         # Punto de entrada
│   ├── prisma/
│   │   ├── migrations/      # Migraciones de base de datos
│   │   ├── schema.prisma    # Esquema de base de datos
│   │   └── seed.ts          # Datos de prueba
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── config/          # Configuraciones
│   │   ├── services/        # Servicios de API
│   │   ├── types/           # Tipos TypeScript
│   │   ├── utils/           # Utilidades
│   │   └── App.tsx          # Componente principal
│   └── package.json
├── docs/                    # Documentación técnica
├── docker-compose.yml       # Configuración de servicios
└── README.md
```

---

## 🔧 Configuración Avanzada

### Variables de Entorno Adicionales

#### Backend
```env
# Logging
LOG_LEVEL=debug

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# JWT (para futuras implementaciones)
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:3000
```

#### Frontend
```env
# Configuración adicional
REACT_APP_ENVIRONMENT=development
REACT_APP_VERSION=1.0.0
```

### Configuración de MinIO para Producción

```env
# MinIO en producción
MINIO_ENDPOINT=your-minio-server.com
MINIO_PORT=443
MINIO_USE_SSL=true
MINIO_ACCESS_KEY=your-access-key
MINIO_SECRET_KEY=your-secret-key
```

### Configuración de Email para Producción

```env
# SMTP en producción (ejemplo con Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

---

## 🚨 Troubleshooting

### Problemas Comunes

#### 1. Error de Conexión a Base de Datos
```bash
# Verificar que PostgreSQL esté corriendo
docker-compose ps

# Verificar logs
docker-compose logs db

# Reiniciar servicio
docker-compose restart db
```

#### 2. Error de Conexión a MinIO
```bash
# Verificar que MinIO esté corriendo
docker-compose ps

# Verificar logs
docker-compose logs minio

# Acceder a la consola web
# http://localhost:9001
```

#### 3. Error de Puerto en Uso
```bash
# Verificar puertos en uso
lsof -i :3000
lsof -i :3010
lsof -i :5432
lsof -i :9000

# Matar proceso si es necesario
kill -9 <PID>
```

#### 4. Error de Dependencias
```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

#### 5. Error de Migraciones Prisma
```bash
# Resetear base de datos
npm run prisma:reset

# O ejecutar migraciones manualmente
npx prisma migrate dev
```

### Logs Útiles

```bash
# Ver logs en tiempo real
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend

# Ver logs de la aplicación
tail -f backend/logs/app.log
```

---

## 📈 Monitoreo y Logs

### Logs del Backend
- **Nivel**: Configurable via `LOG_LEVEL`
- **Formato**: JSON estructurado
- **Rotación**: Configurable

### Métricas de Rendimiento
- **Uptime**: `/api/health`
- **Logs de errores**: Console + archivo
- **Tiempo de respuesta**: Morgan middleware

### Alertas
- Errores críticos (500+) se loguean con prioridad alta
- Integración preparada para servicios como Sentry

---

## 🔒 Seguridad

### Medidas Implementadas
- ✅ **Helmet** para headers de seguridad
- ✅ **CORS** configurado apropiadamente
- ✅ **Validación** de entrada con Joi
- ✅ **Sanitización** de datos
- ✅ **Rate limiting** (preparado)
- ✅ **Logging** de errores sin información sensible

### Recomendaciones para Producción
- 🔐 Usar HTTPS
- 🔐 Configurar JWT para autenticación
- 🔐 Implementar rate limiting
- 🔐 Configurar firewall
- 🔐 Usar variables de entorno seguras
- 🔐 Implementar backup automático de base de datos

---

## 🤝 Contribución

### Flujo de Desarrollo
1. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
2. Desarrollar y testear
3. Commit con mensaje descriptivo
4. Push y crear Pull Request

### Estándares de Código
- **TypeScript** estricto
- **ESLint** + **Prettier** configurados
- **Tests** obligatorios para nuevas funcionalidades
- **Documentación** de APIs y componentes

---

## 📞 Soporte

### Contacto
- **Desarrollador**: LTI Academy 2025
- **Email**: soporte@ats.com
- **Documentación**: `/docs`

### Recursos Adicionales
- 📚 [Documentación Técnica](./docs/)
- 🐛 [Issues del Proyecto](link-to-issues)
- 📖 [Guía de Desarrollo](./docs/04-buenas-practicas-estilos.md)

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver [LICENSE.md](./LICENSE.md) para más detalles.

---

## 🎉 ¡Gracias!

¡Gracias por usar el Sistema ATS! Si encuentras algún problema o tienes sugerencias, no dudes en contactarnos.

**LTI Sistema ATS - LIDR Academy 2025** 🚀
