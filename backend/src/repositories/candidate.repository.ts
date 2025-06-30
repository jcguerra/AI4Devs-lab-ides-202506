import { PrismaClient, Candidate, Education, WorkExperience, Document } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { CreateCandidateDto, UpdateCandidateDto, CandidateFilters, CandidateWithRelations } from '../types/candidate.types';

export interface ICandidateRepository {
  create(data: CreateCandidateDto, recruiterId: number): Promise<Candidate>;
  findById(id: number): Promise<CandidateWithRelations | null>;
  findByEmail(email: string): Promise<Candidate | null>;
  findAll(filters?: CandidateFilters, page?: number, limit?: number): Promise<{
    candidates: CandidateWithRelations[];
    total: number;
  }>;
  update(id: number, data: UpdateCandidateDto): Promise<Candidate>;
  delete(id: number): Promise<void>;
}

export class CandidateRepository extends BaseRepository implements ICandidateRepository {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async create(data: CreateCandidateDto, recruiterId: number): Promise<Candidate> {
    try {
      const { educations, experiences, ...candidateData } = data;
      
      const candidate = await this.prisma.candidate.create({
        data: {
          ...candidateData,
          createdBy: recruiterId,
          educations: educations ? {
            create: educations
          } : undefined,
          experiences: experiences ? {
            create: experiences
          } : undefined
        },
        include: {
          educations: true,
          experiences: true,
          documents: true,
          recruiter: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      return candidate;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findById(id: number): Promise<CandidateWithRelations | null> {
    return this.prisma.candidate.findUnique({
      where: { id },
      include: {
        educations: true,
        experiences: true,
        documents: true,
        recruiter: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }

  async findByEmail(email: string): Promise<Candidate | null> {
    return this.prisma.candidate.findUnique({
      where: { email }
    });
  }

  async findAll(
    filters?: CandidateFilters, 
    page: number = 1, 
    limit: number = 10
  ): Promise<{
    candidates: CandidateWithRelations[];
    total: number;
  }> {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    if (filters?.search) {
      where.OR = [
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { lastName: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } }
      ];
    }
    
    if (filters?.recruiterId) {
      where.createdBy = filters.recruiterId;
    }
    
    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.createdAt.lte = filters.endDate;
      }
    }

    const [candidates, total] = await Promise.all([
      this.prisma.candidate.findMany({
        where,
        skip,
        take: limit,
        include: {
          educations: true,
          experiences: true,
          documents: true,
          recruiter: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      this.prisma.candidate.count({ where })
    ]);

    return { candidates, total };
  }

  async update(id: number, data: UpdateCandidateDto): Promise<Candidate> {
    try {
      const { educations, experiences, ...candidateData } = data;
      
      // Si se proporcionan educaciones o experiencias, las reemplazamos completamente
      const updateData: any = { ...candidateData };
      
      if (educations !== undefined) {
        updateData.educations = {
          deleteMany: {},
          create: educations
        };
      }
      
      if (experiences !== undefined) {
        updateData.experiences = {
          deleteMany: {},
          create: experiences
        };
      }

      return await this.prisma.candidate.update({
        where: { id },
        data: updateData,
        include: {
          educations: true,
          experiences: true,
          documents: true,
          recruiter: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.prisma.candidate.delete({
        where: { id }
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }
} 