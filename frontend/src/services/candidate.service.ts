import { apiService } from './api.service';
import { Candidate, CreateCandidateDto, ApiResponse } from '../types/candidate.types';

class CandidateService {
  private baseEndpoint = '/candidates';

  async getAllCandidates(params?: {
    page?: number;
    limit?: number;
    search?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<Candidate[]>> {
    return apiService.get<Candidate[]>(this.baseEndpoint, params);
  }

  async getCandidateById(id: number): Promise<ApiResponse<Candidate>> {
    return apiService.get<Candidate>(`${this.baseEndpoint}/${id}`);
  }

  async createCandidate(candidateData: CreateCandidateDto): Promise<ApiResponse<Candidate>> {
    return apiService.post<Candidate>(this.baseEndpoint, candidateData);
  }

  async updateCandidate(id: number, candidateData: Partial<CreateCandidateDto>): Promise<ApiResponse<Candidate>> {
    return apiService.put<Candidate>(`${this.baseEndpoint}/${id}`, candidateData);
  }

  async deleteCandidate(id: number): Promise<ApiResponse<null>> {
    return apiService.delete<null>(`${this.baseEndpoint}/${id}`);
  }

  async searchCandidates(searchTerm: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<Candidate[]>> {
    return apiService.get<Candidate[]>(`${this.baseEndpoint}/search`, {
      q: searchTerm,
      ...params
    });
  }

  // Métodos para documentos
  async uploadDocument(
    candidateId: number, 
    file: File, 
    documentType: 'CV' | 'COVER_LETTER' | 'CERTIFICATE' | 'OTHER' = 'CV'
  ): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    
    return apiService.upload(`/candidates/${candidateId}/documents`, formData);
  }

  async getCandidateDocuments(candidateId: number, withUrls: boolean = false): Promise<ApiResponse<any[]>> {
    return apiService.get(`/candidates/${candidateId}/documents`, { withUrls });
  }

  async deleteDocument(documentId: number): Promise<ApiResponse<null>> {
    return apiService.delete(`/documents/${documentId}`);
  }

  async getDownloadUrl(documentId: number): Promise<ApiResponse<{ downloadUrl: string; expiresIn: number }>> {
    return apiService.get(`/documents/${documentId}/download-url`);
  }
}

export const candidateService = new CandidateService();
export default candidateService; 