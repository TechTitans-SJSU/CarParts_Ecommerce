const request = require('supertest');
const express = require('express');
const { router, stopMetricsRecording } = require('../routes/metrics'); 

const app = express();
app.use(router);

afterAll(() => {
    // Ensure the interval is cleared after tests
    stopMetricsRecording();
});

test('GET /metrics', async () => {
    const response = await request(app).get('/metrics');
    expect(response.status).toBe(200);
    expect(response.text).toContain('page_load_time');
});
