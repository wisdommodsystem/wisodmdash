const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
// إزالة 'localhost' والسماح لـ Next.js بتحديد الـ hostname تلقائياً
const app = next({ dev }); 
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      
      // إخبار NextAuth أننا خلف بروكسي (Cloudflare/Render)
      req.headers['x-forwarded-proto'] = 'https';
      
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  }).listen(port, () => {
    console.log(`> Ready on port ${port}`);
  });
});
