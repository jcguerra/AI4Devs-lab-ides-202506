import { ICandidateRepository } from '../repositories/candidate.repository';
import { CreateCandidateDto, UpdateCandidateDto, CandidateFilters, CandidateWithRelations } from '../types/candidate.types';
import { ValidationError, BusinessError, NotFoundError, DuplicateError } from '../utils/errors';
import { candidateValidationSchema, updateCandidateValidationSchema } from '../utils/validators';
import { PAGINATION } from '../utils/constants';

export class CandidateService {
  constructor(
    private candidateRepository: ICandidateRepository
  ) {}

  async createCandidate(data: CreateCandidateDto, recruiterId: number): Promise<CandidateWithRelations> {
    // Validar datos de entrada
    const { error, value } = candidateValidationSchema.validate(data, { abortEarly: false });
    if (error) {
      throw new ValidationError(
        error.details.map(detail => detail.message).join(', ')
      );
    }

    // Verificar que el candidato no exista
    const existingCandidate = await this.candidateRepository.findByEmail(value.email);
    if (existingCandidate) {
      throw new DuplicateError('Ya existe un candidato con este email');
    }

    // Crear el candidato
    try {
      const candidate = await this.candidateRepository.create(value, recruiterId);
      return candidate as CandidateWithRelations;
    } catch (error: any) {
      if (error.message.includes('ya existe')) {
        throw new DuplicateError('Ya existe un candidato con este email');
      }
      throw new BusinessError('Error al crear el candidato: ' + error.message);
    }
  }

  async getCandidateById(id: number): Promise<CandidateWithRelations> {
    if (!id || id <= 0) {
      throw new ValidationError('ID de candidato inválido');
    }

    const candidate = await this.candidateRepository.findById(id);
    if (!candidate) {
      throw new NotFoundError('Candidato no encontrado');
    }

    return candidate;
  }

  async getAllCandidates(
    filters?: CandidateFilters,
    page: number = PAGINATION.DEFAULT_PAGE,
    limit: number = PAGINATION.DEFAULT_LIMIT
  ): Promise<{
    candidates: CandidateWithRelations[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    // Validar parámetros de paginación
    if (page < 1) page = PAGINATION.DEFAULT_PAGE;
    if (limit < 1 || limit > PAGINATION.MAX_LIMIT) limit = PAGINATION.DEFAULT_LIMIT;

    const result = await this.candidateRepository.findAll(filters, page, limit);
    
    return {
      ...result,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit)
    };
  }

  async updateCandidate(id: number, data: UpdateCandidateDto): Promise<CandidateWithRelations> {
    // Validar que el candidato existe
    await this.getCandidateById(id);

    // Validar datos de entrada
    const { error, value } = updateCandidateValidationSchema.validate(data, { abortEarly: false });
    if (error) {
      throw new ValidationError(
        error.details.map(detail => detail.message).join(', ')
      );
    }

    // Si se está actualizando el email, verificar que no exista otro candidato con ese email
    if (value.email) {
      const existingCandidate = await this.candidateRepository.findByEmail(value.email);
      if (existingCandidate && existingCandidate.id !== id) {
        throw new DuplicateError('Ya existe otro candidato con este email');
      }
    }

    try {
      const updatedCandidate = await this.candidateRepository.update(id, value);
      return updatedCandidate as CandidateWithRelations;
    } catch (error: any) {
      if (error.message.includes('ya existe')) {
        throw new DuplicateError('Ya existe otro candidato con este email');
      }
      throw new BusinessError('Error al actualizar el candidato: ' + error.message);
    }
  }

  async deleteCandidate(id: number): Promise<void> {
    // Validar que el candidato existe
    await this.getCandidateById(id);

    try {
      await this.candidateRepository.delete(id);
    } catch (error: any) {
      throw new BusinessError('Error al eliminar el candidato: ' + error.message);
    }
  }

  async searchCandidates(searchTerm: string, page: number = 1, limit: number = 10): Promise<{
    candidates: CandidateWithRelations[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    if (!searchTerm || searchTerm.trim().length < 2) {
      throw new ValidationError('El término de búsqueda debe tener al menos 2 caracteres');
    }

    const filters: CandidateFilters = {
      search: searchTerm.trim()
    };

    return this.getAllCandidates(filters, page, limit);
  }
} 