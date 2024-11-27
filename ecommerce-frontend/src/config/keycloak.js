// import Keycloak from 'keycloak-js';

// const keycloakConfig = {
//   url: 'http://localhost:8080',
//   realm: 'React',
//   clientId: 'react-client',
//   onLoad: 'login-required',
// };

//  const keycloak = new Keycloak(keycloakConfig);

// export const initKeycloak = () => {
//     return keycloak.init({
//       onLoad: 'login-required',
//       silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
//       pkceMethod: 'S256'
//     });
//   };

// export default keycloak;


import Keycloak from 'keycloak-js';


const keycloakConfig = {
  url: process.env.REACT_APP_KEYCLOAK_URL,
  realm: process.env.REACT_APP_KEYCLOAK_REALM,
  clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID,
  'public-client': true,
  'ssl-required': 'external',
};

const keycloak = new Keycloak(keycloakConfig);

export const initKeycloak = async () => {
  try {
    const authenticated = await keycloak.init({
      onLoad: 'login-required',
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
      pkceMethod: 'S256', // Ensures secure token exchange
    });

    if (authenticated) {
      // Automatically refresh the token before it expires
      setInterval(() => {
        keycloak
          .updateToken(30) // Refresh if the token will expire in the next 30 seconds
          .then((refreshed) => {
            if (refreshed) {
              console.log('Token refreshed');
            }
          })
          .catch((err) => {
            console.error('Failed to refresh token:', err);
          });
      }, 10000); // Check every 10 seconds
    } else {
      console.warn('Not authenticated');
    }
  } catch (error) {
    console.error('Keycloak initialization failed:', error);
  }
};

export const getAuthHeaders = () => ({
  'Authorization': `Bearer ${keycloak.token}`,
  'Content-Type': 'application/json'
});

// API call example
export const makeAuthenticatedRequest = async (url, options = {}) => {
  try {
      // Ensure token is still valid, refresh if needed
      await keycloak.updateToken(30);
      
      const response = await fetch(url, {
          ...options,
          headers: {
              ...getAuthHeaders(),
              ...(options.headers || {})
          }
      });
      console.log('Response:', response);
      return response;
  } catch (error) {
      console.error('Auth error:', error);
      keycloak.login(); // Redirect to login if token refresh fails
  }
};


export const KeycloakService = {
  logout: async () => {
    try {
      await keycloak.logout({
        redirectUri: window.location.origin
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }
};


export default keycloak;
