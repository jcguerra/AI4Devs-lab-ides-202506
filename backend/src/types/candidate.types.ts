export interface CreateCandidateDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  educations?: CreateEducationDto[];
  experiences?: CreateWorkExperienceDto[];
}

export interface UpdateCandidateDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  educations?: CreateEducationDto[];
  experiences?: CreateWorkExperienceDto[];
}

export interface CreateEducationDto {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate?: Date;
  endDate?: Date;
  isCurrent: boolean;
  description?: string;
}

export interface CreateWorkExperienceDto {
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  description?: string;
}

export interface CandidateFilters {
  search?: string;
  recruiterId?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface CandidateWithRelations {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: number;
  educations: Education[];
  experiences: WorkExperience[];
  documents: Document[];
  recruiter: {
    id: number;
    name: string | null;
    email: string;
  };
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  fieldOfStudy?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  isCurrent: boolean;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkExperience {
  id: number;
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date | null;
  isCurrent: boolean;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: number;
  fileName: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  filePath: string;
  bucketName: string;
  etag?: string | null;
  documentType: 'CV' | 'COVER_LETTER' | 'CERTIFICATE' | 'OTHER';
  uploadStatus: 'PENDING' | 'UPLOADED' | 'FAILED' | 'DELETED';
  createdAt: Date;
  updatedAt: Date;
} 