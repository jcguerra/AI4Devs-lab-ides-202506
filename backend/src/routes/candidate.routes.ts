import { Router } from 'express';
import { CandidateController } from '../controllers/candidate.controller';
import { CandidateService } from '../services/candidate.service';
import { CandidateRepository } from '../repositories/candidate.repository';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Dependency injection
const candidateRepository = new CandidateRepository(prisma);
const candidateService = new CandidateService(candidateRepository);
const candidateController = new CandidateController(candidateService);

// Rutas de candidatos
router.post('/', candidateController.createCandidate);
router.get('/', candidateController.getAllCandidates);
router.get('/search', candidateController.searchCandidates);
router.get('/:id', candidateController.getCandidateById);
router.put('/:id', candidateController.updateCandidate);
router.delete('/:id', candidateController.deleteCandidate);

export default router; 