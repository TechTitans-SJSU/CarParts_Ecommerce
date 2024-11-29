// jest.config.js
module.exports = {
    testEnvironment: 'node',
    coveragePathIgnorePatterns: [
      '/node_modules/'
    ],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testMatch: ['**/__tests__/**/*.test.js'],
    collectCoverageFrom: [
      'src/**/*.js',
      '!src/swagger/**',
      '!src/config/**'
    ]
  };
  
  // jest.setup.js
  jest.setTimeout(10000); // 10 second timeout
  
  global.console = {
    ...console,
    // uncomment to ignore a specific log level
    // log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
  };