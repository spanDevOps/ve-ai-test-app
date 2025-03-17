import React from 'react';
import './App.css';

function App() {
  const [workspaceId, setWorkspaceId] = React.useState(null);

  React.useEffect(() => {
    // Extract workspace ID from path or use default
    const path = window.location.pathname;
    const match = path.match(/workspace-(\d+)/);
    const id = match ? match[1] : '1';
    setWorkspaceId(id);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Workspace {workspaceId}</h1>
        <p>You are viewing workspace-{workspaceId}</p>
      </header>
    </div>
  );
}

export default App;
