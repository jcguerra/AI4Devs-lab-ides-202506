import { PrismaClient, Document, DocumentType, UploadStatus } from '@prisma/client';
import { BaseRepository } from './base.repository';

export interface CreateDocumentDto {
  candidateId: number;
  fileName: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  filePath: string;
  bucketName: string;
  etag?: string;
  documentType: DocumentType;
  uploadStatus?: UploadStatus;
}

export interface UpdateDocumentDto {
  fileName?: string;
  originalName?: string;
  mimeType?: string;
  fileSize?: number;
  filePath?: string;
  bucketName?: string;
  etag?: string;
  documentType?: DocumentType;
  uploadStatus?: UploadStatus;
}

export interface IDocumentRepository {
  create(data: CreateDocumentDto): Promise<Document>;
  findById(id: number): Promise<Document | null>;
  findByCandidateId(candidateId: number): Promise<Document[]>;
  findByFilePath(filePath: string): Promise<Document | null>;
  update(id: number, data: UpdateDocumentDto): Promise<Document>;
  delete(id: number): Promise<void>;
  updateUploadStatus(id: number, status: UploadStatus): Promise<Document>;
}

export class DocumentRepository extends BaseRepository implements IDocumentRepository {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async create(data: CreateDocumentDto): Promise<Document> {
    try {
      return await this.prisma.document.create({
        data: {
          ...data,
          uploadStatus: data.uploadStatus || 'PENDING'
        }
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findById(id: number): Promise<Document | null> {
    return this.prisma.document.findUnique({
      where: { id }
    });
  }

  async findByCandidateId(candidateId: number): Promise<Document[]> {
    return this.prisma.document.findMany({
      where: { candidateId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findByFilePath(filePath: string): Promise<Document | null> {
    return this.prisma.document.findFirst({
      where: { filePath }
    });
  }

  async update(id: number, data: UpdateDocumentDto): Promise<Document> {
    try {
      return await this.prisma.document.update({
        where: { id },
        data
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.prisma.document.delete({
        where: { id }
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async updateUploadStatus(id: number, status: UploadStatus): Promise<Document> {
    try {
      return await this.prisma.document.update({
        where: { id },
        data: { uploadStatus: status }
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }
} 