import { isValidEmail, isValidPhone, candidateValidationSchema } from '../utils/validators';

describe('Validation Utils', () => {
  describe('isValidEmail', () => {
    it('should validate correct email formats', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co')).toBe(true);
      expect(isValidEmail('test+123@example.org')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('test..test@domain.com')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('should validate correct phone formats', () => {
      expect(isValidPhone('+34 123 456 789')).toBe(true);
      expect(isValidPhone('(555) 123-4567')).toBe(true);
      expect(isValidPhone('+1234567890')).toBe(true);
      expect(isValidPhone('123-456-7890')).toBe(true);
    });

    it('should reject invalid phone formats', () => {
      expect(isValidPhone('123')).toBe(false); // Muy corto
      expect(isValidPhone('12345678901234567890')).toBe(false); // Muy largo
      expect(isValidPhone('abc123')).toBe(false); // Letras
      expect(isValidPhone('')).toBe(false); // Vacío
    });
  });

  describe('candidateValidationSchema', () => {
    it('should validate correct candidate data', () => {
      const validCandidate = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '+34 123 456 789',
        address: 'Calle Test 123, Madrid',
        educations: [
          {
            institution: 'Universidad Test',
            degree: 'Ingeniería',
            fieldOfStudy: 'Informática',
            startDate: '2020-01-01T00:00:00.000Z',
            endDate: '2024-01-01T00:00:00.000Z',
            isCurrent: false,
            description: 'Carrera universitaria'
          }
        ],
        experiences: [
          {
            company: 'TestCorp',
            position: 'Desarrollador',
            startDate: '2024-01-01T00:00:00.000Z',
            endDate: null,
            isCurrent: true,
            description: 'Trabajo actual'
          }
        ]
      };

      const { error } = candidateValidationSchema.validate(validCandidate);
      expect(error).toBeUndefined();
    });

    it('should reject candidate with missing required fields', () => {
      const invalidCandidate = {
        firstName: '',
        lastName: '',
        email: 'invalid-email',
        phone: '123',
        address: ''
      };

      const { error } = candidateValidationSchema.validate(invalidCandidate);
      expect(error).toBeDefined();
      expect(error?.details.length).toBeGreaterThan(0);
    });

    it('should handle isCurrent education with empty endDate', () => {
      const candidateWithCurrentEducation = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '+34 123 456 789',
        address: 'Calle Test 123, Madrid',
        educations: [
          {
            institution: 'Universidad Test',
            degree: 'Máster',
            fieldOfStudy: 'IA',
            startDate: '2024-01-01T00:00:00.000Z',
            endDate: '',
            isCurrent: true,
            description: 'Estudiando actualmente'
          }
        ]
      };

      const { error } = candidateValidationSchema.validate(candidateWithCurrentEducation);
      expect(error).toBeUndefined();
    });
  });
}); 