import React, { createContext, useContext, useEffect } from 'react';

const WorkspaceContext = createContext();

export function WorkspaceProvider({ children }) {
  // Extract workspace ID from path (set by Lambda@Edge)
  const pathParts = window.location.pathname.split('/');
  const workspaceId = pathParts.find(part => part.startsWith('workspace-')) || 'workspace-1';

  useEffect(() => {
    console.log('Current path:', window.location.pathname);
    console.log('Path parts:', pathParts);
    console.log('Selected workspace:', workspaceId);
  }, [pathParts, workspaceId]);

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
