const request = require('supertest');
const express = require('express');

// Mock Sequelize before requiring app
jest.mock('sequelize', () => {
  const createDataType = (type) => {
    const fn = (precision, scale) => ({
      type,
      precision,
      scale,
      toString: () => type
    });
    fn.toString = () => type;
    return fn;
  };

  // Create a base model class with association methods
  class MockModel {
    static init() { return this; }
    static hasMany() { return this; }
    static belongsTo() { return this; }
    static belongsToMany() { return this; }
    static findOne() { return Promise.resolve(null); }
    static findAll() { return Promise.resolve([]); }
    static create() { return Promise.resolve({}); }
    static update() { return Promise.resolve([1]); }
    static destroy() { return Promise.resolve(1); }
  }

  const mSequelize = {
    authenticate: jest.fn().mockResolvedValue(true),
    define: jest.fn((modelName) => {
      // Create a new class that extends MockModel for each model definition
      const ModelClass = class extends MockModel {};
      ModelClass.name = modelName;
      return ModelClass;
    }),
    sync: jest.fn().mockResolvedValue(null),
    Model: MockModel,
  };
  
  const Sequelize = jest.fn(() => mSequelize);
  Sequelize.Model = MockModel;
  
  // Create proper DataTypes that support function calls
  Sequelize.DataTypes = {
    STRING: createDataType('STRING'),
    INTEGER: createDataType('INTEGER'),
    BOOLEAN: createDataType('BOOLEAN'),
    DATE: createDataType('DATE'),
    TEXT: createDataType('TEXT'),
    FLOAT: createDataType('FLOAT'),
    DOUBLE: createDataType('DOUBLE'),
    DECIMAL: createDataType('DECIMAL'),
    UUID: createDataType('UUID'),
    ENUM: (...values) => ({ type: 'ENUM', values }),
    VIRTUAL: createDataType('VIRTUAL'),
    JSON: createDataType('JSON'),
    JSONB: createDataType('JSONB'),
  };

  // Add common operators
  Sequelize.Op = {
    eq: Symbol('eq'),
    ne: Symbol('ne'),
    gte: Symbol('gte'),
    gt: Symbol('gt'),
    lte: Symbol('lte'),
    lt: Symbol('lt'),
    in: Symbol('in'),
    notIn: Symbol('notIn'),
    like: Symbol('like'),
    iLike: Symbol('iLike'),
    between: Symbol('between'),
  };

  return Sequelize;
});

// Mock models directly to ensure they're available before app requires them
jest.mock('../models', () => {
  const mockModels = {
    Category: {
      hasMany: jest.fn(),
      findAll: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({}),
      update: jest.fn().mockResolvedValue([1]),
      destroy: jest.fn().mockResolvedValue(1),
    },
    Product: {
      belongsTo: jest.fn(),
      findAll: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue(null),
    },
    User: {
      hasMany: jest.fn(),
      findOne: jest.fn().mockResolvedValue(null),
    },
    Order: {
      belongsTo: jest.fn(),
      findAll: jest.fn().mockResolvedValue([]),
    },
    // Add other models as needed
  };

  return mockModels;
});

// Now require the app after mocking
const app = require('../app');

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

let server;
beforeAll(async () => {
  server = app.listen();
});

afterAll((done) => {
  server.close(done);
});

describe('Protected Routes', () => {
  it('should deny access to /api/protected without authorization', async () => {
    const res = await request(app)
      .get('/api/protected')
      .send();
    
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