import React, { createContext, useContext } from 'react';

const WorkspaceContext = createContext();

export function WorkspaceProvider({ children }) {
  // Extract workspace ID from path (set by Lambda@Edge)
  const pathParts = window.location.pathname.split('/');
  const workspaceId = pathParts[1]?.startsWith('workspace-') ? pathParts[1] : null;

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
