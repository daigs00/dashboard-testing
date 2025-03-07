import { useState } from 'react'
import { Sidebar, Menu, MenuItem, useProSidebar } from "react-pro-sidebar";
import "@fontsource/jetbrains-mono";
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import CloudIcon from '@mui/icons-material/Cloud';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import HistoryIcon from '@mui/icons-material/History';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import HomeIcon from '@mui/icons-material/Home';
import './App.css'

function App() {
  const { collapseSidebar } = useProSidebar();
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
    collapseSidebar();
  };

  return (
    <div className="app-container">
      <Sidebar className="sidebar" collapsed={collapsed}>
        <Menu>
          <MenuItem
            icon={<MenuOpenIcon />}
            onClick={toggleSidebar}
            className="menu-header"
          >
            <h2>Admin</h2>
          </MenuItem>
          <MenuItem icon={<HomeIcon/>}>Home</MenuItem> 
          <MenuItem icon={<CloudIcon />}>Environment</MenuItem>
          <MenuItem icon={<LockOpenIcon />}>Access</MenuItem>
          <MenuItem icon={<HistoryIcon />}>History</MenuItem>
        </Menu>
      </Sidebar>

      <div className="main-content">
        <header className="dashboard-header">
          <h1>Dashboard</h1>
        </header>
        <div className="dashboard-content">
          {/* Your dashboard content goes here */}
          <p>Welcome to your dashboard</p>
        </div>
      </div>
    </div>
  );
}

export default App;
