import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WorkspaceProvider, useWorkspace } from './contexts/WorkspaceContext';
import './App.css';

// Main dashboard component
function Dashboard() {
  const { workspaceId } = useWorkspace();
  
  if (!workspaceId) {
    return (
      <div className="error-page">
        <h1>404 - Not Found</h1>
        <p>Invalid workspace configuration</p>
      </div>
    );
  }

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
  return (
    <Router>
      <WorkspaceProvider>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </WorkspaceProvider>
    </Router>
  );
}

export default App;
