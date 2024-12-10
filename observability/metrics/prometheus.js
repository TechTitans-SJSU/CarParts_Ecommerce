const express = require('express');
const prometheus = require('prom-client');

const app = express();

// Create a registry to register custom metrics
const register = new prometheus.Registry();

// Enable default metrics and add them to the registry
prometheus.collectDefaultMetrics({ register });

// Define custom metrics
const pageLoadDuration = new prometheus.Gauge({
  name: 'page_load_time',
  help: 'Page load time in milliseconds',
  labelNames: ['page']
});

const apiCallDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5, 10] // Histogram buckets
});

const requestCount = new prometheus.Counter({
  name: 'http_request_count',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const errorCount = new prometheus.Counter({
  name: 'error_count',
  help: 'Total number of application errors',
  labelNames: ['type']
});

const memoryUsage = new prometheus.Gauge({
  name: 'process_memory_usage_bytes',
  help: 'Memory usage of the Node.js process',
  labelNames: ['type']
});

const activeSessions = new prometheus.Gauge({
  name: 'active_sessions',
  help: 'Number of active user sessions'
});

// Register all custom metrics
register.registerMetric(pageLoadDuration);
register.registerMetric(apiCallDuration);
register.registerMetric(requestCount);
register.registerMetric(errorCount);
register.registerMetric(memoryUsage);
register.registerMetric(activeSessions);

// Middleware to collect actual metrics
app.use((req, res, next) => {
    const start = process.hrtime();
    res.on('finish', () => {
      const duration = process.hrtime(start);
      const durationInSeconds = duration[0] + duration[1] / 1e9;

      // Record HTTP request duration
      apiCallDuration.observe(
        {
          method: req.method,
          route: req.route ? req.route.path : req.url,
          status_code: res.statusCode
        },
        durationInSeconds
      );

      // Increment HTTP request count
      requestCount.inc({
        method: req.method,
        route: req.route ? req.route.path : req.url,
        status_code: res.statusCode
      });
    });
    next();
});

app.post('/page-load', (req, res) => {
    const { page, loadTime } = req.body;
    if (page && loadTime) {
      pageLoadDuration.set({ page }, loadTime);
      res.send('Page load time recorded.');
    } else {
      res.status(400).send('Invalid request.');
    }
  });

  app.post('/error', (req, res) => {
    const { type } = req.body;
    if (type) {
      errorCount.inc({ type });
      res.send('Error recorded.');
    } else {
      res.status(400).send('Invalid request.');
    }
  });

  app.post('/active-sessions', (req, res) => {
    const { count } = req.body;
    if (typeof count === 'number') {
      activeSessions.set(count);
      res.send('Active sessions updated.');
    } else {
      res.status(400).send('Invalid request.');
    }
  });

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Start the server
app.listen(9090, () => {
  console.log('Prometheus metrics server running on port 9090');
});
