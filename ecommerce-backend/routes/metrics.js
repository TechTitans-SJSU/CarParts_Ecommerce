// // backend/routes/metrics.js
// const express = require('express');
// const router = express.Router();


// // Endpoint to receive metrics
// router.post('/api/metrics', async (req, res) => {
//   try {
//     const { type, timestamp, data } = req.body;

//     // Basic validation
//     if (!type || !timestamp || !data) {
//       return res.status(400).json({ error: 'Invalid data format' });
//     }

//     // Log the metric (or save to a database)
//     console.log('Received Metric:', { type, timestamp, data });


//     res.status(201).json({ message: 'Metric recorded successfully' });
//   } catch (error) {
//     console.error('Error handling metric:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// module.exports = router;

const express = require('express');
const client = require('prom-client'); // Prometheus client library
const router = express.Router();

// Create a Registry to hold metrics
const register = new client.Registry();

// Define custom metrics
const pageLoadTime = new client.Gauge({
  name: 'page_load_time',
  help: 'Page load time in milliseconds',
  labelNames: ['page']
});

// Add metrics to the registry
register.registerMetric(pageLoadTime);

const pages = ['Categories', 'Products', 'Checkout', 'Parts'];

// Example of recording metrics
setInterval(() => {
    pages.forEach((page) => {
      const simulatedLoadTime = Math.random() * 200; // Simulate load time
      pageLoadTime.set({ page }, simulatedLoadTime); // Record load time for the page
      console.log(`Recorded load time for ${page}: ${simulatedLoadTime}ms`);
    });
  }, 5000);

// Expose metrics at /metrics
router.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

module.exports = router;

