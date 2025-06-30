import { Client } from 'minio';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { MinioConfig } from '../config/minio.config';
import { MINIO_CONFIG, FILE_UPLOAD } from '../utils/constants';
import { FileUploadError } from '../utils/errors';

export interface UploadResult {
  fileName: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  filePath: string;
  bucketName: string;
  etag: string;
}

export interface PresignedUrlResult {
  uploadUrl: string;
  fileName: string;
  filePath: string;
}

export class MinioService {
  private client: Client;
  private bucketName: string;

  constructor() {
    this.client = MinioConfig.getInstance();
    this.bucketName = MINIO_CONFIG.BUCKET_NAME;
  }

  async uploadFile(
    file: Express.Multer.File,
    candidateId: number,
    documentType: 'CV' | 'COVER_LETTER' | 'CERTIFICATE' | 'OTHER' = 'CV'
  ): Promise<UploadResult> {
    try {
      // Asegurar que el bucket existe
      await MinioConfig.ensureBucketExists(this.bucketName);

      // Generar nombre único para el archivo
      const fileExtension = path.extname(file.originalname);
      const fileName = `${uuidv4()}${fileExtension}`;
      const filePath = `candidates/${candidateId}/${documentType.toLowerCase()}/${fileName}`;

      // Subir archivo a MinIO
      const uploadInfo = await this.client.putObject(
        this.bucketName,
        filePath,
        file.buffer,
        file.size,
        {
          'Content-Type': file.mimetype,
          'Content-Disposition': `attachment; filename="${file.originalname}"`,
          'X-Original-Name': file.originalname,
          'X-Candidate-Id': candidateId.toString(),
          'X-Document-Type': documentType
        }
      );

      return {
        fileName,
        originalName: file.originalname,
        mimeType: file.mimetype,
        fileSize: file.size,
        filePath,
        bucketName: this.bucketName,
        etag: uploadInfo.etag
      };
    } catch (error: any) {
      throw new FileUploadError(`Error al subir archivo: ${error.message}`);
    }
  }

  async getFile(filePath: string): Promise<Buffer> {
    try {
      const stream = await this.client.getObject(this.bucketName, filePath);
      const chunks: Buffer[] = [];
      
      return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
      });
    } catch (error: any) {
      throw new FileUploadError(`Error al obtener archivo: ${error.message}`);
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      await this.client.removeObject(this.bucketName, filePath);
    } catch (error: any) {
      throw new FileUploadError(`Error al eliminar archivo: ${error.message}`);
    }
  }

  async getPresignedDownloadUrl(filePath: string, expiresIn: number = 3600): Promise<string> {
    try {
      return await this.client.presignedGetObject(this.bucketName, filePath, expiresIn);
    } catch (error: any) {
      throw new FileUploadError(`Error al generar URL de descarga: ${error.message}`);
    }
  }

  async getPresignedUploadUrl(
    candidateId: number,
    fileName: string,
    documentType: 'CV' | 'COVER_LETTER' | 'CERTIFICATE' | 'OTHER' = 'CV',
    expiresIn: number = 3600
  ): Promise<PresignedUrlResult> {
    try {
      // Asegurar que el bucket existe
      await MinioConfig.ensureBucketExists(this.bucketName);

      const fileExtension = path.extname(fileName);
      const uniqueFileName = `${uuidv4()}${fileExtension}`;
      const filePath = `candidates/${candidateId}/${documentType.toLowerCase()}/${uniqueFileName}`;

      const uploadUrl = await this.client.presignedPutObject(
        this.bucketName,
        filePath,
        expiresIn
      );

      return {
        uploadUrl,
        fileName: uniqueFileName,
        filePath
      };
    } catch (error: any) {
      throw new FileUploadError(`Error al generar URL de subida: ${error.message}`);
    }
  }

  async listFiles(candidateId: number): Promise<string[]> {
    try {
      const prefix = `candidates/${candidateId}/`;
      const objectsStream = this.client.listObjects(this.bucketName, prefix, true);
      const files: string[] = [];

      return new Promise((resolve, reject) => {
        objectsStream.on('data', (obj) => {
          if (obj.name) files.push(obj.name);
        });
        objectsStream.on('end', () => resolve(files));
        objectsStream.on('error', reject);
      });
    } catch (error: any) {
      throw new FileUploadError(`Error al listar archivos: ${error.message}`);
    }
  }

  async getFileStats(filePath: string): Promise<any> {
    try {
      return await this.client.statObject(this.bucketName, filePath);
    } catch (error: any) {
      throw new FileUploadError(`Error al obtener estadísticas del archivo: ${error.message}`);
    }
  }
} 