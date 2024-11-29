/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         order_id:
 *           type: string
 *         user_id:
 *           type: string
 *         total_amount:
 *           type: number
 *         shipping_address:
 *           type: string
 *         status:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 */

const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// const generateOrderId = () => {
//   const timestamp = Date.now().toString();
//   const random = Math.random().toString(36).substr(2, 5);
//   return `ORD-${timestamp}-${random.toUpperCase()}`;
// };

// const generateUserId = () => {
//     const timestamp = Date.now().toString();
//     const random = Math.random().toString(36).substr(2, 5);
//     return `USR-${timestamp}-${random.toUpperCase()}`;
//    };


/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     part_id:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *                     price:
 *                       type: number
 *               total:
 *                 type: number
 *               shippingDetails:
 *                 type: object
 *     responses:
 *       201:
 *         description: Order created
 *       500:
 *         description: Server error
 */
// const createOrder = async (req, res) => {
//   const client = await db.sequelize.transaction();
//   try {
//     await client.query('BEGIN');
//     const orderId = generateOrderId();
//     const keycloakUserId = req.kauth.grant.access_token.content.sub;
//     const { items, total, shippingDetails, paymentDetails } = req.body;

//     const orderResult = await client.query(
//       `INSERT INTO userorders 
//       (order_id, user_id, total_amount, shipping_address, city, zip_code, 
//        status, first_name, last_name, email, payment_details) 
//       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
//       RETURNING *`,
//       [orderId, keycloakUserId, total, shippingDetails.address,
//        shippingDetails.city, shippingDetails.zipCode, 'PENDING',
//        shippingDetails.firstName, shippingDetails.lastName,
//        shippingDetails.email, JSON.stringify(paymentDetails)]
//     );

//     for (const item of items) {
//       await client.query(
//         `INSERT INTO userorderitems (order_id, part_id, quantity, price) 
//          VALUES ($1, $2, $3, $4)`,
//         [orderId, item.part_id, item.quantity, item.price]
//       );
//     }

//     await client.query('COMMIT');
//     res.status(201).json({
//       message: 'Order created successfully',
//       order: orderResult.rows[0]
//     });

//   } catch (error) {
//     await client.query('ROLLBACK');
//     res.status(500).json({ error: error.message });
//   } finally {
//     client.release();
//   }
// };

const UserOrderItem = require('../models/userorderitem');
const UserOrder = require('../models/userorder');

/**
 * Create a new order
 */
const createOrder = async (req, res) => {
    const generateOrderId = () => {
        const timestamp = Date.now().toString();
        const random = Math.random().toString(36).substr(2, 5);
        return `ORD-${timestamp}-${random.toUpperCase()}`;
      };
      
    const generateUserId = () => {
          const timestamp = Date.now().toString();
          const random = Math.random().toString(36).substr(2, 5);
          return `USR-${timestamp}-${random.toUpperCase()}`;
         };
  const transaction = await db.sequelize.transaction(); // Start a transaction
  try {
    const order_id = generateOrderId();
    const user_id = generateUserId();
    //const keycloakUserId = req.kauth.grant.access_token.content.sub; // Authenticated user ID
    const { items, total_amount, shippingDetails, paymentDetails } = req.body;

    // Create the order
    const order = await UserOrder.create(
      {
        order_id: order_id,
        user_id: user_id,
        total_amount: total_amount,
        shipping_address: shippingDetails.shipping_address,
        city: shippingDetails.city,
        zip_code: shippingDetails.zip_code,
        status: 'PENDING',
        first_name: shippingDetails.first_name,
        last_name: shippingDetails.last_name,
        email: shippingDetails.email,
        payment_details: 'CARD', // Dummy payment details
      },
      { transaction }
    );

    // Create the order items
    const orderItems = items.map((item) => ({
      order_id: order_id,
      part_id: item.part_id,
      quantity: item.quantity,
      price: item.price,
    }));

    await UserOrderItem.bulkCreate(orderItems, { transaction });

    // Commit the transaction
    await transaction.commit();

    res.status(201).json({
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};


/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get user's orders
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
// const getOrders = async (req, res) => {
//   try {
//     const keycloakUserId = req.kauth.grant.access_token.content.sub;
//     const result = await pool.query(
//       `SELECT * FROM user_orders WHERE user_id = $1 ORDER BY created_at DESC`,
//       [keycloakUserId]
//     );
//     res.json(result.rows);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

const getOrders = async (req, res) => {
    try {
      //const keycloakUserId = req.kauth.grant.access_token.content.sub;
      // Fetch all orders for the user
      const { user_id } = req.params
      const orders = await UserOrder.findAll({
        where: { user_id },
        order: [['created_at', 'DESC']], // Order by createdAt descending
      });
  
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

/**
 * @swagger
 * /api/orders/{orderId}:
 *   get:
 *     summary: Get order by ID
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 */
// const getOrderById = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const keycloakUserId = req.kauth.grant.access_token.content.sub;

//     const result = await pool.query(
//       `SELECT o.*, i.part_id, i.quantity, i.price
//        FROM user_orders o
//        LEFT JOIN order_items i ON o.order_id = i.order_id
//        WHERE o.order_id = $1 AND o.user_id = $2`,
//       [orderId, keycloakUserId]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: 'Order not found' });
//     }

//     res.json(result.rows);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

const getOrderById = async (req, res) => {
    try {
      const { order_id } = req.params;
      const { user_id } = req.params;
  
      // Fetch order and its items
      const order = await UserOrder.findOne({
        where: { order_id, user_id },
        include: [
          {
            model: UserOrderItem, // Include associated order items
            as: 'items', // Alias for the relationship
          },
        ],
      });
  
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

module.exports = {
  createOrder,
  getOrders,
  getOrderById
};