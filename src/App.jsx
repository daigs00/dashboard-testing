// App.jsx with cleaner structure
import { useState } from 'react';
import { useProSidebar } from "react-pro-sidebar";
import SidebarComponent from './components/sidebar.jsx';
import './App.css';

function App() {
  const { collapseSidebar } = useProSidebar();
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
    collapseSidebar();
  };

  return (
    <div className="app">
      <SidebarComponent 
        collapsed={collapsed} 
        toggleSidebar={toggleSidebar} 
      />
      <main>
        <h1 style= {{color: "white", marginLeft: "8rem"}}>Dashboard</h1>

      </main>
    </div>
  );
}

export default App;
