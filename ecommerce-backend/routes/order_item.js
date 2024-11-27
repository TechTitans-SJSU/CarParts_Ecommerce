const express = require('express');
const router = express.Router();
const db = require('../models');

/**
 * @swagger
 * /order-items:
 *   post:
 *     summary: Create a new order item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderItem'
 *     responses:
 *       200:
 *         description: Successfully created order item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderItem'
 *       500:
 *         description: Internal server error
 */
router.post('/', async (req, res) => {
  try {
    const orderItem = await db.OrderItem.create(req.body);
    res.json(orderItem);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /order-items:
 *   get:
 *     summary: Get all order items
 *     responses:
 *       200:
 *         description: List of order items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderItem'
 *       500:
 *         description: Internal server error
 */
router.get('/', async (req, res) => {
  try {
    const orderItems = await db.OrderItem.findAll();
    res.json(orderItems);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /order-items/{id}:
 *   get:
 *     summary: Get order item by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the order item to retrieve
 *     responses:
 *       200:
 *         description: Order item details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderItem'
 *       404:
 *         description: Order item not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', async (req, res) => {
  try {
    const orderItem = await db.OrderItem.findByPk(req.params.id);
    if (orderItem) {
      res.json(orderItem);
    } else {
      res.status(404).send('Order item not found');
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /order-items/{id}:
 *   put:
 *     summary: Update an order item
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the order item to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderItem'
 *     responses:
 *       200:
 *         description: Successfully updated order item
 *       404:
 *         description: Order item not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', async (req, res) => {
  try {
    const orderItem = await db.OrderItem.update(req.body, {
      where: { id: req.params.id },
    });
    res.json(orderItem);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /order-items/{id}:
 *   delete:
 *     summary: Delete an order item
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the order item to delete
 *     responses:
 *       200:
 *         description: Order item deleted successfully
 *       404:
 *         description: Order item not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', async (req, res) => {
  try {
    await db.OrderItem.destroy({
      where: { id: req.params.id },
    });
    res.json({ message: 'Order item deleted successfully' });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
