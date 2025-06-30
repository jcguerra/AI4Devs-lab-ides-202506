import { Request, Response, NextFunction } from 'express';
import { CandidateService } from '../services/candidate.service';
import { ApiResponse } from '../types/common.types';
import { CandidateWithRelations, CreateCandidateDto, UpdateCandidateDto, CandidateFilters } from '../types/candidate.types';
import { HTTP_STATUS, ERROR_CODES, PAGINATION } from '../utils/constants';

export class CandidateController {
  constructor(private candidateService: CandidateService) {}

  createCandidate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const candidateData: CreateCandidateDto = req.body;
      // TODO: Obtener recruiterId del usuario autenticado cuando se implemente auth
      const recruiterId = 1; // Hardcoded por ahora
      
      const candidate = await this.candidateService.createCandidate(candidateData, recruiterId);
      
      const response: ApiResponse<CandidateWithRelations> = {
        success: true,
        data: candidate,
        meta: {
          timestamp: new Date().toISOString()
        }
      };
      
      res.status(HTTP_STATUS.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  };

  getCandidateById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const candidate = await this.candidateService.getCandidateById(id);
      
      const response: ApiResponse<CandidateWithRelations> = {
        success: true,
        data: candidate,
        meta: {
          timestamp: new Date().toISOString()
        }
      };
      
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  getAllCandidates = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || PAGINATION.DEFAULT_PAGE;
      const limit = parseInt(req.query.limit as string) || PAGINATION.DEFAULT_LIMIT;
      const search = req.query.search as string;
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
      
      const filters: CandidateFilters = {
        search,
        startDate,
        endDate
      };
      
      const result = await this.candidateService.getAllCandidates(filters, page, limit);
      
      const response: ApiResponse<CandidateWithRelations[]> = {
        success: true,
        data: result.candidates,
        meta: {
          timestamp: new Date().toISOString(),
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages
        }
      };
      
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  updateCandidate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const updateData: UpdateCandidateDto = req.body;
      
      const candidate = await this.candidateService.updateCandidate(id, updateData);
      
      const response: ApiResponse<CandidateWithRelations> = {
        success: true,
        data: candidate,
        meta: {
          timestamp: new Date().toISOString()
        }
      };
      
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  deleteCandidate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      await this.candidateService.deleteCandidate(id);
      
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

  searchCandidates = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const searchTerm = req.query.q as string;
      const page = parseInt(req.query.page as string) || PAGINATION.DEFAULT_PAGE;
      const limit = parseInt(req.query.limit as string) || PAGINATION.DEFAULT_LIMIT;
      
      const result = await this.candidateService.searchCandidates(searchTerm, page, limit);
      
      const response: ApiResponse<CandidateWithRelations[]> = {
        success: true,
        data: result.candidates,
        meta: {
          timestamp: new Date().toISOString(),
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages
        }
      };
      
      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  };
} 