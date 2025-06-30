# Documentación Sistema ATS - Añadir Candidato

## Propósito de esta Documentación

Esta documentación estructurada tiene como objetivo servir como guía de referencia para el desarrollo del sistema ATS (Applicant Tracking System), específicamente enfocada en la funcionalidad de **"Añadir Candidato al Sistema"**. Está diseñada para:

1. **Guiar la generación de código con IA**: Proporcionar contexto claro y estructurado para prompts
2. **Mantener consistencia**: Establecer estándares y patrones de desarrollo
3. **Facilitar onboarding**: Ayudar a nuevos desarrolladores a entender la arquitectura
4. **Acelerar el desarrollo**: Reducir decisiones técnicas repetitivas

## Historia de Usuario Base

**Como reclutador, quiero tener la capacidad de añadir candidatos al sistema ATS, para que pueda gestionar sus datos y procesos de selección de manera eficiente.**

### Criterios de Aceptación Principales
- Formulario de ingreso con campos obligatorios (nombre, apellido, email) y opcionales (teléfono, dirección)
- Validación de datos en tiempo real
- Carga de documentos (CV en PDF/DOCX)
- Gestión de educación y experiencia laboral
- Confirmación de éxito y manejo de errores
- Interfaz intuitiva y responsiva

## Estructura de la Documentación

### [01. Modelo de Datos](./01-modelo-de-datos.md)
**Propósito**: Define la estructura de base de datos y relaciones entre entidades.

**Contenido clave**:
- Esquemas Prisma para Candidate, Education, WorkExperience, Document
- Validaciones y restricciones de datos
- Índices para optimización de rendimiento
- Reglas de negocio del dominio

**Usar para prompts sobre**: Creación de migraciones, queries de base de datos, validaciones de modelo.

### [02. Arquitectura de la Aplicación](./02-arquitectura-aplicacion.md)
**Propósito**: Describe la arquitectura general, patrones de diseño y flujo de datos.

**Contenido clave**:
- Stack tecnológico (React + TypeScript + Node.js + PostgreSQL)
- Patrones: Repository, Service Layer, Layered Architecture
- Flujo de datos para añadir candidatos
- API design y endpoints RESTful

**Usar para prompts sobre**: Estructura de controllers/services, diseño de APIs, integración frontend-backend.

### [03. Estructura de Ficheros](./03-estructura-ficheros.md)
**Propósito**: Organización del código, convenciones de nomenclatura y configuración del proyecto.

**Contenido clave**:
- Estructura detallada de directorios backend y frontend
- Convenciones de nomenclatura para archivos y componentes
- Gestión de variables de entorno
- Scripts de desarrollo y build

**Usar para prompts sobre**: Creación de nuevos archivos, organización de componentes, configuración de herramientas.

### [04. Buenas Prácticas y Estilos](./04-buenas-practicas-estilos.md)
**Propósito**: Estándares de código, patrones de desarrollo y metodologías de testing.

**Contenido clave**:
- Principios SOLID y Clean Code
- Patrones específicos para React y Node.js
- Patrones para MinIO y servicios de email
- Estrategias de validación y manejo de errores
- Ejemplos de testing unitario e integración

**Usar para prompts sobre**: Refactoring de código, implementación de tests, optimización de componentes, integración con MinIO.

### [05. Configuración Docker](./05-configuracion-docker.md)
**Propósito**: Configuración y gestión de servicios Docker (PostgreSQL, MinIO, Mailpit).

**Contenido clave**:
- Configuración completa de docker-compose.yml
- Gestión de MinIO para almacenamiento de archivos
- Mailpit para testing de emails en desarrollo
- Comandos útiles y troubleshooting
- Variables de entorno y configuración de red

**Usar para prompts sobre**: Configuración de servicios, gestión de archivos, testing de emails, DevOps local.

## Cómo Usar Esta Documentación

### Para Prompts de IA
1. **Identifica el contexto**: ¿Es backend, frontend, base de datos?
2. **Referencia el documento apropiado**: Incluye secciones relevantes en tu prompt
3. **Especifica patrones**: Menciona los patrones que debe seguir el código generado

### Ejemplo de Prompt Efectivo
```
Basándote en la documentación del sistema ATS (docs/02-arquitectura-aplicacion.md, docs/04-buenas-practicas-estilos.md y docs/05-configuracion-docker.md), 
crea un servicio para subir archivos de candidatos que:
- Use MinIO para almacenamiento distribuido
- Siga el patrón Service Layer y Repository
- Implemente validación de archivos (tipo, tamaño)
- Envíe confirmación por email usando Mailpit
- Use el formato de respuesta estándar ApiResponse<T>
- Incluya manejo de errores y logging
- Siga las convenciones de nomenclatura establecidas
```

## Tecnologías y Versiones

### Backend
- **Node.js** con TypeScript 4.9.5
- **Express.js** 4.19.2 como framework web
- **Prisma** 5.13.0 como ORM
- **PostgreSQL** como base de datos
- **Jest** para testing

### Frontend  
- **React** 18.3.1 con TypeScript
- **Create React App** como base
- **CSS Modules** para estilos
- **Jest + React Testing Library** para testing

### DevOps
- **Docker Compose** para servicios (PostgreSQL, MinIO, Mailpit)
- **MinIO** para almacenamiento de archivos S3-compatible
- **Mailpit** para testing de emails en desarrollo
- **ESLint + Prettier** para calidad de código

## Próximos Pasos

### Fase 1: Implementación Base
1. Configurar modelos de base de datos según `01-modelo-de-datos.md`
2. Configurar servicios Docker (PostgreSQL, MinIO, Mailpit)
3. Implementar estructura de backend según `02-arquitectura-aplicacion.md`
4. Integrar servicios MinIO y Mailpit
5. Crear componentes de frontend siguiendo `03-estructura-ficheros.md`

### Fase 2: Funcionalidades Avanzadas
1. Sistema de autenticación
2. Búsqueda y filtros avanzados
3. Notificaciones por email
4. Reportes y analytics

### Fase 3: Optimización
1. Implementar cache con Redis
2. Migración a almacenamiento en cloud (AWS S3) desde MinIO
3. Integración con servicios de email en producción (SendGrid, AWS SES)
4. Monitoreo y observabilidad
5. CI/CD pipeline

## Mantenimiento de la Documentación

Esta documentación debe actualizarse cuando:
- Se añadan nuevas funcionalidades al sistema
- Cambien los patrones de arquitectura
- Se actualicen tecnologías o versiones
- Se identifiquen mejores prácticas

**Responsabilidad**: Todo el equipo de desarrollo debe contribuir a mantener actualizada esta documentación. 