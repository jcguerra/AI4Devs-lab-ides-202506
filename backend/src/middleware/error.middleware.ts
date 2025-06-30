import { Request, Response, NextFunction } from 'express';
import { 
  ValidationError, 
  NotFoundError, 
  DuplicateError, 
  BusinessError, 
  FileUploadError 
} from '../utils/errors';
import { HTTP_STATUS } from '../utils/constants';

interface ErrorResponse {
  success: boolean;
  error: {
    type: string;
    message: string;
    code?: string;
    details?: any;
    timestamp: string;
    path: string;
    method: string;
    requestId?: string;
  };
  meta: {
    timestamp: string;
    version: string;
    environment: string;
  };
}

interface CustomError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

export const errorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const timestamp = new Date().toISOString();
  const requestId = req.headers['x-request-id'] as string || generateRequestId();
  
  // Log detallado del error para debugging
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    body: req.method !== 'GET' ? req.body : undefined,
    params: req.params,
    query: req.query,
    headers: {
      'user-agent': req.headers['user-agent'],
      'content-type': req.headers['content-type'],
      'authorization': req.headers['authorization'] ? '[REDACTED]' : undefined
    },
    ip: req.ip,
    timestamp,
    requestId
  };

  console.error(`[${timestamp}] Error:`, errorInfo);
  
  let statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let errorType = 'InternalServerError';
  let errorMessage = 'Error interno del servidor';
  let errorCode: string | undefined;
  let errorDetails: any = undefined;

  // Manejo específico por tipo de error
  if (error instanceof ValidationError || error.name === 'ValidationError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    errorType = 'ValidationError';
    errorMessage = error.message;
    errorCode = 'VALIDATION_FAILED';
  } else if (error instanceof NotFoundError || error.name === 'NotFoundError') {
    statusCode = HTTP_STATUS.NOT_FOUND;
    errorType = 'NotFoundError';
    errorMessage = error.message;
    errorCode = 'RESOURCE_NOT_FOUND';
  } else if (error instanceof DuplicateError || error.name === 'DuplicateError') {
    statusCode = HTTP_STATUS.CONFLICT;
    errorType = 'DuplicateError';
    errorMessage = error.message;
    errorCode = 'RESOURCE_CONFLICT';
  } else if (error instanceof FileUploadError || error.name === 'FileUploadError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    errorType = 'FileUploadError';
    errorMessage = error.message;
    errorCode = 'FILE_UPLOAD_FAILED';
  } else if (error instanceof BusinessError || error.name === 'BusinessError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    errorType = 'BusinessError';
    errorMessage = error.message;
    errorCode = 'BUSINESS_RULE_VIOLATION';
  } else if (error.name === 'SyntaxError' && error.message.includes('JSON')) {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    errorType = 'JSONSyntaxError';
    errorMessage = 'JSON inválido en el cuerpo de la petición';
    errorCode = 'INVALID_JSON';
  } else if (error.name === 'MulterError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    errorType = 'FileUploadError';
    errorCode = 'FILE_UPLOAD_ERROR';
    
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        errorMessage = 'El archivo excede el tamaño máximo permitido';
        break;
      case 'LIMIT_FILE_COUNT':
        errorMessage = 'Se excedió el número máximo de archivos permitidos';
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        errorMessage = 'Campo de archivo inesperado';
        break;
      default:
        errorMessage = 'Error en la subida del archivo';
    }
  } else if (error.name === 'PrismaClientKnownRequestError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    errorType = 'DatabaseError';
    errorCode = 'DATABASE_ERROR';
    
    // Manejo específico de errores de Prisma
    switch (error.code) {
      case 'P2002':
        errorMessage = 'Ya existe un registro con estos datos únicos';
        break;
      case 'P2025':
        errorMessage = 'Registro no encontrado';
        statusCode = HTTP_STATUS.NOT_FOUND;
        break;
      default:
        errorMessage = 'Error en la base de datos';
    }
  } else if (error.name === 'PrismaClientValidationError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    errorType = 'DatabaseValidationError';
    errorMessage = 'Error de validación en la base de datos';
    errorCode = 'DATABASE_VALIDATION_ERROR';
  } else if (error.statusCode) {
    // Error con código de estado personalizado
    statusCode = error.statusCode;
    errorMessage = error.message;
    errorType = 'CustomError';
    errorCode = 'CUSTOM_ERROR';
  }

  // Asegurar que siempre hay un código de error
  if (!errorCode) {
    errorCode = 'INTERNAL_SERVER_ERROR';
  }

  // En desarrollo, incluir más detalles para debugging
  if (process.env.NODE_ENV === 'development') {
    errorDetails = {
      stack: error.stack,
      originalError: error.name,
      prismaCode: error.code
    };
  }

  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      type: errorType,
      message: errorMessage,
      code: errorCode,
      details: errorDetails,
      timestamp,
      path: req.path,
      method: req.method,
      requestId
    },
    meta: {
      timestamp,
      version: 'v1',
      environment: process.env.NODE_ENV || 'development'
    }
  };

  // Rate limiting para logs de errores críticos
  if (statusCode >= 500) {
    console.error('🚨 ERROR CRÍTICO:', {
      error: errorType,
      message: errorMessage,
      path: req.path,
      method: req.method,
      timestamp
    });
    
    // En producción, aquí se podría integrar con servicios como Sentry, DataDog, etc.
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrar con servicio de monitoreo
      // await notificationService.sendCriticalAlert(errorInfo);
    }
  }

  res.status(statusCode).json(errorResponse);
};

/**
 * Middleware para manejar rutas no encontradas
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new NotFoundError(`Ruta no encontrada: ${req.method} ${req.path}`);
  next(error);
};

/**
 * Middleware para capturar errores asíncronos
 */
export const asyncErrorHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Generar ID único para la petición
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
} 