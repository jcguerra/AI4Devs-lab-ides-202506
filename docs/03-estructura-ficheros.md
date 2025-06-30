# Estructura de Ficheros - Sistema ATS

## Estructura General del Proyecto

```
AI4Devs-lab-ides-202506/
├── backend/                     # Aplicación del servidor
├── frontend/                    # Aplicación del cliente
├── docs/                        # Documentación del proyecto
├── docker-compose.yml          # Configuración de contenedores
├── README.md                   # Documentación principal
├── LICENSE.md                  # Licencia del proyecto
└── VERSION                     # Control de versiones
```

## Estructura del Backend

```
backend/
├── prisma/                     # Configuración de base de datos
│   ├── schema.prisma          # Esquema de base de datos
│   ├── migrations/            # Historial de migraciones
│   └── seed.ts               # Datos iniciales (futuro)
│
├── src/                       # Código fuente
│   ├── index.ts              # Punto de entrada de la aplicación
│   │
│   ├── config/               # Configuración de la aplicación
│   │   ├── database.ts       # Configuración de Prisma
│   │   ├── swagger.ts        # Configuración de Swagger
│   │   └── environment.ts    # Variables de entorno
│   │
│   ├── controllers/          # Controladores de rutas
│   │   ├── candidate.controller.ts
│   │   ├── document.controller.ts
│   │   ├── education.controller.ts
│   │   ├── workExperience.controller.ts
│   │   └── user.controller.ts
│   │
│   ├── services/             # Lógica de negocio
│   │   ├── candidate.service.ts
│   │   ├── document.service.ts
│   │   ├── education.service.ts
│   │   ├── workExperience.service.ts
│   │   ├── validation.service.ts
│   │   └── fileUpload.service.ts
│   │
│   ├── repositories/         # Acceso a datos
│   │   ├── candidate.repository.ts
│   │   ├── document.repository.ts
│   │   ├── education.repository.ts
│   │   ├── workExperience.repository.ts
│   │   └── base.repository.ts
│   │
│   ├── middleware/           # Middleware personalizado
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   ├── fileUpload.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── cors.middleware.ts
│   │
│   ├── types/               # Definiciones de tipos TypeScript
│   │   ├── candidate.types.ts
│   │   ├── document.types.ts
│   │   ├── api.types.ts
│   │   └── common.types.ts
│   │
│   ├── utils/               # Utilidades compartidas
│   │   ├── logger.ts        # Sistema de logging
│   │   ├── validators.ts    # Funciones de validación
│   │   ├── fileHandler.ts   # Manejo de archivos
│   │   ├── constants.ts     # Constantes de la aplicación
│   │   └── helpers.ts       # Funciones de ayuda
│   │
│   ├── routes/              # Definición de rutas
│   │   ├── index.ts         # Router principal
│   │   ├── candidate.routes.ts
│   │   ├── document.routes.ts
│   │   ├── education.routes.ts
│   │   ├── workExperience.routes.ts
│   │   └── user.routes.ts
│   │
│   └── tests/               # Pruebas unitarias e integración
│       ├── unit/            # Pruebas unitarias
│       │   ├── services/
│       │   ├── repositories/
│       │   └── utils/
│       ├── integration/     # Pruebas de integración
│       │   ├── controllers/
│       │   └── routes/
│       ├── fixtures/        # Datos de prueba
│       └── setup/           # Configuración de pruebas
│
├── uploads/                 # Directorio temporal (solo para desarrollo sin MinIO)
├── logs/                   # Archivos de log (gitignored)
├── minio-data/             # Datos de MinIO (gitignored)
├── dist/                   # Código compilado (gitignored)
├── package.json            # Dependencias y scripts
├── package-lock.json       # Lock de dependencias
├── tsconfig.json          # Configuración TypeScript
├── jest.config.js         # Configuración de Jest
├── .env                   # Variables de entorno (gitignored)
├── .env.example           # Ejemplo de variables de entorno
└── .gitignore             # Archivos ignorados por Git
```

## Estructura del Frontend

