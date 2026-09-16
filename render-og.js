const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 4567;
const HTML_FILE = path.join(__dirname, 'og-template.html');
const OUTPUT_PNG = path.join(__dirname, 'og-image.png');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/og-template.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(fs.readFileSync(HTML_FILE));
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, async () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  
  // Give 1 second for any external connections, then invoke Chrome
  setTimeout(() => {
    console.log('Spawning Chrome to take screenshot...');
    const args = [
      '--headless=new',
      '--disable-gpu',
      '--window-size=1200,630',
      '--hide-scrollbars',
      '--run-all-compositor-stages-before-draw',
      `--screenshot=${OUTPUT_PNG}`,
      `http://localhost:${PORT}/og-template.html`
    ];

    const proc = spawn(CHROME_PATH, args, { stdio: 'inherit' });

    proc.on('close', (code) => {
      console.log(`Chrome finished with code ${code}`);
      server.close(() => {
        console.log('Server closed.');
        process.exit(code);
      });
    });

    proc.on('error', (err) => {
      console.error('Failed to spawn Chrome:', err);
      server.close(() => process.exit(1));
    });
  }, 1000);
});
