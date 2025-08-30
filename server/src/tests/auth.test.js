import request from 'supertest';
import app from '../index.js';

// Simple login test
describe('Auth', () => {
  it('logs in seeded admin', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'password123' });
    expect(res.status).toBe(200);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.role).toBe('ADMIN');
  });
});
