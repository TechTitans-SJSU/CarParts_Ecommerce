const Keycloak = require('keycloak-connect');
const session = require('express-session');

const memoryStore = new session.MemoryStore();

const keycloak = new Keycloak({ store: memoryStore }, {
    clientId: process.env.KEYCLOAK_CLIENT_ID,
    bearerOnly: true,
    serverUrl: process.env.KEYCLOAK_URL,
    realm: process.env.KEYCLOAK_REALM,
    credentials: {
        secret: process.env.KEYCLOAK_CLIENT_SECRET
    },
    "confidential-port": 0,
    'auth-server-url': process.env.KEYCLOAK_URL,
    "verify-token-audience": true,
});
console.log('Keycloak client initialized:', keycloak);
module.exports = { keycloak, memoryStore };
