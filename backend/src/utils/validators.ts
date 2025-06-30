import Joi from 'joi';

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  // Validación para teléfonos: permite espacios, paréntesis, guiones, y símbolo +
  // Mínimo 7 y máximo 15 caracteres
  const phoneRegex = /^[\+]?[\d\s\(\)\-]{7,15}$/;
  return phoneRegex.test(phone.trim());
};

export const candidateValidationSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.empty': 'El nombre es obligatorio',
      'string.max': 'El nombre no puede exceder 100 caracteres',
      'any.required': 'El nombre es obligatorio'
    }),
    
  lastName: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.empty': 'El apellido es obligatorio',
      'string.max': 'El apellido no puede exceder 100 caracteres',
      'any.required': 'El apellido es obligatorio'
    }),
    
  email: Joi.string()
    .email()
    .max(255)
    .required()
    .messages({
      'string.email': 'El email debe tener un formato válido',
      'string.max': 'El email no puede exceder 255 caracteres',
      'any.required': 'El email es obligatorio'
    }),
    
  phone: Joi.string()
    .pattern(/^[\+]?[\d\s\(\)\-]{7,15}$/)
    .required()
    .messages({
      'string.pattern.base': 'El teléfono debe tener entre 7 y 15 caracteres y puede incluir espacios, paréntesis, guiones y símbolo +',
      'any.required': 'El teléfono es obligatorio'
    }),
    
  address: Joi.string()
    .trim()
    .min(1)
    .max(255)
    .pattern(/^[a-zA-Z0-9\s\.,\-#\/]+$/)
    .required()
    .messages({
      'string.empty': 'La dirección es obligatoria',
      'string.max': 'La dirección no puede exceder 255 caracteres',
      'string.pattern.base': 'La dirección solo puede contener letras, números, espacios y los signos: . , - # /',
      'any.required': 'La dirección es obligatoria'
    }),
    
  educations: Joi.array().items(
    Joi.object({
      institution: Joi.string().trim().min(1).max(255).required(),
      degree: Joi.string().trim().min(1).max(255).required(),
      fieldOfStudy: Joi.string().trim().max(255).allow(''),
      startDate: Joi.date().iso().allow(null),
      endDate: Joi.alternatives().try(
        Joi.date().iso(),
        Joi.string().allow(''),
        Joi.allow(null)
      ),
      isCurrent: Joi.boolean().required(),
      description: Joi.string().trim().allow('')
    })
  ).optional(),
  
  experiences: Joi.array().items(
    Joi.object({
      company: Joi.string().trim().min(1).max(255).required(),
      position: Joi.string().trim().min(1).max(255).required(),
      startDate: Joi.date().iso().required(),
      endDate: Joi.alternatives().try(
        Joi.date().iso(),
        Joi.string().allow(''),
        Joi.allow(null)
      ),
      isCurrent: Joi.boolean().required(),
      description: Joi.string().trim().allow('')
    })
  ).optional()
});

export const updateCandidateValidationSchema = candidateValidationSchema.fork(
  ['firstName', 'lastName', 'email', 'phone', 'address'],
  (schema) => schema.optional()
); 