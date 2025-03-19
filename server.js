const express = require('express');
const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure AWS SDK
const cloudWatchLogs = new AWS.CloudWatchLogs({
  region: 'us-east-1' // Adjust to your region
});

// Log group and stream names
const LOG_GROUP = '/aws/amplify/ve-ai-test-app';
const LOG_STREAM = 'express-server-logs';

// Simple function to log to CloudWatch
async function logToCloudWatch(message) {
  try {
    // Ensure log group exists
    try {
      await cloudWatchLogs.createLogGroup({
        logGroupName: LOG_GROUP
      }).promise();
      console.log('Log group created or already exists');
    } catch (error) {
      if (error.code !== 'ResourceAlreadyExistsException') {
        console.error('Error creating log group:', error);
      }
    }

    // Ensure log stream exists
    try {
      await cloudWatchLogs.createLogStream({
        logGroupName: LOG_GROUP,
        logStreamName: LOG_STREAM
      }).promise();
      console.log('Log stream created or already exists');
    } catch (error) {
      if (error.code !== 'ResourceAlreadyExistsException') {
        console.error('Error creating log stream:', error);
      }
    }

    // Put log event
    await cloudWatchLogs.putLogEvents({
      logGroupName: LOG_GROUP,
      logStreamName: LOG_STREAM,
      logEvents: [
        {
          message: typeof message === 'string' ? message : JSON.stringify(message),
          timestamp: Date.now()
        }
      ]
    }).promise();
  } catch (error) {
    console.error('Error logging to CloudWatch:', error);
  }
}

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
  
  // Log headers to CloudWatch
  logToCloudWatch({
    type: 'REQUEST_HEADERS',
    method: req.method,
    url: req.url,
    headers: req.headers,
    timestamp: new Date().toISOString()
  });

  // Specifically log workspace headers
  const workspaceId = req.headers['x-workspace-id'];
  const amzWorkspaceId = req.headers['x-amz-workspace-id'];
  
  if (workspaceId || amzWorkspaceId) {
    console.log('x-workspace-id:', workspaceId || 'NOT FOUND');
    console.log('x-amz-workspace-id:', amzWorkspaceId || 'NOT FOUND');
    
    logToCloudWatch({
      type: 'WORKSPACE_HEADERS',
      workspaceId: workspaceId || 'NOT FOUND',
      amzWorkspaceId: amzWorkspaceId || 'NOT FOUND',
      timestamp: new Date().toISOString()
    });
  } else {
    console.log('No workspace headers found');
    logToCloudWatch({
      type: 'WORKSPACE_HEADERS_MISSING',
      timestamp: new Date().toISOString()
    });
  }
  
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
  logToCloudWatch({
    type: 'SERVER_START',
    message: `Server started on port ${PORT}`,
    timestamp: new Date().toISOString()
  });
  console.log('Logging all raw request headers to console');
});
