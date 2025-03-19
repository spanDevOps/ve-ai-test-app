// Simple script to log workspace ID information to the console
console.log('Workspace ID Logging Script - Starting...');

// Function to fetch workspace info from API
async function getWorkspaceInfo() {
  try {
    console.log('Fetching workspace info...');
    
    // Add cache-busting parameter
    const timestamp = new Date().getTime();
    
    // Make the request to the workspace info API
    const response = await fetch(`/api/workspace-info?_=${timestamp}`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    console.log('API response status:', response.status);
    
    // Log all response headers
    console.log('API response headers:');
    const allHeaders = {};
    response.headers.forEach((value, name) => {
      console.log(`${name}: ${value}`);
      allHeaders[name] = value;
    });
    
    // Try to parse the response as JSON
    try {
      const data = await response.json();
      console.log('API response data:', data);
    } catch (jsonError) {
      console.log('Could not parse response as JSON, showing raw text:');
      const text = await response.text();
      console.log(text.substring(0, 500) + '...');
    }
  } catch (error) {
    console.error('Error fetching workspace info:', error);
  }
}

// Log current page info
console.log('Page URL:', window.location.href);
console.log('Host:', window.location.host);

// Run the fetch
getWorkspaceInfo();

// Also log document cookies
console.log('Document cookies:', document.cookie);

// Log request headers using fetch to test endpoint
fetch('/api/workspace-info')
  .then(response => {
    console.log('Request made to test endpoint');
  })
  .catch(e => console.error('Error making test request:', e));

console.log('Workspace ID Logging Script - Completed initialization');
