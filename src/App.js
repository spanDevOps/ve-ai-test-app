import React, { useState, useEffect } from 'react';
import './App.css';

// Simulated DynamoDB mappings for local testing
const TEST_DOMAIN_MAPPINGS = {
  'gallery.devopsify.shop': 'workspace-1',
  'photos.devopsify.shop': 'workspace-2',
  'studio.devopsify.shop': 'workspace-3'
};

function App() {
  // Function to determine if this is a custom domain
  const isCustomDomain = () => {
    const hostname = window.location.hostname;
    return hostname.endsWith('devopsify.shop');
  };

  // Function to get workspace info based on domain
  const getWorkspaceInfo = () => {
    const hostname = window.location.hostname;
    let workspaceId;
    let domainType;
    
    if (isCustomDomain()) {
      // Custom domain format: {subdomain}.devopsify.shop
      workspaceId = TEST_DOMAIN_MAPPINGS[hostname] || 'unknown';
      domainType = 'custom';
    } else if (hostname === 'localhost') {
      // For local development, use URL hash to simulate different workspaces
      // e.g., localhost:3000/#workspace-1
      workspaceId = window.location.hash.slice(1) || 'workspace-1';
      domainType = 'development';
    } else {
      // Amplify domain format: {workspace-id}.abc123.amplifyapp.com
      const subdomain = hostname.split('.')[0];
      workspaceId = subdomain;
      domainType = 'development';
    }
    
    return {
      id: workspaceId,
      currentDomain: hostname,
      domainType
    };
  };

  const [workspaceInfo, setWorkspaceInfo] = useState(getWorkspaceInfo());

  // Update workspace info when hash changes (for local development)
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hostname === 'localhost') {
        setWorkspaceInfo(getWorkspaceInfo());
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="app-container">
      <header>
        <h1>Workspace Preview</h1>
        <div className="domain-badges">
          {workspaceInfo.domainType === 'custom' && (
            <div className="badge custom">Custom Domain</div>
          )}
          {workspaceInfo.domainType === 'development' && (
            <div className="badge development">Development</div>
          )}
        </div>
      </header>
      
      <main>
        <div className="info-card">
          <h2>Current Workspace</h2>
          <div className="workspace-id">
            <span className="label">Workspace ID:</span>
            <span className="value">{workspaceInfo.id}</span>
          </div>
          <div className="domain-info">
            <div className="current-domain">
              <span className="label">Accessing via:</span>
              <span className="value">{workspaceInfo.currentDomain}</span>
            </div>
          </div>
        </div>
        
        <div className="info-card">
          <h2>Test Domain Mappings</h2>
          <div className="test-instructions">
            <p>To test different workspaces:</p>
            <div className="url-examples">
              <h3>1. Development (Amplify) Domain</h3>
              <p>The workspace ID comes from the subdomain:</p>
              <ul>
                <li>
                  <code>workspace-1.abc123.amplifyapp.com</code>
                  <span className="note">Maps to workspace-1</span>
                </li>
                <li>
                  <code>workspace-2.abc123.amplifyapp.com</code>
                  <span className="note">Maps to workspace-2</span>
                </li>
              </ul>

              {window.location.hostname === 'localhost' && (
                <>
                  <h3>Local Development Testing</h3>
                  <p>Use URL hash to simulate different workspaces:</p>
                  <ul>
                    <li>
                      <code>localhost:3000/#workspace-1</code>
                      <span className="note">Simulates workspace-1</span>
                    </li>
                    <li>
                      <code>localhost:3000/#workspace-2</code>
                      <span className="note">Simulates workspace-2</span>
                    </li>
                  </ul>
                </>
              )}

              <h3>2. Custom Domain Mappings</h3>
              <table className="domain-mappings">
                <thead>
                  <tr>
                    <th>Custom Domain</th>
                    <th>Maps to Workspace</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(TEST_DOMAIN_MAPPINGS).map(([domain, workspace]) => (
                    <tr key={domain}>
                      <td>{domain}</td>
                      <td>{workspace}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
