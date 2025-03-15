import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const WorkspaceContext = createContext();

export function useWorkspace() {
  return useContext(WorkspaceContext);
}

export function WorkspaceProvider({ children }) {
  const [workspaceId, setWorkspaceId] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Extract workspace ID from path: /workspace-1/path -> workspace-1
    const path = location.pathname;
    const match = path.match(/^\/([^/]+)/);
    if (match && match[1].startsWith('workspace-')) {
      setWorkspaceId(match[1]);
    }
  }, [location]);

  return (
    <WorkspaceContext.Provider value={{ workspaceId, setWorkspaceId }}>
      {children}
    </WorkspaceContext.Provider>
  );
}
