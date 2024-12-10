const express = require('express');
const bodyParser = require('body-parser');
const db = require('./models');
const session = require('express-session');
const Keycloak = require('keycloak-connect');
const swaggerConfig = require('./swagger/swaggerConfig');
const { router: metricsRouter, startMetricsRecording, stopMetricsRecording } = require('./routes/metrics');

const cors = require('cors');

const { keycloak } = require('./config/keycloak');;

const app = express();
app.use(bodyParser.json());

const memoryStore = new session.MemoryStore();

app.use(cors({
  origin: ['http://localhost:8080',
           'http://localhost:3004',
           'http://localhost:3001',
           'http://localhost:9090'],
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
  console.log(req)
  res.json({ message: "This is a protected route" });
});

app.use(metricsRouter);

// Start metrics recording
startMetricsRecording();

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
app.use('/customer', require('./routes/userorder'));

// Swagger Documentation
swaggerConfig(app);

if (require.main === module) {
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT,'0.0.0.0', async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Connection has been established successfully.');

    await db.sequelize.sync({ alter: true });
    console.log('Database synchronized');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  console.log(`Server is running on port ${PORT}`);
});

const shutdown = async () => {
  console.log('Shutting down server...');
  try {
    // Stop metrics recording
    stopMetricsRecording();

    // Close database connections
    await db.sequelize.close();
    console.log('Database connection closed.');

    // Close the server
    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(0); // Exit
    });
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1); // Exit with error
    }
  };

  // Handle termination signals
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

module.exports = app;
