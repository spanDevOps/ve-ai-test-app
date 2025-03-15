import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WorkspaceProvider, useWorkspace } from './contexts/WorkspaceContext';
import './App.css';

// Workspace layout component that checks for valid workspace
function WorkspaceLayout({ children }) {
  const { workspaceId } = useWorkspace();
  
  if (!workspaceId) {
    return (
      <div className="error-page">
        <h1>Invalid Workspace</h1>
        <p>Please check your URL and try again.</p>
      </div>
    );
  }

  return (
    <div className="workspace-layout">
      {/* Add a badge to show workspace type */}
      <div className="workspace-badge">
        {window.location.hostname.endsWith('devopsify.shop') ? 'Custom Domain' : 'Development'}
      </div>
      {children}
    </div>
  );
}

// Main dashboard component
function Dashboard() {
  const { workspaceId } = useWorkspace();
  
  return (
    <div className="dashboard">
      <h1>Welcome to Workspace: {workspaceId}</h1>
      <p>This is your VE.AI workspace dashboard</p>
      <div className="workspace-info">
        <p>Domain: {window.location.hostname}</p>
        <p>Path: {window.location.pathname}</p>
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
          {/* Redirect root to 404 since all valid paths must include workspace */}
          <Route path="/" element={<Navigate to="/404" />} />
          
          {/* Handle workspace paths */}
          <Route path="/:workspaceId/*" element={
            <WorkspaceLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="*" element={<Navigate to="dashboard" />} />
              </Routes>
            </WorkspaceLayout>
          } />

          {/* 404 page */}
          <Route path="/404" element={
            <div className="error-page">
              <h1>404 - Not Found</h1>
              <p>The page you're looking for doesn't exist.</p>
            </div>
          } />
        </Routes>
      </WorkspaceProvider>
    </Router>
  );
}

export default App;
