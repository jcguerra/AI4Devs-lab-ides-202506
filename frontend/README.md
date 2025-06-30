# Frontend - Sistema ATS

## 🚀 Funcionalidades Implementadas - FASE 4

### ✅ Componentes Principales
- **Dashboard**: Interfaz principal con navegación
- **CandidateForm**: Formulario completo de candidatos con acordeones
- **CandidateList**: Lista paginada con búsqueda en tiempo real
- **CandidateView**: Vista detallada en modal
- **EducationForm**: Gestión dinámica de registros educativos
- **ExperienceForm**: Gestión dinámica de experiencia laboral
- **FileUpload**: Componente drag & drop para documentos

### ✅ Características Destacadas
- **Material-UI**: Diseño moderno y responsivo
- **Validaciones en tiempo real**: Teléfono, email, dirección según especificaciones
- **Campos dinámicos**: Añadir/eliminar educación y experiencia
- **Subida de archivos**: Drag & drop con validación (PDF/DOCX, 10MB)
- **Búsqueda**: Debounce de 500ms con resultados en tiempo real
- **Paginación**: Configurable (5, 10, 25, 50 elementos)
- **Estados de carga**: Skeletons y spinners
- **Alertas**: Feedback visual para todas las acciones
- **Breadcrumbs**: Navegación clara entre vistas

### ✅ Criterios de Aceptación Cumplidos
1. ✅ **Accesibilidad desde dashboard**: FAB + botón en header
2. ✅ **Formulario completo**: Campos obligatorios y opcionales
3. ✅ **Validación en tiempo real**: Todos los campos según specs
4. ✅ **Carga de documentos**: PDF/DOCX, máximo 10MB
5. ✅ **Gestión educación/experiencia**: Múltiples registros dinámicos
6. ✅ **Confirmación y errores**: Alertas y diálogos
7. ✅ **Interfaz responsiva**: Mobile-first design

## 🛠 Tecnologías Utilizadas

- **React 18.3.1** con TypeScript
- **Material-UI v5** para componentes UI
- **Axios** para comunicación con API
- **React Hooks** para gestión de estado

## 🚀 Comandos Disponibles

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm start

# Ejecutar tests
npm test

# Build para producción
npm run build
```

## 🔧 Configuración

### Variables de Entorno
Crea un archivo `.env` en la raíz del frontend:

```env
REACT_APP_API_URL=http://localhost:3010
REACT_APP_API_VERSION=v1
```

### URLs por Defecto
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3010
- **API Base**: http://localhost:3010/api/v1

## 📁 Estructura de Componentes

```
src/
├── components/
│   ├── common/
│   │   └── FileUpload/
│   │       └── FileUpload.tsx
│   ├── candidate/
│   │   ├── CandidateForm/
│   │   │   ├── CandidateForm.tsx
│   │   │   ├── EducationForm.tsx
│   │   │   └── ExperienceForm.tsx
│   │   ├── CandidateList/
│   │   │   └── CandidateList.tsx
│   │   └── CandidateView/
│   │       └── CandidateView.tsx
│   └── Dashboard/
│       └── Dashboard.tsx
├── services/
│   ├── api.service.ts
│   └── candidate.service.ts
├── types/
│   └── candidate.types.ts
├── utils/
│   └── validation.utils.ts
└── config/
    └── config.ts
```

## 🎨 Tema Material-UI

El sistema usa un tema personalizado con:
- **Colores primarios**: Azul (#1976d2)
- **Colores secundarios**: Rojo (#dc004e)
- **Tipografía**: Roboto con pesos personalizados
- **Componentes**: Botones sin texto en mayúsculas, cards redondeadas

## 🔍 Funcionalidades de Usuario

### Gestión de Candidatos
1. **Ver lista**: Tabla paginada con avatares y chips informativos
2. **Búsqueda**: Tiempo real por nombre, email o empresa
3. **Añadir candidato**: Formulario en acordeones con validaciones
4. **Editar candidato**: Misma interfaz con datos precargados
5. **Ver detalles**: Modal completo con toda la información
6. **Eliminar**: Confirmación con nombre del candidato

### Educación y Experiencia
- **Añadir múltiples**: Sin límite de registros
- **Fechas inteligentes**: Campo "Actual" deshabilita fecha fin
- **Validaciones**: Campos obligatorios marcados
- **Interfaz intuitiva**: Cards con botones de eliminación

### Gestión de Archivos
- **Drag & Drop**: Zona visual para arrastrar archivos
- **Validación**: Tipo (PDF/DOCX) y tamaño (10MB)
- **Preview**: Información del archivo seleccionado
- **Estados**: Reemplazar archivo existente

## ⚡ Rendimiento

- **Lazy loading**: Componentes cargados bajo demanda
- **Debounce**: Búsqueda optimizada
- **Memoización**: React.memo en componentes pesados
- **Skeletons**: Mejor UX durante cargas

## 🐛 Manejo de Errores

- **Validaciones locales**: Sin llamadas al servidor innecesarias
- **Errores de API**: Mensajes específicos del backend
- **Errores de red**: Fallback amigable
- **Estados de carga**: Prevención de doble envío

## 📱 Responsividad

- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**: sm, md, lg, xl configurados
- **Grid system**: Material-UI Grid responsive
- **Navigation**: Breadcrumbs adaptativos

El frontend está **100% funcional** y cumple todos los criterios de aceptación especificados.
