const express = require('express');
const router = express.Router();
const Keycloak = require('keycloak-connect');
const { keycloak } = require('../config/keycloak');

router.get('/userinfo', keycloak.protect(), (req, res) => {
    try {
        if (!req.kauth.grant) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const user = req.kauth.grant.access_token.content;

        res.status(200).json({
            user: {
                username: user.preferred_username,
                email: user.email,
                roles: user.realm_access.roles,
            }
        });
    } catch (error) {
        console.error('Error fetching user info:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Example of a protected route
router.get('/protected', keycloak.protect(), (req, res) => {
    res.json({ message: "This is a protected resource" });
});

module.exports = router;