```
frontend/
├── public/                 # Archivos estáticos
│   ├── index.html         # Template HTML principal
│   ├── favicon.ico        # Icono de la aplicación
│   ├── logo192.png        # Logo para PWA
│   ├── logo512.png        # Logo para PWA
│   ├── manifest.json      # Configuración PWA
│   └── robots.txt         # SEO robots
│
├── src/                   # Código fuente React
│   ├── index.tsx          # Punto de entrada de React
│   ├── App.tsx            # Componente principal
│   ├── App.css            # Estilos globales
│   ├── index.css          # Estilos base
│   │
│   ├── components/        # Componentes reutilizables
│   │   ├── common/        # Componentes comunes
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.module.css
│   │   │   │   └── Button.test.tsx
│   │   │   ├── Modal/
│   │   │   ├── Form/
│   │   │   ├── Table/
│   │   │   ├── FileUpload/
│   │   │   └── LoadingSpinner/
│   │   │
│   │   ├── candidate/     # Componentes específicos de candidatos
│   │   │   ├── CandidateForm/
│   │   │   │   ├── CandidateForm.tsx
│   │   │   │   ├── CandidateForm.module.css
│   │   │   │   └── CandidateForm.test.tsx
│   │   │   ├── CandidateList/
│   │   │   ├── CandidateCard/
│   │   │   ├── CandidateDetails/
│   │   │   └── CandidateSearch/
│   │   │
│   │   └── layout/        # Componentes de layout
│   │       ├── Header/
│   │       ├── Sidebar/
│   │       ├── Footer/
│   │       └── Navigation/
│   │
│   ├── pages/             # Páginas de la aplicación
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Dashboard.module.css
│   │   │   └── Dashboard.test.tsx
│   │   ├── Candidates/
│   │   │   ├── CandidateList.tsx
│   │   │   ├── AddCandidate.tsx
│   │   │   ├── EditCandidate.tsx
│   │   │   └── CandidateDetail.tsx
│   │   ├── Login/
│   │   └── NotFound/
│   │
│   ├── hooks/             # Custom React hooks
│   │   ├── useApi.ts
│   │   ├── useForm.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useFileUpload.ts
│   │   └── useCandidates.ts
│   │
│   ├── services/          # Servicios para API calls
│   │   ├── api.ts         # Cliente HTTP base
│   │   ├── candidate.service.ts
│   │   ├── document.service.ts
│   │   ├── education.service.ts
│   │   ├── workExperience.service.ts
│   │   └── auth.service.ts
│   │
│   ├── types/             # Definiciones de tipos TypeScript
│   │   ├── candidate.types.ts
│   │   ├── document.types.ts
│   │   ├── api.types.ts
│   │   └── common.types.ts
│   │
│   ├── utils/             # Utilidades del frontend
│   │   ├── formatters.ts  # Formateo de datos
│   │   ├── validators.ts  # Validaciones del cliente
│   │   ├── constants.ts   # Constantes de la aplicación
│   │   ├── helpers.ts     # Funciones de ayuda
│   │   └── storage.ts     # Manejo de localStorage
│   │
│   ├── context/           # React Context para estado global
│   │   ├── AuthContext.tsx
│   │   ├── CandidateContext.tsx
│   │   └── ThemeContext.tsx
│   │
│   ├── styles/            # Estilos globales y variables
│   │   ├── globals.css
│   │   ├── variables.css
│   │   ├── components.css
│   │   └── responsive.css
│   │
│   └── tests/             # Pruebas del frontend
│       ├── components/    # Tests de componentes
│       ├── pages/         # Tests de páginas
│       ├── services/      # Tests de servicios
│       ├── utils/         # Tests de utilidades
│       ├── fixtures/      # Datos de prueba
│       └── __mocks__/     # Mocks para testing
│
├── build/                 # Build de producción (gitignored)
├── node_modules/          # Dependencias (gitignored)
├── package.json           # Dependencias y scripts
├── package-lock.json      # Lock de dependencias
├── tsconfig.json         # Configuración TypeScript
├── jest.config.js        # Configuración de Jest
├── .env                  # Variables de entorno (gitignored)
├── .env.example          # Ejemplo de variables de entorno
└── .gitignore            # Archivos ignorados por Git
```

## Convenciones de Nomenclatura

