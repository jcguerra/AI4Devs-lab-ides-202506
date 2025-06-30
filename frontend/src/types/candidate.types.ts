export interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  educations: Education[];
  experiences: WorkExperience[];
  documents: DocumentFile[];
  recruiter: {
    id: number;
    name: string | null;
    email: string;
  };
}

export interface Education {
  id?: number;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate?: string | null;
  endDate?: string | null;
  isCurrent: boolean;
  description?: string;
}

export interface WorkExperience {
  id?: number;
  company: string;
  position: string;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  description?: string;
}

export interface DocumentFile {
  id: number;
  fileName: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  filePath: string;
  bucketName: string;
  etag?: string;
  documentType: 'CV' | 'COVER_LETTER' | 'CERTIFICATE' | 'OTHER';
  uploadStatus: 'PENDING' | 'UPLOADED' | 'FAILED' | 'DELETED';
  createdAt: string;
  updatedAt: string;
  downloadUrl?: string;
}

export interface CreateCandidateDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  educations?: Education[];
  experiences?: WorkExperience[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    field?: string;
  };
  meta?: {
    timestamp: string;
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
} 