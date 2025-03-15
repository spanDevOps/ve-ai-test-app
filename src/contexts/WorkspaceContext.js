import React, { createContext, useContext } from 'react';

const WorkspaceContext = createContext();

export function WorkspaceProvider({ children }) {
  let workspaceId = null;
  const pathname = window.location.pathname;

  // Extract workspace ID from path for both domain types
  if (pathname.startsWith('/workspace-')) {
    // Path-based routing: /workspace-1/dashboard
    workspaceId = pathname.split('/')[1];
  } else if (window.location.hostname.endsWith('ve.ai')) {
    // VE.AI domain: workspace-1.ve.ai
    workspaceId = window.location.hostname.split('.')[0];
  }

  return (
    <WorkspaceContext.Provider value={{ workspaceId }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
