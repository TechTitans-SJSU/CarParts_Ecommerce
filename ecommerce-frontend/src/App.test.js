// import { render, screen } from '@testing-library/react';
// import App from './App';

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });


import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak from './config/keycloak';
import { CartProvider } from './context/CartContext';
import App from './App';

test('renders App component without crashing', () => {
  render(
    <ReactKeycloakProvider authClient={keycloak}>
      <CartProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CartProvider>
    </ReactKeycloakProvider>
  );

  // Verify if Navbar is present
  expect(screen.getByRole('navigation')).toBeInTheDocument();
});
