// const express = require('express');
// const router = express.Router();
// const db = require('../models');

// // Create a new order
// router.post('/', async (req, res) => {
//   try {
//     const order = await db.Order.create(req.body);
//     res.json(order);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

// // Get all orders
// router.get('/', async (req, res) => {
//   try {
//     const orders = await db.Order.findAll({
//       include: [db.OrderItem, db.Shipping, db.Payment]
//     });
//     res.json(orders);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

// // Get order by ID
// router.get('/:id', async (req, res) => {
//   try {
//     const order = await db.Order.findByPk(req.params.id, {
//       include: [db.OrderItem, db.Shipping, db.Payment]
//     });
//     if (order) {
//       res.json(order);
//     } else {
//       res.status(404).send('Order not found');
//     }
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

// // Update an order
// router.put('/:id', async (req, res) => {
//   try {
//     const order = await db.Order.update(req.body, {
//       where: { id: req.params.id },
//     });
//     res.json(order);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

// // Delete an order
// router.delete('/:id', async (req, res) => {
//   try {
//     await db.Order.destroy({
//       where: { id: req.params.id },
//     });
//     res.json({ message: 'Order deleted successfully' });
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
 * tags:
 *   name: Orders
 *   description: Order management
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID of the user placing the order
 *               orderDate:
 *                 type: string
 *                 format: date-time
 *                 description: Date when the order was placed
 *               status:
 *                 type: string
 *                 description: Status of the order (e.g., "Pending", "Shipped")
 *     responses:
 *       200:
 *         description: The created order
 *       500:
 *         description: Server error
 */
router.post('/', async (req, res) => {
  try {
    const order = await db.Order.create(req.body);
    res.json(order);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Retrieve a list of orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: A list of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
  try {
    const orders = await db.Order.findAll({
      include: [db.OrderItem, db.Shipping, db.Payment]
    });
    res.json(orders);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Retrieve a single order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the order to retrieve
 *     responses:
 *       200:
 *         description: Details of the specified order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.get('/:id', async (req, res) => {
  try {
    const order = await db.Order.findByPk(req.params.id, {
      include: [db.OrderItem, db.Shipping, db.Payment]
    });
    if (order) {
      res.json(order);
    } else {
      res.status(404).send('Order not found');
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Update an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the order to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: Updated status of the order
 *     responses:
 *       200:
 *         description: The updated order
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.put('/:id', async (req, res) => {
  try {
    const order = await db.Order.update(req.body, {
      where: { id: req.params.id },
    });
    res.json(order);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Delete an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the order to delete
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', async (req, res) => {
  try {
    await db.Order.destroy({
      where: { id: req.params.id },
    });
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
