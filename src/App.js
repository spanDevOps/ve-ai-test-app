import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [workspaceInfo, setWorkspaceInfo] = useState({
    id: process.env.REACT_APP_WORKSPACE_ID || 'default',
    domain: window.location.hostname,
    timestamp: new Date().toISOString()
  });

  return (
    <div className="app-container">
      <header>
        <h1>VE.AI Test Workspace</h1>
      </header>
      
      <main>
        <div className="info-card">
          <h2>Workspace Information</h2>
          <div className="info-item">
            <label>Workspace ID:</label>
            <span>{workspaceInfo.id}</span>
          </div>
          <div className="info-item">
            <label>Domain:</label>
            <span>{workspaceInfo.domain}</span>
          </div>
          <div className="info-item">
            <label>Timestamp:</label>
            <span>{workspaceInfo.timestamp}</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
