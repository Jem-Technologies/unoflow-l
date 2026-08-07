const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

const server = http.createServer((req, res) => {
  // Parse URL to discard query parameters and hash
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = parsedUrl.pathname;

  // Resolve file paths relative to root directory to allow website/ to import ../dist/
  let filePath = path.join(__dirname, '..', pathname);

  // If the path refers to a directory, check if index.html exists in that directory
  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    // Attempt to read the physical file
    fs.readFile(filePath, (error, content) => {
      if (!error) {
        // File found, serve it with proper content-type
        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      } else {
        // SPA Fallback: If it's not a physical file, serve /website/index.html
        const spaIndexHtmlPath = path.join(__dirname, '..', 'website', 'index.html');
        fs.readFile(spaIndexHtmlPath, (spaError, spaContent) => {
          if (!spaError) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(spaContent, 'utf-8');
          } else {
            // fallback if website/index.html itself doesn't exist yet
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found (and unable to serve SPA index)', 'utf-8');
          }
        });
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`\x1b[36m🚀 UnoFlow-L Dev Server running at http://localhost:${PORT}\x1b[0m`);
});
