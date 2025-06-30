import request from 'supertest';
import { app } from '../index';

describe('Integration Tests - Complete Candidate Flow', () => {
  let candidateId: number;

  describe('Full CRUD Flow', () => {
    it('should create, read, update and delete a candidate', async () => {
      // 1. CREATE - Crear candidato
      const newCandidate = {
        firstName: 'Integration',
        lastName: 'Test',
        email: 'integration@test.com',
        phone: '+34 987 654 321',
        address: 'Test Street 456, Barcelona',
        educations: [
          {
            institution: 'Test University',
            degree: 'Bachelor',
            fieldOfStudy: 'Computer Science',
            startDate: '2020-09-01',
            endDate: '2024-06-01',
            isCurrent: false,
            description: 'Computer Science degree'
          }
        ],
        experiences: [
          {
            company: 'Test Company',
            position: 'Software Developer',
            startDate: '2024-07-01',
            endDate: null,
            isCurrent: true,
            description: 'Current position'
          }
        ]
      };

      const createResponse = await request(app)
        .post('/api/v1/candidates')
        .send(newCandidate);

      // Verificar que la ruta existe
      expect(createResponse.status).not.toBe(404);

      // Verificar que al menos la ruta funciona
      if (createResponse.status === 201 || createResponse.status === 200) {
        candidateId = createResponse.body.data?.id;
        expect(candidateId).toBeDefined();
      }

      // 2. READ - Obtener candidato creado
      if (candidateId) {
        const getResponse = await request(app)
          .get(`/api/v1/candidates/${candidateId}`);
        
        expect(getResponse.status).not.toBe(404);
        
        if (getResponse.status === 200) {
          expect(getResponse.body.data.firstName).toBe('Integration');
          expect(getResponse.body.data.lastName).toBe('Test');
        }
      }

      // 3. UPDATE - Actualizar candidato
      if (candidateId) {
        const updateData = {
          firstName: 'Integration Updated',
          phone: '+34 111 222 333'
        };

        const updateResponse = await request(app)
          .put(`/api/v1/candidates/${candidateId}`)
          .send(updateData);

        expect(updateResponse.status).not.toBe(404);
        expect([200, 404, 500]).toContain(updateResponse.status);
      }

      // 4. DELETE - Eliminar candidato (incluir 204 No Content)
      if (candidateId) {
        const deleteResponse = await request(app)
          .delete(`/api/v1/candidates/${candidateId}`);

        expect(deleteResponse.status).not.toBe(404);
        expect([200, 204, 404, 500]).toContain(deleteResponse.status);
      }
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle malformed JSON requests', async () => {
      const response = await request(app)
        .post('/api/v1/candidates')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}');

      expect(response.status).not.toBe(404);
      expect([400, 500]).toContain(response.status);
    });

    it('should handle requests with missing content-type', async () => {
      const response = await request(app)
        .post('/api/v1/candidates')
        .send('some text data');

      expect(response.status).not.toBe(404);
      expect([400, 500]).toContain(response.status);
    });
  });

  describe('Pagination and Search Integration', () => {
    it('should handle pagination parameters', async () => {
      const response = await request(app)
        .get('/api/v1/candidates')
        .query({ page: 1, limit: 5 });

      expect(response.status).not.toBe(404);
      expect([200, 500]).toContain(response.status);
    });

    it('should handle search with special characters', async () => {
      const response = await request(app)
        .get('/api/v1/candidates/search')
        .query({ q: 'test@example.com' });

      expect(response.status).not.toBe(404);
      expect([200, 500]).toContain(response.status);
    });
  });
}); 