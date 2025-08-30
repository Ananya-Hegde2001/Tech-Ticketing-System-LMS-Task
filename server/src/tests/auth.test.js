import request from 'supertest';
import app from '../index.js';

describe('Auth', () => {
  it('registers and logs in a user', async () => {
    const email = `testuser_${Date.now()}@example.com`;
    const password = 'password123';

    const reg = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email, password });
    expect(reg.status).toBe(201);
    expect(reg.body.user).toBeDefined();

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email, password });
    expect(res.status).toBe(200);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe(email);
  });
});
