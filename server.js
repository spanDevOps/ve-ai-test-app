const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log('\n=== Incoming Request ===');
  console.log(`Time: ${new Date().toISOString()}`);
  console.log(`URL: ${req.url}`);
  console.log(`Method: ${req.method}`);
  console.log('Headers:');
  Object.entries(req.headers).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });
  console.log('======================\n');

  // Log to file
  const logEntry = {
    timestamp: new Date().toISOString(),
    url: req.url,
    method: req.method,
    headers: req.headers
  };
  
  fs.appendFileSync(
    path.join(__dirname, 'header-logs.txt'),
    JSON.stringify(logEntry, null, 2) + '\n\n',
    { flag: 'a+' }
  );
  
  next();
});

// API endpoint to return workspace info
app.get('/api/workspace-info', (req, res) => {
  console.log('=== API endpoint hit ===');
  console.log('Headers received:', JSON.stringify(req.headers, null, 2));
  
  const workspaceId = req.headers['x-workspace-id'] || null;
  const originalDomain = req.headers['x-debug-original-domain'] || null;
  
  console.log('Workspace ID:', workspaceId);
  console.log('Original Domain:', originalDomain);
  
  // Set response headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  
  if (workspaceId) {
    res.setHeader('x-workspace-id', workspaceId);
  }
  
  const response = {
    workspaceId,
    originalDomain,
    headers: req.headers,
    timestamp: new Date().toISOString()
  };
  
  console.log('Sending response:', JSON.stringify(response, null, 2));
  console.log('=====================\n');
  
  res.status(200).json(response);
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
