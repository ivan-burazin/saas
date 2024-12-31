import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
app.use(cors());

const apiProxy = createProxyMiddleware({
  target: 'https://api-a0534c9b-df6d-40f5-8657-792993bc24ec.try-eu.daytona.app',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/'
  },
  onProxyRes: function(proxyRes, req, res) {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET,POST,DELETE,OPTIONS';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization';
  }
});

app.use('/api', apiProxy);

const port = 3000;
app.listen(port, () => {
  console.log(`Proxy server running on http://localhost:${port}`);
});
