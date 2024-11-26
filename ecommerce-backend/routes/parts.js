const express = require('express');
const router = express.Router();
const db = require('../models');


/**
 * @swagger
 * /parts:
 *   get:
 *     summary: Get all parts
 *     responses:
 *       200:
 *         description: List of parts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Parts'
 *       500:
 *         description: Internal server error
 */
router.get('/', async (req, res) => {
  try {
    const parts = await db.Part.findAll({
      include: [db.Product]
    });
    res.json(parts);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /parts/{id}:
 *   get:
 *     summary: Get part by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the part to retrieve
 *     responses:
 *       200:
 *         description: Part details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Part'
 *       404:
 *         description: Part not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', async (req, res) => {
  try {
    const part = await db.Part.findByPk(req.params.id, {
      include: [db.Product]
    });
    if (part) {
      res.json(part);
    } else {
      res.status(404).send('Part not found');
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /parts/product/{id}:
 *   get:
 *     summary: Get part by Product ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the Product to retrieve parts
 *     responses:
 *       200:
 *         description: List of parts in the product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Parts'
 *       404:
 *         description: Part not found
 *       500:
 *         description: Internal server error
 */

router.get('/product/:id', async (req, res) => {
  try {
    const product_id = req.params.id;

    const parts = await db.Part.findAll({
      where: { product_id }, // Pass an options object with a where clause
      include: [
        {
          model: db.Product,
          attributes: ['product_id', 'product_name'] // Include only relevant Category fields
        }
      ]
    });

    if (parts.length > 0) {
      res.json(parts);
    } else {
      res.status(404).send('No parts found for the given product');
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});


module.exports = router;