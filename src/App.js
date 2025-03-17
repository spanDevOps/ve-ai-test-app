import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WorkspaceProvider, useWorkspace } from './contexts/WorkspaceContext';
import './App.css';

// Main dashboard component
function Dashboard() {
  const { workspaceId } = useWorkspace();
  
  useEffect(() => {
    console.log('Dashboard mounted');
    console.log('Current workspace:', workspaceId);
    console.log('Full URL:', window.location.href);
    console.log('Current path:', window.location.pathname);
  }, [workspaceId]);

  if (!workspaceId) {
    console.log('No workspace ID found');
    return (
      <div className="error-page">
        <h1>404 - Not Found</h1>
        <p>Invalid workspace configuration</p>
      </div>
    );
  }

  console.log('Rendering dashboard for workspace:', workspaceId);
  return (
    <div className="workspace-layout">
      <div className="workspace-badge">Custom Domain</div>
      <div className="dashboard">
        <h1>Welcome to {workspaceId}</h1>
        <p>This is your VE.AI workspace dashboard</p>
      </div>
    </div>
  );
}

// Root component that sets up routing
function App() {
  useEffect(() => {
    console.log('App mounted');
    console.log('Initial URL:', window.location.href);
    console.log('Initial path:', window.location.pathname);
  }, []);

  return (
    <Router>
      <WorkspaceProvider>
        <Routes>
          <Route path="/*" element={<Dashboard />} />
        </Routes>
      </WorkspaceProvider>
    </Router>
  );
}

export default App;
