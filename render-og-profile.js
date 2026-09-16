const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 4568;
const HTML_FILE = path.join(__dirname, 'og-profile-template.html');
const OUTPUT_PNG = path.join(__dirname, 'og-profile.png');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const server = http.createServer((req, res) => {
  const reqUrl = req.url.split('?')[0];
  if (reqUrl === '/' || reqUrl === '/og-profile-template.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(fs.readFileSync(HTML_FILE));
  } else if (reqUrl.startsWith('/img/')) {
    const imgPath = path.join(__dirname, reqUrl);
    if (fs.existsSync(imgPath)) {
      const ext = path.extname(imgPath).toLowerCase();
      const mime = ext === '.png' ? 'image/png' : 'image/jpeg';
      res.writeHead(200, { 'Content-Type': mime });
      res.end(fs.readFileSync(imgPath));
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`OG Profile server listening on http://localhost:${PORT}`);
  
  setTimeout(() => {
    console.log('Rendering og-profile.png with Chrome headless...');
    const args = [
      '--headless=new',
      '--disable-gpu',
      '--window-size=1200,630',
      '--hide-scrollbars',
      '--run-all-compositor-stages-before-draw',
      `--screenshot=${OUTPUT_PNG}`,
      `http://localhost:${PORT}/og-profile-template.html`
    ];

    const proc = spawn(CHROME_PATH, args, { stdio: 'inherit' });

    proc.on('close', (code) => {
      console.log(`Chrome screenshot completed with code ${code}`);
      server.close(() => {
        process.exit(code);
      });
    });

    proc.on('error', (err) => {
      console.error('Failed to spawn Chrome:', err);
      server.close(() => process.exit(1));
    });
  }, 1200);
});
