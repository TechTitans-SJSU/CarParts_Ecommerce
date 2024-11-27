const express = require('express');
const router = express.Router();
const db = require('../models');

/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Create a new payment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Payment'
 *     responses:
 *       200:
 *         description: Successfully created payment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       500:
 *         description: Internal server error
 */
router.post('/', async (req, res) => {
  try {
    const payment = await db.Payment.create(req.body);
    res.json(payment);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /payments:
 *   get:
 *     summary: Get all payments
 *     responses:
 *       200:
 *         description: List of payments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Payment'
 *       500:
 *         description: Internal server error
 */
router.get('/', async (req, res) => {
  try {
    const payments = await db.Payment.findAll();
    res.json(payments);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /payments/{id}:
 *   get:
 *     summary: Get payment by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the payment to retrieve
 *     responses:
 *       200:
 *         description: Payment details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', async (req, res) => {
  try {
    const payment = await db.Payment.findByPk(req.params.id);
    if (payment) {
      res.json(payment);
    } else {
      res.status(404).send('Payment not found');
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /payments/{id}:
 *   put:
 *     summary: Update a payment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the payment to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Payment'
 *     responses:
 *       200:
 *         description: Successfully updated payment
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', async (req, res) => {
  try {
    const payment = await db.Payment.update(req.body, {
      where: { id: req.params.id },
    });
    res.json(payment);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /payments/{id}:
 *   delete:
 *     summary: Delete a payment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the payment to delete
 *     responses:
 *       200:
 *         description: Payment deleted successfully
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', async (req, res) => {
  try {
    await db.Payment.destroy({
      where: { id: req.params.id },
    });
    res.json({ message: 'Payment deleted successfully' });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
