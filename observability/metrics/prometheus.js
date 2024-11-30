// metrics/prometheus.js
const express = require('express');
const prometheus = require('prom-client');

// Create metrics
const pageLoadDuration = new prometheus.Histogram({
  name: 'page_load_duration_seconds',
  help: 'Duration of page loads',
  labelNames: ['page']
});

const apiCallDuration = new prometheus.Histogram({
  name: 'api_call_duration_seconds',
  help: 'Duration of API calls',
  labelNames: ['endpoint', 'status']
});

// Enable default metrics
prometheus.collectDefaultMetrics();

// Create metrics endpoint
const app = express();
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', prometheus.register.contentType);
  res.end(await prometheus.register.metrics());
});

app.listen(9090, () => {
  console.log('Metrics server running on port 9090');
});