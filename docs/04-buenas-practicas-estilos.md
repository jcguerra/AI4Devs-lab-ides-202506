# Buenas Prácticas y Estilos de Programación - Sistema ATS

## Principios Generales de Desarrollo

### 1. SOLID Principles
- **Single Responsibility**: Cada clase/función tiene una responsabilidad específica
- **Open/Closed**: Abierto para extensión, cerrado para modificación
- **Liskov Substitution**: Las clases derivadas deben ser sustituibles por sus bases
- **Interface Segregation**: Interfaces específicas mejor que interfaces generales
- **Dependency Inversion**: Depender de abstracciones, no de concreciones

### 2. Clean Code
- Nombres descriptivos y significativos
- Funciones pequeñas (máximo 20 líneas)
- Evitar comentarios innecesarios
- Principio DRY (Don't Repeat Yourself)
- Principio YAGNI (You Aren't Gonna Need It)

## Estándares de Código TypeScript

### Nomenclatura
```typescript
// Variables y funciones: camelCase
const candidateData = {...};
const validateCandidateEmail = () => {};

// Clases e Interfaces: PascalCase
class CandidateService {}
interface CreateCandidateDto {}

// Constantes: UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 10485760;
const API_ENDPOINTS = {...};

// Tipos y Enums: PascalCase
type CandidateStatus = 'active' | 'inactive';
enum DocumentType { CV = 'cv', COVER_LETTER = 'cover_letter' }
```

### Estructura de Funciones
```typescript
/**
 * Crea un nuevo candidato en el sistema
 * @param candidateData - Datos del candidato
 * @param recruiterId - ID del reclutador
 * @returns Promise con el candidato creado
 */
export async function createCandidate(
  candidateData: CreateCandidateDto,
  recruiterId: number
): Promise<ApiResponse<Candidate>> {
  // 1. Validaciones de entrada
  if (!candidateData.email || !isValidEmail(candidateData.email)) {
    throw new ValidationError('Email inválido');
  }

  // 2. Lógica de negocio
  const candidate = await candidateRepository.create({
    ...candidateData,
    createdBy: recruiterId
  });

  // 3. Respuesta estructurada
  return {
    success: true,
    data: candidate,
    meta: { timestamp: new Date().toISOString() }
  };
}
```

## Patrones de Desarrollo Backend

### Repository Pattern
```typescript
// Interfaz del repositorio
interface ICandidateRepository {
  create(data: CreateCandidateDto): Promise<Candidate>;
  findById(id: number): Promise<Candidate | null>;
  findByEmail(email: string): Promise<Candidate | null>;
  update(id: number, data: UpdateCandidateDto): Promise<Candidate>;
  delete(id: number): Promise<void>;
}

// Implementación del repositorio
class CandidateRepository implements ICandidateRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateCandidateDto): Promise<Candidate> {
    return this.prisma.candidate.create({ data });
  }
  // ... resto de métodos
}
```

### Service Layer Pattern
```typescript
class CandidateService {
  constructor(
    private candidateRepo: ICandidateRepository,
    private documentService: IDocumentService,
    private minioService: IMinioService,
    private emailService: IEmailService,
    private logger: ILogger
  ) {}

  async createCandidate(data: CreateCandidateDto, recruiterId: number): Promise<Candidate> {
    try {
      // Validaciones
      await this.validateCandidateData(data);
      
      // Verificar duplicados
      const existingCandidate = await this.candidateRepo.findByEmail(data.email);
      if (existingCandidate) {
        throw new BusinessError('Candidato ya existe con este email');
      }

      // Crear candidato
      const candidate = await this.candidateRepo.create({
        ...data,
        createdBy: recruiterId
      });

      this.logger.info(`Candidato creado: ${candidate.id}`, { candidateId: candidate.id });
      return candidate;

    } catch (error) {
      this.logger.error('Error creando candidato', { error, data });
      throw error;
    }
  }
}
```

### Error Handling
```typescript
// Tipos de errores personalizados
export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class BusinessError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'BusinessError';
  }
}

// Middleware de manejo de errores
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const timestamp = new Date().toISOString();
  
  if (error instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: error.message,
        field: error.field
      },
      meta: { timestamp }
    });
  }

  if (error instanceof BusinessError) {
    return res.status(422).json({
      success: false,
      error: {
        code: error.code || 'BUSINESS_ERROR',
        message: error.message
      },
      meta: { timestamp }
    });
  }

  // Error genérico
  logger.error('Error no manejado', { error });
  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Error interno del servidor'
    },
    meta: { timestamp }
  });
};
```

## Patrones de Desarrollo Frontend (React)

### Estructura de Componentes
```typescript
interface CandidateFormProps {
  onSubmit: (data: CreateCandidateDto) => void;
  initialData?: Partial<Candidate>;
  isLoading?: boolean;
}

export const CandidateForm: React.FC<CandidateFormProps> = ({
  onSubmit,
  initialData,
  isLoading = false
}) => {
  // Estados locales
  const [formData, setFormData] = useState<CreateCandidateDto>({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    address: initialData?.address || ''
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  // Handlers
  const handleInputChange = useCallback((field: keyof CreateCandidateDto, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo al cambiar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    const validationErrors = validateCandidateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="candidate-form">
      {/* Campos del formulario */}
    </form>
  );
};
```

### Custom Hooks
```typescript
// Hook para manejo de candidatos
export const useCandidates = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCandidates = useCallback(async (filters?: CandidateFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await candidateService.getAll(filters);
      setCandidates(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  const createCandidate = useCallback(async (data: CreateCandidateDto) => {
    try {
      const response = await candidateService.create(data);
      setCandidates(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creando candidato');
      throw err;
    }
  }, []);

  return {
    candidates,
    loading,
    error,
    fetchCandidates,
    createCandidate
  };
};
```

## Validaciones y Sanitización

### Backend (Joi/Zod)
```typescript
import { z } from 'zod';

export const CreateCandidateSchema = z.object({
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[\d\s-()]+$/).optional(),
  address: z.string().max(500).optional()
});

// Middleware de validación
export const validateCandidate = (req: Request, res: Response, next: NextFunction) => {
  try {
    CreateCandidateSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Datos de entrada inválidos',
          details: error.errors
        }
      });
    }
    next(error);
  }
};
```

### Frontend (Validación en tiempo real)
```typescript
export const validateCandidateForm = (data: CreateCandidateDto): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.firstName.trim()) {
    errors.firstName = 'Nombre es requerido';
  } else if (data.firstName.length < 2) {
    errors.firstName = 'Nombre debe tener al menos 2 caracteres';
  }

  if (!data.email.trim()) {
    errors.email = 'Email es requerido';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Email no es válido';
  }

  return errors;
};
```

## Testing

### Backend Tests
```typescript
describe('CandidateService', () => {
  let candidateService: CandidateService;
  let mockRepository: jest.Mocked<ICandidateRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      // ... otros métodos
    };
    candidateService = new CandidateService(mockRepository, mockLogger);
  });

  describe('createCandidate', () => {
    it('debería crear candidato exitosamente', async () => {
      // Arrange
      const candidateData = { firstName: 'Juan', lastName: 'Pérez', email: 'juan@test.com' };
      const expectedCandidate = { id: 1, ...candidateData };
      
      mockRepository.findByEmail.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue(expectedCandidate);

      // Act
      const result = await candidateService.createCandidate(candidateData, 1);

      // Assert
      expect(result).toEqual(expectedCandidate);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...candidateData,
        createdBy: 1
      });
    });

    it('debería lanzar error si email ya existe', async () => {
      // Arrange
      const candidateData = { firstName: 'Juan', lastName: 'Pérez', email: 'juan@test.com' };
      mockRepository.findByEmail.mockResolvedValue({ id: 1 } as Candidate);

      // Act & Assert
      await expect(candidateService.createCandidate(candidateData, 1))
        .rejects.toThrow('Candidato ya existe con este email');
    });
  });
});
```

### Frontend Tests
```typescript
describe('CandidateForm', () => {
  it('debería renderizar correctamente', () => {
    render(<CandidateForm onSubmit={jest.fn()} />);
    
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/apellido/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('debería mostrar errores de validación', async () => {
    const mockSubmit = jest.fn();
    render(<CandidateForm onSubmit={mockSubmit} />);
    
    fireEvent.click(screen.getByRole('button', { name: /guardar/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/nombre es requerido/i)).toBeInTheDocument();
    });
    
    expect(mockSubmit).not.toHaveBeenCalled();
  });
});
```

## Patrones para MinIO y Email

### Servicio MinIO
```typescript
interface IMinioService {
  uploadFile(bucketName: string, objectName: string, stream: Buffer, size: number, metaData?: object): Promise<string>;
  downloadFile(bucketName: string, objectName: string): Promise<Buffer>;
  deleteFile(bucketName: string, objectName: string): Promise<void>;
  getPresignedUrl(bucketName: string, objectName: string, expires?: number): Promise<string>;
  listFiles(bucketName: string, prefix?: string): Promise<string[]>;
}

class MinioService implements IMinioService {
  constructor(private minioClient: Client) {}

  async uploadFile(bucketName: string, objectName: string, stream: Buffer, size: number, metaData?: object): Promise<string> {
    try {
      const result = await this.minioClient.putObject(bucketName, objectName, stream, size, metaData);
      logger.info('Archivo subido a MinIO', { bucketName, objectName, size });
      return result.etag;
    } catch (error) {
      logger.error('Error subiendo archivo a MinIO', { error, bucketName, objectName });
      throw new Error('Error uploading file to storage');
    }
  }

  async getPresignedUrl(bucketName: string, objectName: string, expires = 3600): Promise<string> {
    return await this.minioClient.presignedUrl('GET', bucketName, objectName, expires);
  }
}
```

### Servicio Email con Mailpit
```typescript
interface IEmailService {
  sendWelcomeEmail(to: string, candidateName: string): Promise<void>;
  sendDocumentUploadConfirmation(to: string, documentName: string): Promise<void>;
  sendErrorNotification(to: string, error: string): Promise<void>;
}

class EmailService implements IEmailService {
  constructor(private transporter: nodemailer.Transporter) {}

  async sendWelcomeEmail(to: string, candidateName: string): Promise<void> {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to,
      subject: 'Bienvenido al Sistema ATS',
      html: `
        <h1>¡Bienvenido ${candidateName}!</h1>
        <p>Tu perfil ha sido creado exitosamente en nuestro sistema.</p>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      logger.info('Email de bienvenida enviado', { to, candidateName });
    } catch (error) {
      logger.error('Error enviando email', { error, to });
      throw new Error('Failed to send email');
    }
  }
}
```

### Patrón de Gestión de Archivos
```typescript
class DocumentUploadService {
  constructor(
    private minioService: IMinioService,
    private documentRepo: IDocumentRepository,
    private emailService: IEmailService
  ) {}

