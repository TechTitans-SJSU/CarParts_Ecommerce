// jest.config.js
module.exports = {
    testEnvironment: 'node',
    verbose: true,
    testTimeout: 30000,
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testMatch: [
      '**/__tests__/**/*.test.js',
      '**/*.test.js'
    ]
  };