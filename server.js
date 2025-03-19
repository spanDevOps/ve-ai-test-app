const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to log all headers to a file
app.use((req, res, next) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    headers: req.headers
  };
  
  // Log to console
  console.log('Request received:');
  console.log(JSON.stringify(logEntry, null, 2));
  
  // Log to file
  fs.appendFileSync(
    path.join(__dirname, 'header-logs.txt'),
    JSON.stringify(logEntry, null, 2) + '\n\n',
    { flag: 'a+' }
  );
  
  next();
});

// API endpoint to return workspace info
app.get('/api/workspace-info', (req, res) => {
  const workspaceId = req.headers['x-workspace-id'] || null;
  const originalDomain = req.headers['x-debug-original-domain'] || null;
  
  // Set response headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  
  // Forward the workspace ID header in the response if present
  if (workspaceId) {
    res.setHeader('x-workspace-id', workspaceId);
  }
  
  res.json({
    workspaceId,
    originalDomain,
    headers: req.headers
  });
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Headers will be logged to ${path.join(__dirname, 'header-logs.txt')}`);
});
