const Keycloak = require('keycloak-connect');
const session = require('express-session');

const memoryStore = new session.MemoryStore();

const keycloak = new Keycloak({ store: memoryStore }, {
    clientId: 'ecommerce-app',
    bearerOnly: true,
    serverUrl: 'http://localhost:8080/',
    realm: 'Ecommerce_Car',
    credentials: {
        secret: 'GKalicr2Cj1fvW1iWR66DMkraosXT5PD'
    }
});
console.log('Keycloak client initialized:', keycloak);
module.exports = { keycloak, memoryStore };
