const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { userorderitems, userorders } = require('../models');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Car Parts eCommerce API',
      version: '1.0.0',
    },
    components: {
        schemas: {
            //Order Items Table
                userorderitems: {
                    type: 'object',
                    properties: {
                    id: {
                        type: 'integer',
                        description: 'Unique identifier for the order item',
                    },
                    order_id: {
                        type: 'integer',
                        description: 'ID of the associated order',
                    },
                    part_id: {
                        type: 'integer',
                        description: 'ID of the associated order',
                    },
                    quantity: {
                        type: 'integer',
                        description: 'Quantity of the product ordered',
                    },
                    price: {
                        type: 'number',
                        format: 'float',
                        description: 'Price of the order item',
                    },
                    },
                    required: ['orderId', 'part_id','quantity', 'price'],
                },
                // Users Table
                User: {
                  type: 'object',
                  properties: {
                    user_id: {
                    type: 'integer',
                    description: 'Unique identifier for each user',
                    },
                    username: {
                    type: 'string',
                    maxLength: 255,
                    description: 'User\'s unique username',
                    },
                    email: {
                    type: 'string',
                    maxLength: 255,
                    description: 'User\'s email address',
                    },
                    password_hash: {
                    type: 'string',
                    maxLength: 255,
                    description: 'Hashed password for security',
                    },
                    first_name: {
                    type: 'string',
                    maxLength: 100,
                    description: 'User\'s first name',
                    },
                    last_name: {
                    type: 'string',
                    maxLength: 100,
                    description: 'User\'s last name',
                    },
                    created_at: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Timestamp when the user account was created',
                    },
                    is_active: {
                    type: 'boolean',
                    description: 'Indicates if the account is active or not',
                    },
                  },
                  required: ['username', 'email', 'password_hash'],
                },
          
                        // Products Table
                Product: {
                    type: 'object',
                    properties: {
                        product_id: {
                            type: 'integer',
                            description: 'Unique identifier for each product',
                        },
                        product_name: {
                            type: 'string',
                            maxLength: 255,
                            description: 'Name of the product',
                        },
                        category_id: {
                            type: 'integer',
                            description: 'Foreign key referencing the categories table',
                        },
                    },
                    required: ['product_id'],
                },
                // Parts Table
                Part: {
                    type: 'object',
                    properties: {
                        part_id: {
                            type: 'integer',
                            description: 'Unique identifier for each product',
                        },
                        product_id: {
                            type: 'integer',
                            description: 'Foreign key referencing the parts table',
                        },
                        part_name: {
                            type: 'string',
                            maxLength: 255,
                            description: 'Name of the product',
                        },
                        description: {
                            type: 'string',
                            description: 'Detailed description of the product',
                        },
                        image_name: {
                            type: 'string',
                            maxLength: 255,
                            description: 'URL of the product image',
                        },
                    },
                    required: ['part_id'],
                },
    
                // Sales Table
                Sale: {
                    type: 'object',
                    properties: {
                        sale_id: {
                            type: 'integer',
                            description: 'Unique identifier for each sale transaction',
                        },
                        user_id: {
                            type: 'integer',
                            description: 'Foreign key referencing the users table',
                        },
                        total_amount: {
                            type: 'number',
                            format: 'decimal',
                            description: 'Total amount for the sale',
                        },
                        sale_date: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Date and time of the sale',
                        },
                    },
                    required: ['user_id', 'total_amount'],
                },
    
                // Orders Table
                Order: {
                    type: 'object',
                    properties: {
                        order_id: {
                            type: 'integer',
                            description: 'Unique identifier for each order',
                        },
                        user_id: {
                            type: 'integer',
                            description: 'Foreign key referencing the users table',
                        },
                        order_date: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Date and time the order was placed',
                        },
                        status: {
                            type: 'string',
                            maxLength: 50,
                            description: 'Status of the order (e.g., pending, shipped, delivered)',
                        },
                        shipping_id: {
                            type: 'integer',
                            description: 'Foreign key referencing the shipping table',
                        },
                    },
                    required: ['user_id', 'order_date', 'status'],
                },
                // UserOrder Table
                userorders: {
                    type: 'object',
                    properties: {
                        order_id: {
                            type: 'string',
                            description: 'Unique identifier for each order',
                        },
                        user_id: {
                            type: 'string',
                            description: 'Foreign key referencing the users table',
                        },
                        first_name: {
                            type: 'string',
                            description: 'First name of the user',
                        },
                        last_name: {
                            type: 'string',
                            description: 'Last name of the user',
                        },
                        email: {
                            type: 'string',
                            description: 'Email address of the user',
                        },
                        shipping_address: {
                            type: 'string',
                            description: 'Shipping address',
                        },
                        city: {
                            type: 'string',
                            description: 'City of the user',
                        },
                        zip_code: {
                            type: 'string',
                            description: 'Zip code of the user',
                        },
                        created_at: {
                            type: 'string',
                            description: 'Timestamp when the order was created',
                        },
                    },
                    required: ['orderId','userId', 'created_at'],
                },
                // Categories Table
                Category: {
                    type: 'object',
                    properties: {
                        category_id: {
                            type: 'integer',
                            description: 'Unique identifier for each category',
                        },
                        category_name: {
                            type: 'string',
                            maxLength: 255,
                            description: 'Name of the category',
                        },
                    },
                    required: ['category_name'],
                },
    
                // Payments Table
                Payment: {
                    type: 'object',
                    properties: {
                        payment_id: {
                            type: 'integer',
                            description: 'Unique identifier for each payment',
                        },
                        order_id: {
                            type: 'integer',
                            description: 'Foreign key referencing the orders table',
                        },
                        payment_date: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Date and time of the payment',
                        },
                        amount: {
                            type: 'number',
                            format: 'decimal',
                            description: 'Amount paid',
                        },
                        payment_method: {
                            type: 'string',
                            maxLength: 50,
                            description: 'Method of payment (e.g., credit card, PayPal)',
                        },
                    },
                    required: ['order_id', 'amount', 'payment_method'],
                },
    
                // Shipping Table
                Shipping: {
                    type: 'object',
                    properties: {
                        shipping_id: {
                            type: 'integer',
                            description: 'Unique identifier for each shipping record',
                        },
                        order_id: {
                            type: 'integer',
                            description: 'Foreign key referencing the orders table',
                        },
                        address: {
                            type: 'string',
                            description: 'Shipping address',
                        },
                        tracking_number: {
                            type: 'string',
                            maxLength: 100,
                            description: 'Tracking number for the shipment',
                        },
                        shipping_date: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Date the order was shipped',
                        },
                        delivery_date: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Estimated delivery date',
                        },
                    },
                    required: ['order_id', 'address', 'tracking_number'],
                },
            },
        },
    },
  
  apis: ['./routes/*.js'], 
};
 

const swaggerSpec = swaggerJsdoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
