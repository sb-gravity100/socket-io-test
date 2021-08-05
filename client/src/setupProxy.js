const { createProxyMiddleware } = require('http-proxy-middleware');
const cp = require('child_process');

const socketUrl = new URL(cp.execSync('gp url 5000').toString().trim());
socketUrl.protocol = 'ws';

module.exports = function (app) {
   app.use(
      '/socket.io',
      createProxyMiddleware({
         target: socketUrl.href,
         changeOrigin: true,
      })
   );
};
