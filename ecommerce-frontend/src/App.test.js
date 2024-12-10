import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock all the required modules
jest.mock('keycloak-js');
jest.mock('axios');
jest.mock('./components/ChatBot', () => {
  return function MockChatbot() {
    return null;
  }
});

// Mock all route components
jest.mock('./pages/Home', () => () => 'Home Page');
jest.mock('./pages/Cart', () => () => 'Cart Page');
jest.mock('./pages/Checkout', () => () => 'Checkout Page');
jest.mock('./pages/Category', () => () => 'Category Page');
jest.mock('./pages/CategoryProducts', () => () => 'Category Products Page');
jest.mock('./pages/Parts', () => () => 'Parts Page');
jest.mock('./pages/OrderConfirmation', () => () => 'Order Confirmation Page');
jest.mock('./pages/Dashboard', () => () => 'Dashboard Page');

// Mock PrivateRoute
jest.mock('./components/PrivateRoute', () => ({
  __esModule: true,
  default: ({ children }) => children
}));

// Mock Keycloak
jest.mock('@react-keycloak/web', () => ({
  ReactKeycloakProvider: ({ children }) => children,
  useKeycloak: () => ([
    {
      initialized: true,
      authenticated: true,
    },
    {
      login: jest.fn(),
      logout: jest.fn(),
    }
  ])
}));

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders App component without crashing', () => {
    render(<App />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});