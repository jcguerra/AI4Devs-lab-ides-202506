import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { FILE_UPLOAD } from '../utils/constants';
import { FileUploadError } from '../utils/errors';

// Configuración de Multer para memoria
const storage = multer.memoryStorage();

// Filtro de archivos
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Validar tipo MIME
  if (!FILE_UPLOAD.ALLOWED_MIME_TYPES.includes(file.mimetype as any)) {
    const error = new FileUploadError(
      `Tipo de archivo no permitido. Solo se aceptan: ${FILE_UPLOAD.ALLOWED_MIME_TYPES.join(', ')}`
    );
    return cb(error);
  }

  // Validar extensión del archivo
  const allowedExtensions = ['.pdf', '.docx'];
  const fileExtension = file.originalname.toLowerCase().split('.').pop();
  
  if (!fileExtension || !allowedExtensions.includes(`.${fileExtension}`)) {
    const error = new FileUploadError(
      `Extensión de archivo no permitida. Solo se aceptan: ${allowedExtensions.join(', ')}`
    );
    return cb(error);
  }

  cb(null, true);
};

// Configuración de Multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: FILE_UPLOAD.MAX_SIZE,
    files: 5, // Máximo 5 archivos por request
  },
});

// Middleware para un solo archivo
export const singleFileUpload = (fieldName: string = 'file') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const uploadSingle = upload.single(fieldName);
    
    uploadSingle(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new FileUploadError(`El archivo excede el tamaño máximo permitido de ${FILE_UPLOAD.MAX_SIZE / 1024 / 1024}MB`));
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return next(new FileUploadError('Campo de archivo no esperado'));
        }
        return next(new FileUploadError(`Error en la subida del archivo: ${err.message}`));
      }
      
      if (err) {
        return next(err);
      }
      
      next();
    });
  };
};

// Middleware para múltiples archivos
export const multipleFilesUpload = (fieldName: string = 'files', maxCount: number = 5) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const uploadMultiple = upload.array(fieldName, maxCount);
    
    uploadMultiple(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new FileUploadError(`Uno o más archivos exceden el tamaño máximo permitido de ${FILE_UPLOAD.MAX_SIZE / 1024 / 1024}MB`));
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return next(new FileUploadError(`Se permiten máximo ${maxCount} archivos`));
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return next(new FileUploadError('Campo de archivo no esperado'));
        }
        return next(new FileUploadError(`Error en la subida de archivos: ${err.message}`));
      }
      
      if (err) {
        return next(err);
      }
      
      next();
    });
  };
};

// Middleware de validación adicional
export const validateFileUpload = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file && !req.files) {
    return next(new FileUploadError('No se ha proporcionado ningún archivo'));
  }

  // Validación adicional del candidateId en params
  const candidateId = parseInt(req.params.candidateId || req.params.id);
  if (!candidateId || candidateId <= 0) {
    return next(new FileUploadError('ID de candidato inválido'));
  }

  next();
};

// Middleware para validar tipo de documento
export const validateDocumentType = (req: Request, res: Response, next: NextFunction) => {
  const documentType = req.body.documentType || req.query.documentType || 'CV';
  const validTypes = ['CV', 'COVER_LETTER', 'CERTIFICATE', 'OTHER'];
  
  if (!validTypes.includes(documentType)) {
    return next(new FileUploadError(`Tipo de documento inválido. Valores permitidos: ${validTypes.join(', ')}`));
  }
  
  req.body.documentType = documentType;
  next();
}; 