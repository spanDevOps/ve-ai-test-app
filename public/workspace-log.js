// Simple script to log workspace ID information to the console
console.log('Workspace ID Logging Script - Starting...');

// Log current page info
console.log('Page URL:', window.location.href);
console.log('Host:', window.location.host);

// Function to fetch workspace info from API with explicit header logging
async function checkWorkspaceHeader() {
  try {
    console.log('Making request to test endpoint...');
    
    // Add cache-busting parameter
    const timestamp = new Date().getTime();
    
    // Make a request
    const response = await fetch(`/api/workspace-info?_=${timestamp}`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    console.log('Response status:', response.status);
    
    // Log all response headers with special attention to workspace headers
    console.log('--- RESPONSE HEADERS ---');
    let foundWorkspaceHeader = false;
    response.headers.forEach((value, name) => {
      console.log(`${name}: ${value}`);
      
      // Check for any workspace-related headers (case insensitive)
      const lowerName = name.toLowerCase();
      if (lowerName.includes('workspace') || lowerName.includes('x-amz')) {
        console.log(` FOUND SPECIAL HEADER: ${name}: ${value}`);
        foundWorkspaceHeader = true;
      }
    });
    
    if (!foundWorkspaceHeader) {
      console.log(' No workspace-related headers found in the response');
    }
    
    // Log document cookies
    console.log('--- COOKIES ---');
    console.log(document.cookie);
    
    // Try to find workspace information in cookies
    const cookies = document.cookie.split(';').map(c => c.trim());
    const workspaceCookie = cookies.find(c => 
      c.toLowerCase().startsWith('x_workspace_id=') || 
      c.toLowerCase().startsWith('x-workspace-id=') ||
      c.toLowerCase().includes('workspace')
    );
    
    if (workspaceCookie) {
      console.log(` FOUND WORKSPACE COOKIE: ${workspaceCookie}`);
    } else {
      console.log(' No workspace-related cookie found');
    }

  } catch (error) {
    console.error('Error fetching workspace info:', error);
  }
}

// Run the checks
checkWorkspaceHeader();

console.log('Workspace ID Logging Script - Completed initialization');
