import { Request, Response, NextFunction } from 'express';
import { DocumentService } from '../services/document.service';
import { ApiResponse } from '../types/common.types';
import { Document, DocumentType } from '@prisma/client';
import { HTTP_STATUS } from '../utils/constants';

export class DocumentController {
  constructor(private documentService: DocumentService) {}

  uploadDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: {
            code: 'INVALID_FILE',
            message: 'No se ha proporcionado ningún archivo'
          },
          meta: { timestamp: new Date().toISOString() }
        });
        return;
      }

      const candidateId = parseInt(req.params.candidateId);
      const documentType = (req.body.documentType || 'CV') as DocumentType;

      const document = await this.documentService.uploadDocument(
        req.file,
        candidateId,
        documentType
      );

      const response: ApiResponse<Document> = {
        success: true,
        data: document,
        meta: {
          timestamp: new Date().toISOString()
        }
      };

      res.status(HTTP_STATUS.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  };

  getCandidateDocuments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const candidateId = parseInt(req.params.candidateId);
      const withUrls = req.query.withUrls === 'true';

      let documents;
      if (withUrls) {
        documents = await this.documentService.getCandidateDocumentsWithUrls(candidateId);
      } else {
        documents = await this.documentService.getCandidateDocuments(candidateId);
      }

      const response: ApiResponse<typeof documents> = {
        success: true,
        data: documents,
        meta: {
          timestamp: new Date().toISOString(),
          total: documents.length
        }
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  getDocumentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const document = await this.documentService.getDocumentById(id);

      const response: ApiResponse<Document> = {
        success: true,
        data: document,
        meta: {
          timestamp: new Date().toISOString()
        }
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  downloadDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const { buffer, fileName, mimeType } = await this.documentService.downloadDocument(id);

      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Length', buffer.length);

      res.send(buffer);
    } catch (error) {
      next(error);
    }
  };

  getDownloadUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const expiresIn = parseInt(req.query.expiresIn as string) || 3600;

      const downloadUrl = await this.documentService.getDownloadUrl(id, expiresIn);

      const response: ApiResponse<{ downloadUrl: string; expiresIn: number }> = {
        success: true,
        data: { downloadUrl, expiresIn },
        meta: {
          timestamp: new Date().toISOString()
        }
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  deleteDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      await this.documentService.deleteDocument(id);

      const response: ApiResponse<null> = {
        success: true,
        meta: {
          timestamp: new Date().toISOString()
        }
      };

      res.status(HTTP_STATUS.NO_CONTENT).json(response);
    } catch (error) {
      next(error);
    }
  };

  getPresignedUploadUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const candidateId = parseInt(req.params.candidateId);
      const fileName = req.query.fileName as string;
      const documentType = (req.query.documentType || 'CV') as DocumentType;
      const expiresIn = parseInt(req.query.expiresIn as string) || 3600;

      if (!fileName) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: {
            code: 'MISSING_FILENAME',
            message: 'El nombre del archivo es requerido'
          },
          meta: { timestamp: new Date().toISOString() }
        });
        return;
      }

      const result = await this.documentService.getPresignedUploadUrl(
        candidateId,
        fileName,
        documentType,
        expiresIn
      );

      const response: ApiResponse<typeof result> = {
        success: true,
        data: result,
        meta: {
          timestamp: new Date().toISOString()
        }
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  getDocumentsByType = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const candidateId = parseInt(req.params.candidateId);
      const documentType = req.params.documentType as DocumentType;

      const documents = await this.documentService.getDocumentsByType(candidateId, documentType);

      const response: ApiResponse<Document[]> = {
        success: true,
        data: documents,
        meta: {
          timestamp: new Date().toISOString(),
          total: documents.length
        }
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  };
} 