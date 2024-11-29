const request = require('supertest');
const app = require('../app'); // Adjust relative path

jest.mock('keycloak-connect', () => {
  return jest.fn().mockImplementation(() => ({
    middleware: () => (req, res, next) => next(),
    protect: () => (req, res, next) => {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader === 'Bearer mockValidToken') {
        return next();
      } else {
        res.status(403).json({ error: 'Forbidden' });
      }
    },
  }));
});

describe('Protected Routes', () => {
  it('should deny access to /api/protected without authorization', async () => {
    const res = await request(app).get('/api/protected').send();
    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBe('Forbidden');
  });

  it('should allow access to /api/protected with a valid token', async () => {
    const res = await request(app)
      .get('/api/protected')
      .set('Authorization', 'Bearer mockValidToken');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('This is a protected route');
  });
});
