const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Debug middleware to log all requests very clearly
app.use((req, res, next) => {
  console.log('\n======== RAW REQUEST FROM CLOUDFRONT ========');
  console.log(`Time: ${new Date().toISOString()}`);
  console.log(`URL: ${req.url}`);
  console.log(`Method: ${req.method}`);
  console.log('\nHEADERS:');
  Object.entries(req.headers).forEach(([key, value]) => {
    console.log(`${key}: ${value}`);
  });
  
  // Specifically check for workspace headers
  console.log('\nWORKSPACE HEADERS CHECK:');
  console.log(`x-workspace-id: ${req.headers['x-workspace-id'] || 'NOT FOUND'}`);
  console.log(`x-amz-workspace-id: ${req.headers['x-amz-workspace-id'] || 'NOT FOUND'}`);
  console.log('===========================================\n');
  
  next();
});

// Add a simple API endpoint that returns all headers
app.get('/api/headers', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  
  const response = {
    headers: req.headers,
    workspaceId: req.headers['x-workspace-id'] || 'NOT FOUND',
    amzWorkspaceId: req.headers['x-amz-workspace-id'] || 'NOT FOUND',
    timestamp: new Date().toISOString()
  };
  
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
  console.log('Logging all raw request headers to console');
});
