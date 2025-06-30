import { PrismaClient } from '@prisma/client';

export abstract class BaseRepository {
  protected prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  protected handlePrismaError(error: any): never {
    if (error.code === 'P2002') {
      throw new Error('El recurso ya existe');
    }
    if (error.code === 'P2025') {
      throw new Error('Recurso no encontrado');
    }
    throw error;
  }
} 