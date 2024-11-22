import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: 'http://localhost:8080',
  realm: 'React',
  clientId: 'react-client',
  onLoad: 'login-required',
};

 const keycloak = new Keycloak(keycloakConfig);

export const initKeycloak = () => {
    return keycloak.init({
      onLoad: 'login-required',
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
      pkceMethod: 'S256'
    });
  };

export default keycloak;