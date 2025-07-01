# Desarrollo de funcionalidad para añadir candidato
_Exported on 6/30/2025 at 21:21:38 GMT-3 from Cursor (1.1.6)_

---

**User**

Actúa como un experto en desarrollo de aplicaciones web y arquitecturas modernas.

Tu rol es diseñar y desarrollar de manera técnica y funcional una funcionalidad específica de un sistema ATS (Applicant Tracking System): la opción de "Añadir Candidato al Sistema".

Esta funcionalidad debe cumplir con los siguientes criterios de aceptación:
1. Accesibilidad de la función: Desde el dashboard del reclutador debe existir un botón o enlace visible para añadir candidatos.
2. Formulario de ingreso de datos: Debe incluir campos como nombre, apellido, email, teléfono, dirección, educación y experiencia laboral.
3. Validación de datos: Validar formato de correo, campos requeridos, etc.
4. Carga de documentos: Permitir subir CVs en PDF o DOCX.
5. Confirmación de añadido: Mostrar mensaje claro de éxito.
6. Errores y excepciones: Capturar y mostrar errores como fallas del servidor.
7. Accesibilidad y compatibilidad: Interfaz responsiva y usable en múltiples navegadores/dispositivos.

Notas funcionales adicionales:
* La interfaz debe ser fácil de usar para minimizar la curva de aprendizaje.
* Se desea autocompletado para campos de educación y experiencia laboral si hay datos previos disponibles.

Tareas técnicas esperadas:
* Implementación de la interfaz de usuario.
* Desarrollo del backend para recibir y procesar la data.
* Validaciones de seguridad y privacidad para datos personales y documentos.

Lineamientos clave que debes seguir:
* Organizar el trabajo en fases y tareas técnicas bien delimitadas.
* Las tareas deben estar alineadas a la documentacion disponible, como modelo de datos, arquitectura de la aplicación, estructura de ficheros, configuraciones necesarias, y buenas prácticas de desarrollo, ubicado en @README.md que está dentro de la carpeta docs.
* Antes de comenzar cada fase o grupo de tareas, hazme todas las preguntas necesarias para reducir ambigüedades.
* No avances a una nueva fase sin que yo valide que la anterior está completa.
* Al finalizar cada tarea o conjunto de tareas, pregunta explícitamente si podemos continuar.

Objetivo del trabajo: Obtener un desarrollo completo, seguro, escalable y mantenible de la funcionalidad "Añadir Candidato al Sistema" dentro de un sistema ATS moderno.

---

**Cursor**

¡Excelente! Como experto en desarrollo de aplicaciones web, me complace ayudarte a desarrollar la funcionalidad "Añadir Candidato al Sistema" para tu ATS. 

Primero, necesito revisar toda la documentación disponible para entender completamente el contexto y arquitectura del proyecto antes de planificar las fases de desarrollo.

Ahora necesito revisar el estado actual del proyecto para entender qué está implementado y qué falta por desarrollar:

Excelente, he revisado completamente la documentación y el estado actual del proyecto. Basándome en los criterios de aceptación que me proporcionaste y la documentación estructurada disponible, puedo observar que el proyecto está en una etapa muy inicial y necesitamos desarrollar prácticamente toda la funcionalidad "Añadir Candidato al Sistema" desde cero.

## **Estado Actual del Proyecto**
- ✅ Configuración básica de TypeScript para backend y frontend
- ✅ PostgreSQL configurado en Docker
- ❌ Modelos de base de datos para candidatos (falta implementar)
- ❌ Servicios MinIO y Mailpit (faltan en Docker)
- ❌ API backend para candidatos (falta completamente)
- ❌ Interfaz frontend para candidatos (falta completamente)
- ❌ Manejo de archivos (falta completamente)

## **Propuesta de Organización en Fases**

### **FASE 1: Infraestructura y Base de Datos**
**Objetivo**: Configurar la base técnica necesaria para el desarrollo
**Entregables**:
1. Actualizar docker-compose.yml con MinIO y Mailpit
2. Implementar modelo de datos completo en Prisma (Candidate, Education, WorkExperience, Document)
3. Configurar variables de entorno
4. Agregar dependencias necesarias (MinIO SDK, Multer, etc.)

