const express = require('express');
const router = express.Router();
const Keycloak = require('keycloak-connect');
const { keycloak } = require('../config/keycloak'); // Assuming keycloak config file

// Protected login route
router.post('/login', keycloak.protect(), (req, res) => {
    // Token validated by Keycloak; proceed with user login
    const user = req.kauth.grant.access_token.content;

    res.status(200).json({
        message: 'User authenticated successfully',
        user: {
            username: user.preferred_username,
            email: user.email,
            roles: user.realm_access.roles,
        }
    });
});

module.exports = router;
