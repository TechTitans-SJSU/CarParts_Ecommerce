const express = require('express');
const router = express.Router();
const Keycloak = require('keycloak-connect');
const { keycloak } = require('../config/keycloak'); 


router.post('/login', keycloak.protect(), (req, res) => {
    try {
        console.log('Grant:', req.kauth.grant);
        // Check for authenticated user
        if (!req.kauth.grant) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const user = req.kauth.grant.access_token.content;
        console.log('Token Content:', user);

        res.status(200).json({
            message: 'User authenticated successfully',
            user: {
                username: user.preferred_username,
                email: user.email,
                roles: user.realm_access.roles,
            }
        });
    } catch (error) {
        console.error('Error during authentication:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
