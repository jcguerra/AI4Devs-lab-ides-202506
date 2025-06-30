export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  BUSINESS_ERROR: 'BUSINESS_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  DUPLICATE_EMAIL: 'DUPLICATE_EMAIL',
  INVALID_FILE: 'INVALID_FILE',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
} as const;

export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_MIME_TYPES: [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  BUCKET_NAME: 'ats-bucket',
} as const;

export const MINIO_CONFIG = {
  ENDPOINT: process.env.MINIO_ENDPOINT || 'localhost',
  PORT: parseInt(process.env.MINIO_PORT || '9000'),
  USE_SSL: process.env.MINIO_USE_SSL === 'true',
  ACCESS_KEY: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  SECRET_KEY: process.env.MINIO_SECRET_KEY || 'minioadmin',
  BUCKET_NAME: process.env.MINIO_BUCKET_NAME || 'ats-bucket',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const; 