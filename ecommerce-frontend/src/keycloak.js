import Keycloak from 'keycloak-js';

const keycloakConfig = {
    url: 'http://localhost:8080',
    realm: 'Ecommerce_Car',
    clientId: 'ecommerce-app',
    'ssl-required': 'external',
    'public-client': true,
    'confidential-port': 0

};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
