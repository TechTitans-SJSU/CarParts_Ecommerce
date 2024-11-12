// const express = require('express');
// const router = express.Router();
// const db = require('../models');

// // Create a new shipping entry
// router.post('/', async (req, res) => {
//   try {
//     const shipping = await db.Shipping.create(req.body);
//     res.json(shipping);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

// // Get all shipping entries
// router.get('/', async (req, res) => {
//   try {
//     const shipping = await db.Shipping.findAll();
//     res.json(shipping);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

// // Get shipping entry by ID
// router.get('/:id', async (req, res) => {
//   try {
//     const shipping = await db.Shipping.findByPk(req.params.id);
//     if (shipping) {
//       res.json(shipping);
//     } else {
//       res.status(404).send('Shipping entry not found');
//     }
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

// // Update a shipping entry
// router.put('/:id', async (req, res) => {
//   try {
//     const shipping = await db.Shipping.update(req.body, {
//       where: { id: req.params.id },
//     });
//     res.json(shipping);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

// // Delete a shipping entry
// router.delete('/:id', async (req, res) => {
//   try {
//     await db.Shipping.destroy({
//       where: { id: req.params.id },
//     });
//     res.json({ message: 'Shipping entry deleted successfully' });
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
 * /shipping:
 *   post:
 *     summary: Create a new shipping entry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Shipping'
 *     responses:
 *       200:
 *         description: Successfully created shipping entry
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Shipping'
 *       500:
 *         description: Internal server error
 */
router.post('/', async (req, res) => {
  try {
    const shipping = await db.Shipping.create(req.body);
    res.json(shipping);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /shipping:
 *   get:
 *     summary: Get all shipping entries
 *     responses:
 *       200:
 *         description: List of shipping entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Shipping'
 *       500:
 *         description: Internal server error
 */
router.get('/', async (req, res) => {
  try {
    const shipping = await db.Shipping.findAll();
    res.json(shipping);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /shipping/{id}:
 *   get:
 *     summary: Get shipping entry by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the shipping entry to retrieve
 *     responses:
 *       200:
 *         description: Shipping entry details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Shipping'
 *       404:
 *         description: Shipping entry not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', async (req, res) => {
  try {
    const shipping = await db.Shipping.findByPk(req.params.id);
    if (shipping) {
      res.json(shipping);
    } else {
      res.status(404).send('Shipping entry not found');
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /shipping/{id}:
 *   put:
 *     summary: Update a shipping entry
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the shipping entry to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Shipping'
 *     responses:
 *       200:
 *         description: Successfully updated shipping entry
 *       404:
 *         description: Shipping entry not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', async (req, res) => {
  try {
    const shipping = await db.Shipping.update(req.body, {
      where: { id: req.params.id },
    });
    res.json(shipping);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /shipping/{id}:
 *   delete:
 *     summary: Delete a shipping entry
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the shipping entry to delete
 *     responses:
 *       200:
 *         description: Shipping entry deleted successfully
 *       404:
 *         description: Shipping entry not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', async (req, res) => {
  try {
    await db.Shipping.destroy({
      where: { id: req.params.id },
    });
    res.json({ message: 'Shipping entry deleted successfully' });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
