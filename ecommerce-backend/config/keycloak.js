const Keycloak = require('keycloak-connect');
const session = require('express-session');

const memoryStore = new session.MemoryStore();

const keycloak = new Keycloak({ store: memoryStore }, {
    clientId: 'ecommerce-backend',
    bearerOnly: true,
    serverUrl: 'http://localhost:8080/auth',
    realm: 'ecommerce_admin',
    credentials: {
        secret: 'zNdOs8AQljS2SqdSJSiNv70iCrqXSiAh'
    }
});

module.exports = { keycloak, memoryStore };
