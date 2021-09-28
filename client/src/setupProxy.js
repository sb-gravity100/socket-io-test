const { execSync } = require('child_process');
const { createProxyMiddleware } = require('http-proxy-middleware');

const url = execSync('gp url 5000').toString().trim();

module.exports = (app) => {
   app.use(
      'socket.io',
      createProxyMiddleware({
         target: url.replace(/^https?/i, 'ws'),
         changeOrigin: true,
      })
   );
};
