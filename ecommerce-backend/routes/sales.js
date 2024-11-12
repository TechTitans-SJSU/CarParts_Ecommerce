// const express = require('express');
// const router = express.Router();
// const db = require('../models');

// // Create a new sale
// router.post('/', async (req, res) => {
//   try {
//     const sale = await db.Sale.create(req.body);
//     res.json(sale);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

// // Get all sales
// router.get('/', async (req, res) => {
//   try {
//     const sales = await db.Sale.findAll();
//     res.json(sales);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

// // Get sale by ID
// router.get('/:id', async (req, res) => {
//   try {
//     const sale = await db.Sale.findByPk(req.params.id);
//     if (sale) {
//       res.json(sale);
//     } else {
//       res.status(404).send('Sale not found');
//     }
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

// // Update a sale
// router.put('/:id', async (req, res) => {
//   try {
//     const sale = await db.Sale.update(req.body, {
//       where: { id: req.params.id },
//     });
//     res.json(sale);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

// // Delete a sale
// router.delete('/:id', async (req, res) => {
//   try {
//     await db.Sale.destroy({
//       where: { id: req.params.id },
//     });
//     res.json({ message: 'Sale deleted successfully' });
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
 * /sales:
 *   post:
 *     summary: Create a new sale
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sale'
 *     responses:
 *       200:
 *         description: Successfully created sale
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sale'
 *       500:
 *         description: Internal server error
 */
router.post('/', async (req, res) => {
  try {
    const sale = await db.Sale.create(req.body);
    res.json(sale);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /sales:
 *   get:
 *     summary: Get all sales
 *     responses:
 *       200:
 *         description: List of sales
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sale'
 *       500:
 *         description: Internal server error
 */
router.get('/', async (req, res) => {
  try {
    const sales = await db.Sale.findAll();
    res.json(sales);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /sales/{id}:
 *   get:
 *     summary: Get sale by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the sale to retrieve
 *     responses:
 *       200:
 *         description: Sale details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sale'
 *       404:
 *         description: Sale not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', async (req, res) => {
  try {
    const sale = await db.Sale.findByPk(req.params.id);
    if (sale) {
      res.json(sale);
    } else {
      res.status(404).send('Sale not found');
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /sales/{id}:
 *   put:
 *     summary: Update a sale
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the sale to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sale'
 *     responses:
 *       200:
 *         description: Successfully updated sale
 *       404:
 *         description: Sale not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', async (req, res) => {
  try {
    const sale = await db.Sale.update(req.body, {
      where: { id: req.params.id },
    });
    res.json(sale);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /sales/{id}:
 *   delete:
 *     summary: Delete a sale
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the sale to delete
 *     responses:
 *       200:
 *         description: Sale deleted successfully
 *       404:
 *         description: Sale not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', async (req, res) => {
  try {
    await db.Sale.destroy({
      where: { id: req.params.id },
    });
    res.json({ message: 'Sale deleted successfully' });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
