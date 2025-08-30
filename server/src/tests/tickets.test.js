import request from 'supertest';
import app from '../index.js';

// Requires mock headers
const asEmployee1 = request(app).set('x-user-id', '2').set('x-user-role', 'EMPLOYEE');
const asAdmin = request(app).set('x-user-id', '1').set('x-user-role', 'ADMIN');

describe('Tickets', () => {
  it('employee sees only own tickets', async () => {
    const res = await asEmployee1.get('/api/tickets');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.tickets)).toBe(true);
    // Ensure all tickets belong to employee 2
    for (const t of res.body.tickets) {
      expect(t.created_by).toBe(2);
    }
  });

  it('admin can update a ticket priority', async () => {
    // Pick one ticket
    const list = await asAdmin.get('/api/tickets');
    const first = list.body.tickets[0];
    const res = await asAdmin
      .put(`/api/tickets/${first.id}`)
      .send({ priority: 'CRITICAL' });
    expect(res.status).toBe(200);
    expect(res.body.ticket.priority).toBe('CRITICAL');
  });
});
