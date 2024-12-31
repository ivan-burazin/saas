import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const port = 3000;

app.use(cors());

// Proxy middleware configuration
const apiProxy = createProxyMiddleware({
  target: 'https://api-a0534c9b-df6d-40f5-8657-792993bc24ec.try-eu.daytona.app',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '', // Remove /api prefix when forwarding to target
  },
  onProxyReq: (proxyReq, req, res) => {
    // Add authorization header
    proxyReq.setHeader('Authorization', 'Bearer ZTVlYTkzYzMtZGVmMi00OGJlLThjYzItOThiNDE5MmM2YWZj');
    
    // Log the outgoing request for debugging
    console.log('Proxying request:', {
      method: req.method,
      path: req.path,
      targetUrl: 'https://api-a0534c9b-df6d-40f5-8657-792993bc24ec.try-eu.daytona.app' + req.path.replace(/^\/api/, '')
    });
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).send('Proxy error: ' + err.message);
  }
});

// Use proxy for all /api/* requests
app.use('/api', apiProxy);

app.listen(port, () => {
  console.log(`Proxy server running on http://localhost:${port}`);
});
