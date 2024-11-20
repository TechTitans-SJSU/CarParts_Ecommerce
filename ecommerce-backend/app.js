const express = require('express');
const bodyParser = require('body-parser');
const db = require('./models');
const session = require('express-session');
const Keycloak = require('keycloak-connect');
const swaggerConfig = require('./swagger/swaggerConfig');

const cors = require('cors');

const { keycloak } = require('./config/keycloak');;

const app = express();
app.use(bodyParser.json());

// Keycloak Configuration

const memoryStore = new session.MemoryStore();
// const keycloak = new Keycloak({ store: memoryStore }, {
//     clientId: 'ecommerce-app',
//     bearerOnly: true,
//     serverUrl: 'http://localhost:8080/auth',
//     realm: 'Ecommerce_Car',
//     credentials: {
//         secret: 'GKalicr2Cj1fvW1iWR66DMkraosXT5PD'
//     }
// });

app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:3000'], // Keycloak server
  credentials: true
}));

// Set up session and Keycloak middleware
app.use(session({
  secret: 'some-secret-key',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

app.use(keycloak.middleware({
  logout: '/logout',
  admin: '/'
}));

//keycloak routes
app.use('/api/protected', keycloak.protect(), (req, res) => {
  res.json({ message: "This is a protected route" });
});


// Routes
app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/users'));
app.use('/products', require('./routes/products'));
app.use('/parts', require('./routes/parts'));
app.use('/orders', require('./routes/orders'));
app.use('/category', require('./routes/category'));
app.use('/payments', require('./routes/payments'));
app.use('/shipping', require('./routes/shipping'));
app.use('/sales', require('./routes/sales'));
app.use('/order-items', require('./routes/order_item'));

// Swagger Documentation
swaggerConfig(app);

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, async () => {
//   try {
//     await db.sequelize.authenticate();
//     console.log('Connection has been established successfully.');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
//   console.log(`Server is running on port ${PORT}`);
//});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Connection has been established successfully.');
    
    await db.sequelize.sync({ alter: true }); // Move sync here
    console.log('Database synchronized');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  console.log(`Server is running on port ${PORT}`);
});
