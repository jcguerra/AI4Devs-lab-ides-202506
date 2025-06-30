import { Request, Response, NextFunction } from 'express';
import { ValidationError, BusinessError, NotFoundError, DuplicateError, FileUploadError } from '../utils/errors';
import { ApiResponse } from '../types/common.types';
import { HTTP_STATUS, ERROR_CODES } from '../utils/constants';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const timestamp = new Date().toISOString();
  
  console.error(`[${timestamp}] Error:`, {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query
  });

  let response: ApiResponse<null>;

  if (error instanceof ValidationError) {
    response = {
      success: false,
      error: {
        code: ERROR_CODES.VALIDATION_ERROR,
        message: error.message,
        field: error.field
      },
      meta: { timestamp }
    };
    res.status(HTTP_STATUS.BAD_REQUEST).json(response);
    return;
  }

  if (error instanceof NotFoundError) {
    response = {
      success: false,
      error: {
        code: ERROR_CODES.NOT_FOUND,
        message: error.message
      },
      meta: { timestamp }
    };
    res.status(HTTP_STATUS.NOT_FOUND).json(response);
    return;
  }

  if (error instanceof DuplicateError) {
    response = {
      success: false,
      error: {
        code: ERROR_CODES.DUPLICATE_EMAIL,
        message: error.message
      },
      meta: { timestamp }
    };
    res.status(HTTP_STATUS.CONFLICT).json(response);
    return;
  }

  if (error instanceof BusinessError) {
    response = {
      success: false,
      error: {
        code: error.code || ERROR_CODES.BUSINESS_ERROR,
        message: error.message
      },
      meta: { timestamp }
    };
    res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json(response);
    return;
  }

  if (error instanceof FileUploadError) {
    response = {
      success: false,
      error: {
        code: ERROR_CODES.INVALID_FILE,
        message: error.message
      },
      meta: { timestamp }
    };
    res.status(HTTP_STATUS.BAD_REQUEST).json(response);
    return;
  }

  // Error genérico
  response = {
    success: false,
    error: {
      code: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: process.env.NODE_ENV === 'production' 
        ? 'Error interno del servidor' 
        : error.message
    },
    meta: { timestamp }
  };
  
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(response);
}; 