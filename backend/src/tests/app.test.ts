import request from 'supertest';
import { app } from '../index';

describe('API Health Check', () => {
  it('GET / should return API information', async () => {
    const response = await request(app).get('/');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'ATS Backend API');
    expect(response.body).toHaveProperty('version', 'v1');
    expect(response.body).toHaveProperty('status', 'running');
    expect(response.body).toHaveProperty('timestamp');
  });

  it('GET /api/health should return health status', async () => {
    const response = await request(app).get('/api/health');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'OK');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('uptime');
  });
});
