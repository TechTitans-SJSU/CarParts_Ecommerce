// __tests__/app.test.js
const request = require('supertest');
const express = require('express');
const session = require('express-session');
const db = require('../models');
const app = require('../app');

// Mock keycloak-connect
jest.mock('keycloak-connect');
jest.mock('../config/keycloak', () => ({
  keycloak: {
    middleware: jest.fn(() => (req, res, next) => next()),
    protect: jest.fn(() => (req, res, next) => next())
  }
}));

// Mock database
jest.mock('../models', () => ({
  sequelize: {
    authenticate: jest.fn().mockResolvedValue(),
    sync: jest.fn().mockResolvedValue()
  }
}));

describe('Express App', () => {
  beforeAll(async () => {
    // Any setup before all tests
  });

  afterAll(async () => {
    // Cleanup after all tests
  });

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  describe('Middleware Setup', () => {
    test('should handle CORS', async () => {
      const response = await request(app)
        .get('/api/protected')
        .set('Origin', 'http://localhost:8080');
      
      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:8080');
    });

    test('should reject unauthorized CORS origins', async () => {
      const response = await request(app)
        .get('/api/protected')
        .set('Origin', 'http://unauthorized-origin.com');
      
      expect(response.headers['access-control-allow-origin']).toBeUndefined();
    });
  });

  describe('Protected Routes', () => {
    test('should access protected route with valid token', async () => {
      const response = await request(app)
        .get('/api/protected')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'This is a protected route' });
    });
  });

  describe('API Routes', () => {
    test('should handle /products route', async () => {
      const response = await request(app)
        .get('/products');
      
      expect(response.status).toBe(200);
    });

    test('should handle /parts route', async () => {
      const response = await request(app)
        .get('/parts');
      
      expect(response.status).toBe(200);
    });

    test('should handle /orders route', async () => {
      const response = await request(app)
        .get('/orders');
      
      expect(response.status).toBe(200);
    });

    test('should handle /category route', async () => {
      const response = await request(app)
        .get('/category');
      
      expect(response.status).toBe(200);
    });
  });

  describe('Database Connection', () => {
    test('should connect to database successfully', async () => {
      expect(db.sequelize.authenticate).toHaveBeenCalled();
      expect(db.sequelize.sync).toHaveBeenCalledWith({ alter: true });
    });
  });

  describe('Error Handling', () => {
    test('should handle 404 routes', async () => {
      const response = await request(app)
        .get('/non-existent-route');
      
      expect(response.status).toBe(404);
    });

    test('should handle invalid JSON', async () => {
      const response = await request(app)
        .post('/products')
        .send('invalid json');
      
      expect(response.status).toBe(400);
    });
  });
});