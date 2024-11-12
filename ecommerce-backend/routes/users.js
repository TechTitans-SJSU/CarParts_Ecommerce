const express = require('express');
const router = express.Router();
const db = require('../models');


// // Create a new user
// router.post('/', async (req, res) => {
//   try {
//     const user = await db.User.create(req.body);
//     res.json(user);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

// // Get all users
// router.get('/', async (req, res) => {
//   try {
//     const users = await db.User.findAll();
//     res.json(users);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

// module.exports = router;



/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: The created user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */
router.post('/', async (req, res) => {
  try {
    const user = await db.User.create(req.body);
    res.json(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */
router.get('/', async (req, res) => {
  try {
    const users = await db.User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
