import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WorkspaceProvider, useWorkspace } from './contexts/WorkspaceContext';
import './App.css';

// Workspace layout component that checks for valid workspace
function WorkspaceLayout({ children }) {
  const { workspaceId } = useWorkspace();
  
  if (!workspaceId) {
    return <div>Invalid workspace path</div>;
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
    </div>
  );
}

// Root component that sets up routing
function App() {
  return (
    <Router>
      <WorkspaceProvider>
        <Routes>
          {/* Redirect root to 404 since all valid paths must have workspace ID */}
          <Route path="/" element={<Navigate to="/404" replace />} />
          
          {/* Workspace routes */}
          <Route path="/:workspaceId/*" element={
            <WorkspaceLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                {/* Add more workspace-specific routes here */}
              </Routes>
            </WorkspaceLayout>
          } />

          {/* 404 route */}
          <Route path="/404" element={
            <div className="error-page">
              <h1>404 - Not Found</h1>
              <p>Please check your workspace URL</p>
            </div>
          } />
        </Routes>
      </WorkspaceProvider>
    </Router>
  );
}

export default App;
