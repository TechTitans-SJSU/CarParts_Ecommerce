// services/RUMService.js
class RUMService {
    constructor() {
      this.metrics = {};
    }
  
    // Track page load performance
    trackPageLoad(pageName) {
      const timing = performance.timing;
      const metrics = {
        timestamp: new Date().toISOString(),
        page: pageName,
        loadTime: timing.loadEventEnd - timing.navigationStart,
        domReadyTime: timing.domContentLoadedEventEnd - timing.navigationStart,
        renderTime: timing.domComplete - timing.domInteractive
      };
  
      console.log(`Page Load Metrics - ${pageName}:`, metrics);
      // Send to analytics server
    }
  
    // Track user interactions
    trackInteraction(page, action, details) {
      const interaction = {
        timestamp: new Date().toISOString(),
        page,
        action,
        details
      };
  
      console.log('User Interaction:', interaction);
      // Send to analytics server
    }
  
    // Track API calls
    trackApiCall(endpoint, duration, status) {
      const apiMetrics = {
        timestamp: new Date().toISOString(),
        endpoint,
        duration,
        status
      };
  
      console.log('API Call:', apiMetrics);
      // Send to analytics server
    }
  }
  
  
//export default new RUMService();

const rumServiceInstance = new RUMService();
export default rumServiceInstance;