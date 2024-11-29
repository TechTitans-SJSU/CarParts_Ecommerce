// src/__mocks__/keycloak-js.js
const mockKeycloakInstance = {
    init: jest.fn().mockResolvedValue(true),
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
    accountManagement: jest.fn(),
    createLoginUrl: jest.fn(),
    createLogoutUrl: jest.fn(),
    createRegisterUrl: jest.fn(),
    createAccountUrl: jest.fn(),
    isTokenExpired: jest.fn(),
    updateToken: jest.fn().mockResolvedValue(true),
    clearToken: jest.fn(),
    authenticated: false,
    token: "dummy-token",
    tokenParsed: {
      preferred_username: "test-user",
      email: "test@example.com",
      given_name: "Test",
      family_name: "User"
    }
  };
  
  function Keycloak() {
    return mockKeycloakInstance;
  }
  
  module.exports = Keycloak;