  async uploadCandidateDocument(
    candidateId: number,
    file: Express.Multer.File,
    documentType: DocumentType
  ): Promise<Document> {
    const timestamp = Date.now();
    const objectName = `candidates/${candidateId}/${documentType}/${timestamp}_${file.originalname}`;
    
    try {
      // 1. Subir archivo a MinIO
      const etag = await this.minioService.uploadFile(
        process.env.MINIO_BUCKET_NAME!,
        objectName,
        file.buffer,
        file.size,
        { 
          'Content-Type': file.mimetype,
          'Upload-Date': new Date().toISOString()
        }
      );

      // 2. Guardar metadata en base de datos
      const document = await this.documentRepo.create({
        candidateId,
        fileName: objectName,
        originalName: file.originalname,
        mimeType: file.mimetype,
        fileSize: file.size,
        filePath: objectName,
        documentType,
        etag
      });

      // 3. Enviar confirmación por email (opcional)
      const candidate = await this.candidateRepo.findById(candidateId);
      if (candidate?.email) {
        await this.emailService.sendDocumentUploadConfirmation(
          candidate.email,
          file.originalname
        );
      }

      return document;
    } catch (error) {
      logger.error('Error en upload de documento', { error, candidateId, fileName: file.originalname });
      throw error;
    }
  }
}
```

## Logging y Monitoreo

```typescript
// Logger estructurado
export const logger = {
  info: (message: string, meta?: object) => {
    console.log(JSON.stringify({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      ...meta
    }));
  },
  
  error: (message: string, meta?: object) => {
    console.error(JSON.stringify({
      level: 'error',
      message,
      timestamp: new Date().toISOString(),
      ...meta
    }));
  }
};

// Uso en servicios
logger.info('Candidato creado exitosamente', { 
  candidateId: candidate.id,
  recruiterId,
  duration: Date.now() - startTime 
});
```

## Configuración de Herramientas

### ESLint (.eslintrc.js)
```javascript
module.exports = {
  extends: [
    '@typescript-eslint/recommended',
    'prettier'
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    'prefer-const': 'error',
    'no-var': 'error'
  }
};
```

### Prettier (.prettierrc)
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
``` 