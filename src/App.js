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
        <h1>Invalid Workspace Path</h1>
        <p>Please check your URL and try again.</p>
      </div>
    );
  }

  return (
    <div className="workspace-layout">
      <div className="workspace-badge">Custom Domain</div>
      {children}
    </div>
  );
}

// Main dashboard component
function Dashboard() {
  const { workspaceId } = useWorkspace();
  
  return (
    <div className="dashboard">
      <h1>Welcome to {workspaceId}</h1>
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
          {/* Handle workspace paths from Lambda@Edge */}
          <Route path="/workspace-:id/*" element={
            <WorkspaceLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="*" element={<Navigate to="dashboard" />} />
              </Routes>
            </WorkspaceLayout>
          } />

          {/* Redirect invalid paths to error page */}
          <Route path="*" element={
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
