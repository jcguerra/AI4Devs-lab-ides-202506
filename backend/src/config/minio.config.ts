import { Client } from 'minio';
import { MINIO_CONFIG } from '../utils/constants';

export class MinioConfig {
  private static instance: Client;

  public static getInstance(): Client {
    if (!MinioConfig.instance) {
      MinioConfig.instance = new Client({
        endPoint: MINIO_CONFIG.ENDPOINT,
        port: MINIO_CONFIG.PORT,
        useSSL: MINIO_CONFIG.USE_SSL,
        accessKey: MINIO_CONFIG.ACCESS_KEY,
        secretKey: MINIO_CONFIG.SECRET_KEY,
      });
    }
    return MinioConfig.instance;
  }

  public static async ensureBucketExists(bucketName: string): Promise<void> {
    const client = MinioConfig.getInstance();
    const exists = await client.bucketExists(bucketName);
    
    if (!exists) {
      await client.makeBucket(bucketName, 'us-east-1');
      console.log(`✅ Bucket '${bucketName}' creado exitosamente`);
    }
  }
} 