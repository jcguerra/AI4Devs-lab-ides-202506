import request from 'supertest';
import { app } from '../index';

describe('Error Handling System', () => {
  describe('Route Not Found', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/v1/non-existent-route');

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        success: false,
        error: {
          type: 'NotFoundError',
          code: 'RESOURCE_NOT_FOUND',
          message: expect.stringContaining('Ruta no encontrada'),
          path: '/api/v1/non-existent-route',
          method: 'GET'
        },
        meta: {
          version: 'v1',
          environment: expect.any(String)
        }
      });
    });

    it('should return 404 for invalid HTTP methods', async () => {
      const response = await request(app)
        .patch('/api/v1/candidates');

      expect(response.status).toBe(404);
      expect(response.body.error.type).toBe('NotFoundError');
    });
  });

  describe('Validation Errors', () => {
    it('should handle JSON syntax errors', async () => {
      const response = await request(app)
        .post('/api/v1/candidates')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}');

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        success: false,
        error: {
          type: 'JSONSyntaxError',
          code: 'INVALID_JSON',
          message: 'JSON inválido en el cuerpo de la petición'
        }
      });
    });

    it('should handle missing required fields', async () => {
      const response = await request(app)
        .post('/api/v1/candidates')
        .send({
          // Missing required fields
          lastName: 'Test'
        });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        success: false,
        error: {
          type: 'ValidationError',
          code: 'VALIDATION_FAILED',
          message: expect.stringContaining('nombre es obligatorio')
        }
      });
    });

    it('should handle invalid data types', async () => {
      const response = await request(app)
        .get('/api/v1/candidates/invalid-id');

      // Un ID inválido debe devolver 400 (Bad Request), no 404
      expect(response.status).toBe(400);
      expect(response.body.error.type).toBe('ValidationError');
    });
  });

  describe('Database Errors', () => {
    it('should handle duplicate email constraint', async () => {
      // First, create a candidate
      await request(app)
        .post('/api/v1/candidates')
        .send({
          firstName: 'Duplicate',
          lastName: 'Test', 
          email: 'duplicate@test.com',
          phone: '+34 123 456 789',
          address: 'Test Address'
        });

      // Try to create another with same email
      const response = await request(app)
        .post('/api/v1/candidates')
        .send({
          firstName: 'Another',
          lastName: 'Test',
          email: 'duplicate@test.com',
          phone: '+34 987 654 321',
          address: 'Another Address'
        });

      expect(response.status).toBe(409);
      expect(response.body).toMatchObject({
        success: false,
        error: {
          type: 'DuplicateError',
          code: 'RESOURCE_CONFLICT',
          message: 'Ya existe un candidato con este email'
        }
      });
    });

    it('should handle resource not found', async () => {
      const response = await request(app)
        .get('/api/v1/candidates/99999');

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        success: false,
        error: {
          type: 'NotFoundError',
          code: 'RESOURCE_NOT_FOUND',
          message: 'Candidato no encontrado'
        }
      });
    });
  });

  describe('Error Response Structure', () => {
    it('should include request metadata in error responses', async () => {
      const response = await request(app)
        .get('/api/v1/non-existent');

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('meta');
      
      expect(response.body.error).toHaveProperty('type');
      expect(response.body.error).toHaveProperty('message');
      expect(response.body.error).toHaveProperty('code');
      expect(response.body.error).toHaveProperty('timestamp');
      expect(response.body.error).toHaveProperty('path');
      expect(response.body.error).toHaveProperty('method');
      expect(response.body.error).toHaveProperty('requestId');
      
      expect(response.body.meta).toHaveProperty('timestamp');
      expect(response.body.meta).toHaveProperty('version');
      expect(response.body.meta).toHaveProperty('environment');
    });

    it('should generate unique request IDs', async () => {
      const response1 = await request(app).get('/api/v1/non-existent-1');
      const response2 = await request(app).get('/api/v1/non-existent-2');

      expect(response1.body.error.requestId).toBeDefined();
      expect(response2.body.error.requestId).toBeDefined();
      expect(response1.body.error.requestId).not.toBe(response2.body.error.requestId);
    });
  });

  describe('Health Check Routes', () => {
    it('should return main API info on root route', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        message: 'ATS Backend API',
        version: 'v1',
        status: 'running',
        endpoints: {
          health: '/api/health',
          candidates: '/api/v1/candidates',
          docs: '/api/docs'
        }
      });
    });

    it('should return detailed health check', async () => {
      const response = await request(app).get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        status: 'OK',
        uptime: expect.any(Number),
        environment: expect.any(String),
        version: 'v1'
      });
    });
  });

  describe('Error Logging', () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    it('should log error details', async () => {
      await request(app).get('/api/v1/non-existent');

      expect(consoleSpy).toHaveBeenCalled();
      expect(consoleSpy.mock.calls[0][0]).toContain('Error:');
    });
  });
}); 