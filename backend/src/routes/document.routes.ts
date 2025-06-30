import { Router } from 'express';
import { DocumentController } from '../controllers/document.controller';
import { DocumentService } from '../services/document.service';
import { DocumentRepository } from '../repositories/document.repository';
import { CandidateRepository } from '../repositories/candidate.repository';
import { MinioService } from '../services/minio.service';
import { singleFileUpload, validateFileUpload, validateDocumentType } from '../middleware/fileUpload.middleware';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Dependency injection
const documentRepository = new DocumentRepository(prisma);
const candidateRepository = new CandidateRepository(prisma);
const minioService = new MinioService();
const documentService = new DocumentService(documentRepository, candidateRepository, minioService);
const documentController = new DocumentController(documentService);

// Rutas para subida de documentos de candidatos
router.post(
  '/candidates/:candidateId/documents',
  singleFileUpload('file'),
  validateFileUpload,
  validateDocumentType,
  documentController.uploadDocument
);

// Rutas para gestión de documentos de candidatos
router.get('/candidates/:candidateId/documents', documentController.getCandidateDocuments);
router.get('/candidates/:candidateId/documents/type/:documentType', documentController.getDocumentsByType);

// Rutas para URLs pre-firmadas de subida
router.get('/candidates/:candidateId/presigned-upload-url', documentController.getPresignedUploadUrl);

// Rutas para documentos individuales
router.get('/documents/:id', documentController.getDocumentById);
router.get('/documents/:id/download', documentController.downloadDocument);
router.get('/documents/:id/download-url', documentController.getDownloadUrl);
router.delete('/documents/:id', documentController.deleteDocument);

export default router; 