### **FASE 2: Backend - API Core de Candidatos**
**Objetivo**: Desarrollar la API REST para gestión de candidatos
**Entregables**:
1. Estructura de carpetas según documentación
2. Repositorios, servicios y controladores para candidatos
3. Validaciones y manejo de errores
4. Endpoints básicos CRUD para candidatos

### **FASE 3: Backend - Gestión de Archivos**
**Objetivo**: Implementar subida y gestión de documentos con MinIO
**Entregables**:
1. Servicio de integración con MinIO
2. Middleware para subida de archivos
3. Validaciones de archivos (tipo, tamaño)
4. API para gestión de documentos

### **FASE 4: Frontend - Interfaz de Usuario**
**Objetivo**: Desarrollar la interfaz para añadir candidatos
**Entregables**:
1. Componente de formulario de candidatos
2. Validaciones del lado cliente
3. Integración con API backend
4. Componente de subida de archivos
5. Dashboard básico con acceso a "Añadir Candidato"

### **FASE 5: Integración y Testing**
**Objetivo**: Integrar todo el sistema y asegurar calidad
**Entregables**:
1. Pruebas unitarias e integración
2. Servicio de email con Mailpit
3. Manejo completo de errores
4. Optimizaciones de UX/UI

## **Preguntas para Reducir Ambigüedades**

Antes de comenzar con la **FASE 1**, necesito aclarar los siguientes puntos:

### **1. Configuración Técnica**
- ¿Prefieres mantener el puerto 3010 para el backend o cambiarlo al 3001 como sugiere la documentación?
- ¿Hay algún requisito específico de autenticación para esta primera versión, o podemos omitirla temporalmente?

### **2. Funcionalidad del Formulario**
- Para los campos de educación y experiencia laboral, ¿prefieres que sean campos dinámicos donde se puedan añadir múltiples registros en el mismo formulario, o un enfoque más simple inicialmente?
- ¿Qué validaciones específicas necesitas para los campos de teléfono y dirección?

### **3. Gestión de Archivos**
- ¿Existe algún límite específico de tamaño de archivos además de los 10MB mencionados en la documentación?
- ¿Necesitas previsualización de PDFs en la interfaz o simplemente mostrar el nombre del archivo subido?

### **4. UX/UI**
- ¿Tienes alguna preferencia específica de diseño o framework CSS (ej: Material-UI, Tailwind, Bootstrap) o prefieres CSS custom?
- ¿El dashboard debe mostrar una lista de candidatos existentes o simplemente el botón para añadir candidatos?

### **5. Prioridades**
- ¿Qué es más importante: tener todas las funcionalidades básicas funcionando o enfocarse en una experiencia de usuario pulida desde el inicio?

Una vez que tengas estas aclaraciones, procederé inmediatamente con la **FASE 1** sin esperar más confirmaciones, siguiendo exactamente la metodología que estableciste.

¿Podrías proporcionarme estas aclaraciones para comenzar con el desarrollo?

---

**User**

Respuestas:
1. Configuración Técnica
- Prefiero mantener el puerto 3010 para el backen.
- No hay requisito específico de autenticación para esta primera versión.
2. Funcionalidad del Formulario
- prefiero que sean campos dinámicos donde se puedan añadir múltiples registros en el mismo formulario.
- La validacion para telefonos serian no aceptar campos vacios, campo obligatorio,  permitir espacios, paréntesis, guiones, y símbolo + para internacionales, minimo 7 y maximo 15 caracteres. Para el campo de direccion serian no aceptar campos vacios, campo obligatorio, maximo de 255 caracteres, permitir letras, números, espacios, signos de puntuación (., ,, -, #, /).
3. Gestión de Archivos
- El limite de tamańo de archivos no debe superar los 10MB.
- No necesitamos previsualización el PDF en la interfaz, simplemente mostramos el nombre del archivo subido.
- Usemos MInio para el storage de los archivos de los candidatos
4. UX/UI
- Podemos usar Material-UI.
- El dashboard debe mostrar una lista de candidatos existentes y el boton para ańadir candidatos, tambien para ver el detalle del candidato.
5. Prioridades
- ambas son importantes, es importante todas las funcionalidades basicas funcionando y tener una buena experiencia de usuario desde el inicio.

---

**Cursor**

¡Perfecto! Con estas aclaraciones tengo toda la información necesaria. Procedo inmediatamente con la **FASE 1: Infraestructura y Base de Datos**.

...


