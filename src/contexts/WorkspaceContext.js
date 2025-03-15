import React, { createContext, useContext } from 'react';

const WorkspaceContext = createContext();

export function WorkspaceProvider({ children }) {
  let workspaceId = null;
  const pathname = window.location.pathname;

  // Extract workspace ID from path (added by Lambda@Edge)
  const match = pathname.match(/^\/workspace-([^/]+)/);
  if (match) {
    workspaceId = `workspace-${match[1]}`;
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
