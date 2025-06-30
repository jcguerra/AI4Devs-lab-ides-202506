# Modelo de Datos - Sistema ATS

## Resumen General
Este documento define el modelo de datos para el sistema ATS (Applicant Tracking System), especialmente diseñado para soportar la funcionalidad de gestión de candidatos.

## Entidades Principales

### Candidate (Candidato)
Entidad central que representa a un candidato en el sistema.

```prisma
model Candidate {
  id                Int      @id @default(autoincrement())
  firstName         String   @db.VarChar(100)
  lastName          String   @db.VarChar(100)
  email             String   @unique @db.VarChar(255)
  phone             String?  @db.VarChar(20)
  address           String?  @db.Text
  
  // Relaciones
  educations        Education[]
  experiences       WorkExperience[]
  documents         Document[]
  applications      Application[]
  
  // Metadatos
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  createdBy         Int      // ID del reclutador
  
  // Relación con User (reclutador)
  recruiter         User     @relation(fields: [createdBy], references: [id])
  
  @@map("candidates")
}
```

### Education (Educación)
Información educativa del candidato.

```prisma
model Education {
  id            Int      @id @default(autoincrement())
  candidateId   Int
  institution   String   @db.VarChar(255)
  degree        String   @db.VarChar(255)
  fieldOfStudy  String?  @db.VarChar(255)
  startDate     DateTime?
  endDate       DateTime?
  isCurrent     Boolean  @default(false)
  description   String?  @db.Text
  
  // Relaciones
  candidate     Candidate @relation(fields: [candidateId], references: [id], onDelete: Cascade)
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@map("educations")
}
```

### WorkExperience (Experiencia Laboral)
Historial laboral del candidato.

```prisma
model WorkExperience {
  id            Int      @id @default(autoincrement())
  candidateId   Int
  company       String   @db.VarChar(255)
  position      String   @db.VarChar(255)
  startDate     DateTime
  endDate       DateTime?
  isCurrent     Boolean  @default(false)
  description   String?  @db.Text
  
  // Relaciones
  candidate     Candidate @relation(fields: [candidateId], references: [id], onDelete: Cascade)
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@map("work_experiences")
}
```

### Document (Documentos)
Archivos asociados al candidato (CV, cartas de presentación, etc.).

```prisma
model Document {
  id            Int      @id @default(autoincrement())
  candidateId   Int
  fileName      String   @db.VarChar(255)  // Nombre del archivo en MinIO
  originalName  String   @db.VarChar(255)  // Nombre original del archivo
  mimeType      String   @db.VarChar(100)
  fileSize      Int
  filePath      String   @db.VarChar(500)  // Ruta completa en MinIO bucket
  bucketName    String   @db.VarChar(100)  // Nombre del bucket en MinIO
  etag          String?  @db.VarChar(255)  // ETag del archivo en MinIO
  documentType  DocumentType @default(CV)
  uploadStatus  UploadStatus @default(PENDING)
  
  // Relaciones
  candidate     Candidate @relation(fields: [candidateId], references: [id], onDelete: Cascade)
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@map("documents")
}

enum UploadStatus {
  PENDING
  UPLOADED
  FAILED
  DELETED
}

enum DocumentType {
  CV
  COVER_LETTER
  CERTIFICATE
  OTHER
}
```

### User (Usuario/Reclutador)
Actualización del modelo existente para incluir relación con candidatos.

```prisma
model User {
  id          Int      @id @default(autoincrement())
  email       String   @unique @db.VarChar(255)
  name        String?  @db.VarChar(100)
  role        UserRole @default(RECRUITER)
  
  // Relaciones
  candidates  Candidate[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("users")
}

enum UserRole {
  ADMIN
  RECRUITER
  MANAGER
}
```

## Reglas de Negocio del Modelo

### Validaciones de Datos
1. **Email único**: Cada candidato debe tener un email único en el sistema
2. **Campos obligatorios**: firstName, lastName, email son requeridos
3. **Formato de email**: Debe cumplir con RFC 5322
4. **Teléfono**: Formato internacional opcional
5. **Fechas**: endDate debe ser posterior a startDate en educación y experiencia

### Relaciones
1. **Candidato-Educación**: Un candidato puede tener múltiples registros educativos
2. **Candidato-Experiencia**: Un candidato puede tener múltiple experiencia laboral
3. **Candidato-Documentos**: Un candidato puede tener múltiples documentos
4. **Usuario-Candidato**: Un reclutador puede crear múltiples candidatos

### Restricciones de Archivos
1. **Tipos permitidos**: PDF, DOCX para CV
2. **Tamaño máximo**: 10MB por archivo
3. **Nomenclatura**: archivos se renombran con UUID para evitar conflictos

## Índices Recomendados

```sql
-- Índices para mejorar rendimiento
CREATE INDEX idx_candidates_email ON candidates(email);
CREATE INDEX idx_candidates_created_by ON candidates(created_by);
CREATE INDEX idx_candidates_created_at ON candidates(created_at);
CREATE INDEX idx_documents_candidate_id ON documents(candidate_id);
CREATE INDEX idx_educations_candidate_id ON educations(candidate_id);
CREATE INDEX idx_work_experiences_candidate_id ON work_experiences(candidate_id);
```

## Consideraciones de Migración
- El modelo actual `User` debe ser extendido con `role` y relaciones
- Se requiere migración para crear las nuevas tablas
- Implementar soft delete si se requiere mantener historial 