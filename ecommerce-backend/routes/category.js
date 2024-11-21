// const express = require('express');
// const router = express.Router();
// const db = require('../models');

// // Create a new category
// router.post('/', async (req, res) => {
//   try {
//     const category = await db.Category.create(req.body);
//     res.json(category);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

// // Get all categories
// router.get('/', async (req, res) => {
//   try {
//     const category = await db.Category.findAll();
//     res.json(category);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

// // Update a category
// router.put('/:id', async (req, res) => {
//   try {
//     const category = await db.Category.update(req.body, {
//       where: { id: req.params.id },
//     });
//     res.json(category);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

// // Delete a category
// router.delete('/:id', async (req, res) => {
//   try {
//     await db.Category.destroy({
//       where: { id: req.params.id },
//     });
//     res.json({ message: 'Category deleted successfully' });
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const db = require('../models');

/**
 * @swagger
 * /category:
 *   post:
 *     summary: Create a new category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Successfully created category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       500:
 *         description: Internal server error
 */
router.post('/', async (req, res) => {
  try {
    const category = await db.Category.create(req.body);
    res.json(category);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /category:
 *   get:
 *     summary: Get all categories
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: Internal server error
 */
router.get('/', async (req, res) => {
  try {
    const category = await db.Category.findAll();
    res.json(category);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /category/{id}:
 *   put:
 *     summary: Update a category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the category to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Successfully updated category
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', async (req, res) => {
  try {
    const category = await db.Category.update(req.body, {
      where: { id: req.params.id },
    });
    res.json(category);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /category/{id}:
 *   delete:
 *     summary: Delete a category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the category to delete
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', async (req, res) => {
  try {
    await db.Category.destroy({
      where: { id: req.params.id },
    });
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
