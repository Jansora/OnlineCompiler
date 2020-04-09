
const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
  app.use(createProxyMiddleware('/playground', {
    target: 'http://localhost:9002/',
    // target: 'https://jansora.com/',
    changeOrigin: true,
  }));
};