### Archivos y Directorios
- **Componentes React**: PascalCase (`CandidateForm.tsx`)
- **Servicios**: camelCase con sufijo `.service.ts` (`candidate.service.ts`)
- **Types**: camelCase con sufijo `.types.ts` (`candidate.types.ts`)
- **Tests**: mismo nombre + `.test.ts` o `.spec.ts`
- **Estilos CSS Modules**: `.module.css`
- **Directorios**: camelCase para funcionalidad, PascalCase para componentes

### Organización de Imports
```typescript
// 1. Librerías externas
import React, { useState, useEffect } from 'react';
import { Router } from 'express';

// 2. Imports internos - tipos
import type { Candidate, CreateCandidateDto } from '../types/candidate.types';

// 3. Imports internos - servicios/utils
import { candidateService } from '../services/candidate.service';
import { validateEmail } from '../utils/validators';

// 4. Imports relativos
import './Component.module.css';
```

## Gestión de Archivos con MinIO

### Estructura de Buckets en MinIO
```
ats-bucket/                        # Bucket principal
├── candidates/                    # Archivos de candidatos
│   ├── {candidateId}/            # Subdirectorio por candidato
│   │   ├── cv/                   # CVs (PDF, DOCX)
│   │   │   ├── cv_original.pdf
│   │   │   └── cv_updated.pdf
│   │   ├── documents/            # Otros documentos
│   │   │   ├── cover_letter.pdf
│   │   │   └── certificates.pdf
│   │   └── photos/               # Fotos de perfil (futuro)
├── temp/                         # Archivos temporales
│   └── uploads/                  # Subidas pendientes de procesar
└── templates/                    # Plantillas de documentos
    ├── cv_templates/
    └── email_templates/

# Nomenclatura de archivos en MinIO:
# candidates/{candidateId}/cv/{timestamp}_{originalName}
# candidates/{candidateId}/documents/{documentType}_{timestamp}_{originalName}
```

### Configuración de MinIO
```
# Desarrollo local
MinIO Console: http://localhost:9001
MinIO API: http://localhost:9000
Bucket: ats-bucket

# Producción (AWS S3)
Bucket: ats-production-files
```

## Variables de Entorno

### Backend (.env)
```env
# Base de datos
DATABASE_URL="postgresql://LTIdbUser:D1ymf8wyQEGthFR1E9xhCq@localhost:5432/LTIdb"

# Aplicación
PORT=3001
NODE_ENV=development
JWT_SECRET=your-secret-key

# MinIO Configuration
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_NAME=ats-bucket
MINIO_USE_SSL=false

# File Upload
MAX_FILE_SIZE=10485760  # 10MB
ALLOWED_FILE_TYPES=pdf,docx,jpg,png
FILE_UPLOAD_TIMEOUT=30000  # 30 segundos

# Email Configuration (Mailpit)
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASS=
SMTP_FROM=noreply@ats-system.com
MAILPIT_UI_URL=http://localhost:8025

# URLs para desarrollo
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3001
MINIO_PUBLIC_URL=http://localhost:9000
```

### Frontend (.env)
```env
# API Configuration
REACT_APP_API_URL=http://localhost:3001/api/v1
REACT_APP_FILE_UPLOAD_URL=http://localhost:3001/api/v1/upload

# Features flags
REACT_APP_ENABLE_FILE_UPLOAD=true
REACT_APP_ENABLE_DRAG_DROP=true

# UI Configuration
REACT_APP_MAX_FILE_SIZE=10485760
REACT_APP_ITEMS_PER_PAGE=20
```

## Scripts de Desarrollo

### Backend (package.json)
```json
{
  "scripts": {
    "start": "node dist/index.js",
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "prisma:generate": "npx prisma generate",
    "prisma:migrate": "npx prisma migrate dev",
    "prisma:studio": "npx prisma studio",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix",
    "format": "prettier --write src/**/*.ts"
  }
}
```

### Frontend (package.json)
```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "test:coverage": "react-scripts test --coverage --watchAll=false",
    "eject": "react-scripts eject",
    "lint": "eslint src/**/*.{ts,tsx}",
    "lint:fix": "eslint src/**/*.{ts,tsx} --fix",
    "format": "prettier --write src/**/*.{ts,tsx}"
  }
}
``` 