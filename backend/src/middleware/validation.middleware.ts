import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { ValidationError } from '../utils/errors';

export interface ValidationOptions {
  body?: Schema;
  query?: Schema;
  params?: Schema;
  headers?: Schema;
}

/**
 * Middleware para validar datos de entrada usando esquemas Joi
 */
export const validate = (schemas: ValidationOptions) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: string[] = [];

    // Validar body
    if (schemas.body) {
      const { error } = schemas.body.validate(req.body);
      if (error) {
        errors.push(`Body: ${error.details.map(d => d.message).join(', ')}`);
      }
    }

    // Validar query parameters
    if (schemas.query) {
      const { error } = schemas.query.validate(req.query);
      if (error) {
        errors.push(`Query: ${error.details.map(d => d.message).join(', ')}`);
      }
    }

    // Validar path parameters
    if (schemas.params) {
      const { error } = schemas.params.validate(req.params);
      if (error) {
        errors.push(`Params: ${error.details.map(d => d.message).join(', ')}`);
      }
    }

    // Validar headers
    if (schemas.headers) {
      const { error } = schemas.headers.validate(req.headers);
      if (error) {
        errors.push(`Headers: ${error.details.map(d => d.message).join(', ')}`);
      }
    }

    if (errors.length > 0) {
      throw new ValidationError(errors.join('; '));
    }

    next();
  };
};

/**
 * Esquemas de validación comunes
 */
export const commonSchemas = {
  // ID parameter validation
  idParam: require('joi').object({
    id: require('joi').number().integer().positive().required()
      .messages({
        'number.base': 'El ID debe ser un número',
        'number.integer': 'El ID debe ser un número entero',
        'number.positive': 'El ID debe ser positivo',
        'any.required': 'El ID es obligatorio'
      })
  }),

  // Pagination query validation
  paginationQuery: require('joi').object({
    page: require('joi').number().integer().min(1).default(1)
      .messages({
        'number.base': 'La página debe ser un número',
        'number.integer': 'La página debe ser un número entero',
        'number.min': 'La página debe ser mayor a 0'
      }),
    limit: require('joi').number().integer().min(1).max(100).default(10)
      .messages({
        'number.base': 'El límite debe ser un número',
        'number.integer': 'El límite debe ser un número entero',
        'number.min': 'El límite debe ser mayor a 0',
        'number.max': 'El límite no puede ser mayor a 100'
      })
  }),

  // Search query validation
  searchQuery: require('joi').object({
    q: require('joi').string().min(1).max(255).required()
      .messages({
        'string.base': 'El término de búsqueda debe ser texto',
        'string.min': 'El término de búsqueda no puede estar vacío',
        'string.max': 'El término de búsqueda no puede exceder 255 caracteres',
        'any.required': 'El término de búsqueda es obligatorio'
      }),
    page: require('joi').number().integer().min(1).default(1),
    limit: require('joi').number().integer().min(1).max(100).default(10)
  })
}; 