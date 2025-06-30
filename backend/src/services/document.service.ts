import { Document, DocumentType, UploadStatus } from '@prisma/client';
import { IDocumentRepository, CreateDocumentDto } from '../repositories/document.repository';
import { ICandidateRepository } from '../repositories/candidate.repository';
import { MinioService, UploadResult, PresignedUrlResult } from './minio.service';
import { ValidationError, BusinessError, NotFoundError, FileUploadError } from '../utils/errors';

export interface DocumentWithPresignedUrl extends Document {
  downloadUrl?: string;
}

export class DocumentService {
  constructor(
    private documentRepository: IDocumentRepository,
    private candidateRepository: ICandidateRepository,
    private minioService: MinioService
  ) {}

  async uploadDocument(
    file: Express.Multer.File,
    candidateId: number,
    documentType: DocumentType = 'CV'
  ): Promise<Document> {
    // Verificar que el candidato existe
    const candidate = await this.candidateRepository.findById(candidateId);
    if (!candidate) {
      throw new NotFoundError('Candidato no encontrado');
    }

    try {
      // Subir archivo a MinIO
      const uploadResult: UploadResult = await this.minioService.uploadFile(
        file,
        candidateId,
        documentType
      );

      // Crear registro en base de datos
      const documentData: CreateDocumentDto = {
        candidateId,
        fileName: uploadResult.fileName,
        originalName: uploadResult.originalName,
        mimeType: uploadResult.mimeType,
        fileSize: uploadResult.fileSize,
        filePath: uploadResult.filePath,
        bucketName: uploadResult.bucketName,
        etag: uploadResult.etag,
        documentType,
        uploadStatus: 'UPLOADED'
      };

      const document = await this.documentRepository.create(documentData);
      console.log(`✅ Documento subido exitosamente: ${document.id} para candidato ${candidateId}`);
      
      return document;
    } catch (error: any) {
      console.error(`❌ Error subiendo documento para candidato ${candidateId}:`, error);
      throw new FileUploadError(`Error al subir documento: ${error.message}`);
    }
  }

  async getDocumentById(id: number): Promise<Document> {
    const document = await this.documentRepository.findById(id);
    if (!document) {
      throw new NotFoundError('Documento no encontrado');
    }
    return document;
  }

  async getCandidateDocuments(candidateId: number): Promise<Document[]> {
    // Verificar que el candidato existe
    const candidate = await this.candidateRepository.findById(candidateId);
    if (!candidate) {
      throw new NotFoundError('Candidato no encontrado');
    }

    return this.documentRepository.findByCandidateId(candidateId);
  }

  async getCandidateDocumentsWithUrls(candidateId: number): Promise<DocumentWithPresignedUrl[]> {
    const documents = await this.getCandidateDocuments(candidateId);
    
    // Generar URLs de descarga para cada documento
    const documentsWithUrls = await Promise.all(
      documents.map(async (doc) => {
        try {
          const downloadUrl = await this.minioService.getPresignedDownloadUrl(doc.filePath);
          return { ...doc, downloadUrl };
        } catch (error) {
          console.error(`Error generando URL para documento ${doc.id}:`, error);
          return { ...doc, downloadUrl: undefined };
        }
      })
    );

    return documentsWithUrls;
  }

  async downloadDocument(id: number): Promise<{ 
    buffer: Buffer; 
    fileName: string; 
    mimeType: string; 
  }> {
    const document = await this.getDocumentById(id);
    
    try {
      const buffer = await this.minioService.getFile(document.filePath);
      return {
        buffer,
        fileName: document.originalName,
        mimeType: document.mimeType
      };
    } catch (error: any) {
      throw new FileUploadError(`Error al descargar documento: ${error.message}`);
    }
  }

  async getDownloadUrl(id: number, expiresIn: number = 3600): Promise<string> {
    const document = await this.getDocumentById(id);
    
    try {
      return await this.minioService.getPresignedDownloadUrl(document.filePath, expiresIn);
    } catch (error: any) {
      throw new FileUploadError(`Error al generar URL de descarga: ${error.message}`);
    }
  }

  async deleteDocument(id: number): Promise<void> {
    const document = await this.getDocumentById(id);
    
    try {
      // Eliminar archivo de MinIO
      await this.minioService.deleteFile(document.filePath);
      
      // Eliminar registro de base de datos
      await this.documentRepository.delete(id);
      
      console.log(`✅ Documento eliminado exitosamente: ${id}`);
    } catch (error: any) {
      // Si falla la eliminación de MinIO, marcar como DELETED en base de datos
      try {
        await this.documentRepository.updateUploadStatus(id, 'DELETED');
      } catch (dbError) {
        console.error(`Error actualizando estado del documento ${id}:`, dbError);
      }
      
      throw new FileUploadError(`Error al eliminar documento: ${error.message}`);
    }
  }

  async getPresignedUploadUrl(
    candidateId: number,
    fileName: string,
    documentType: DocumentType = 'CV',
    expiresIn: number = 3600
  ): Promise<PresignedUrlResult> {
    // Verificar que el candidato existe
    const candidate = await this.candidateRepository.findById(candidateId);
    if (!candidate) {
      throw new NotFoundError('Candidato no encontrado');
    }

    try {
      return await this.minioService.getPresignedUploadUrl(
        candidateId,
        fileName,
        documentType,
        expiresIn
      );
    } catch (error: any) {
      throw new FileUploadError(`Error al generar URL de subida: ${error.message}`);
    }
  }

  async updateDocumentStatus(id: number, status: UploadStatus): Promise<Document> {
    const document = await this.getDocumentById(id);
    
    try {
      return await this.documentRepository.updateUploadStatus(id, status);
    } catch (error: any) {
      throw new BusinessError(`Error al actualizar estado del documento: ${error.message}`);
    }
  }

  async getDocumentsByType(candidateId: number, documentType: DocumentType): Promise<Document[]> {
    const allDocuments = await this.getCandidateDocuments(candidateId);
    return allDocuments.filter(doc => doc.documentType === documentType);
  }
} 