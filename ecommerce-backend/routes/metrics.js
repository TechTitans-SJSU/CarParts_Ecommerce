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

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5, 10] // Define bucket ranges for histogram
});

const httpRequestCount = new client.Counter({
  name: 'http_request_count',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const errorCount = new client.Counter({
  name: 'error_count',
  help: 'Total number of application errors',
  labelNames: ['type']
});

const processMemoryUsage = new client.Gauge({
  name: 'process_memory_usage_bytes',
  help: 'Memory usage of the Node.js process',
  labelNames: ['type']
});

const activeSessions = new client.Gauge({
  name: 'active_sessions',
  help: 'Number of active user sessions'
});

// Add metrics to the registry
register.registerMetric(pageLoadTime);
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestCount);
register.registerMetric(errorCount);
register.registerMetric(processMemoryUsage);
register.registerMetric(activeSessions);

// Use default metrics provided by prom-client (e.g., CPU usage, event loop lag)
client.collectDefaultMetrics({ register });

// Simulate page load times for different pages
const pages = ['Categories', 'Products', 'Checkout', 'Parts'];
let metricsInterval;

function startMetricsRecording() {
  metricsInterval = setInterval(() => {
    pages.forEach((page) => {
      const simulatedLoadTime = Math.random() * 200; // Simulate load time
      pageLoadTime.set({ page }, simulatedLoadTime); // Record load time for the page
    });

    // Simulate memory usage
    const memoryUsage = process.memoryUsage();
    processMemoryUsage.set({ type: 'heapUsed' }, memoryUsage.heapUsed);
    processMemoryUsage.set({ type: 'heapTotal' }, memoryUsage.heapTotal);

    // console.log('Metrics updated.');
  }, 5000);
}

function stopMetricsRecording() {
  clearInterval(metricsInterval);
}

// Middleware to track HTTP request metrics
router.use((req, res, next) => {
  if (req.path === '/metrics') return next(); // Exclude /metrics from tracking
  const start = process.hrtime();
  res.on('finish', () => {
    const duration = process.hrtime(start);
    const durationInSeconds = duration[0] + duration[1] / 1e9;

    // Record HTTP request duration
    httpRequestDuration.observe(
      {
        method: req.method,
        route: req.route ? req.route.path : req.url,
        status_code: res.statusCode
      },
      durationInSeconds
    );

    // Increment HTTP request count
    httpRequestCount.inc({
      method: req.method,
      route: req.route ? req.route.path : req.url,
      status_code: res.statusCode
    });
  });

  next();
});

// Expose metrics at /metrics
router.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Export both the router and the cleanup function
module.exports = { router, stopMetricsRecording, startMetricsRecording };
