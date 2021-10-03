const { execSync } = require('child_process');
const { hostname } = require('os');
const { createProxyMiddleware } = require('http-proxy-middleware');

let url;

if (hostname() === 'seven-PC') {
   url = `http://localhost:5000`
} else {
   url = execSync('gp url 5000').toString().trim()
}

module.exports = (app) => {
   app.use(
      'socket.io',
      createProxyMiddleware({
         target: url.replace(/^https/i, 'ws'),
         changeOrigin: true,
      })
   );
};
