// const express = require('express');
// const router = express.Router();
// const { verifyToken } = require('../middleware/auth');

// // Protected route example
// router.get('/protected-resource', verifyToken, (req, res) => {
//     // Access user info from token
//     const userId = req.user.sub;
//     const username = req.user.preferred_username;
    
//     res.json({ 
//         message: 'Protected data accessed successfully',
//         user: { userId, username }
//     });
// });

// module.exports = router;