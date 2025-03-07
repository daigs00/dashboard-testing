import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Sidebar, Menu, MenuItem, SubMenu, useProSidebar } from "react-pro-sidebar";
import "@fontsource/jetbrains-mono";// Specify weight and <style>
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import CloudIcon from '@mui/icons-material/Cloud';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import HistoryIcon from '@mui/icons-material/History';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import HomeIcon from '@mui/icons-material/Home';
function App() {
  const { collapseSidebar, toggleSidebar, collapsed, toggled, broken, rtl } =
    useProSidebar();
  const toggle = () => {
    toggleSidebar();
    if (toggled) {
      console.log(true);
      collapseSidebar();
    } else {
      console.log(false);
      collapseSidebar();
    }
  };
  return (
    <div id="app" style={({ height: "100vh" }, {display: "flex", flexDirection: "row"})}>
      <Sidebar style={{ height: "100vh", image: "./assets/frostfire.jpeg", backgroundColor: '00FFFFFF'}}>
          <Menu>
            <MenuItem
              icon={<MenuOpenIcon />}
              onClick={() => {
                collapseSidebar();
              }}
              style = {{ textAlign: "center"}}
            >
              {" "}
              <h2>Admin</h2>
            </MenuItem>
            <MenuItem icon={<HomeIcon/>}>Home</MenuItem> 
            <MenuItem icon={<CloudIcon />}>Environment</MenuItem>
            <MenuItem icon={<LockOpenIcon />}>Access</MenuItem>
            <MenuItem icon={<HistoryIcon />}>History</MenuItem>
            
            </Menu>
      </Sidebar>

      
      <main>
            <h1
          onClick={() => {
            toggle();
          }}
          style={{ color: "white", marginLeft: "5rem" }}
        >
          React-Pro-Sidebar
        </h1>
        {toggled ? (
          <h1 style={{ color: "white", marginLeft: "5rem" }}>Toggled</h1>
        ) : (
          <h1 style={{ color: "white", marginLeft: "5rem" }}>Not Toggled</h1>
        )}
      </main>

    </div>
          );
}

export default App
