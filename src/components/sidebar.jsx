// Sidebar.jsx
import { MenuItem, Menu, Sidebar } from "react-pro-sidebar";
import { MenuOpen, Home, Cloud, LockOpen, History } from '@mui/icons-material';
import "./Sidebar.css";

function SidebarComponent({ collapsed, toggleSidebar }) {
  return (
    <Sidebar className="sidebar" collapsed={collapsed}>
      <Menu>
        <MenuItem 
          icon={<MenuOpen />}
          onClick={toggleSidebar}
          className="menu-header"
        >
          <h2>Admin</h2>
        </MenuItem>
        <MenuItem icon={<Home />}>Home</MenuItem>
        <MenuItem icon={<Cloud />}>Environment</MenuItem>
        <MenuItem icon={<LockOpen />}>Access</MenuItem>
        <MenuItem icon={<History />}>History</MenuItem>
      </Menu>
    </Sidebar>
  );
}

export default SidebarComponent;
