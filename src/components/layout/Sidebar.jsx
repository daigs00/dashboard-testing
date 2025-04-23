import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  BarChart2, 
  Users, 
  Settings, 
  AlertTriangle, 
  Database, 
  X, 
  ChevronDown, 
  ChevronRight,
  Thermometer,
  Droplet,
  Wind,
  Shield
} from 'lucide-react';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const [analyticsOpen, setAnalyticsOpen] = useState(
    location.pathname.includes('/analytics')
  );
  
  // Navigation items - now with nested items for Analytics
  const navigation = [
    { name: 'Dashboard', icon: Home, href: '/' },
    { 
      name: 'Analytics', 
      icon: BarChart2, 
      href: '/analytics',
      hasChildren: true,
      children: [
        { name: 'Temperature', icon: Thermometer, href: '/analytics/temperature' },
        { name: 'Humidity', icon: Droplet, href: '/analytics/humidity' },
        { name: 'Air Quality', icon: Wind, href: '/analytics/air-quality' },
        { name: 'Access Control', icon: Shield, href: '/analytics/access-control' },
      ]
    },
    { name: 'User Management', icon: Users, href: '/users' },
    { name: 'Settings', icon: Settings, href: '/settings' },
  ];
  
  // Check if a menu item is active (including checking if any child is active)
  const isItemActive = (item) => {
    if (location.pathname === item.href) return true;
    if (item.hasChildren && item.children) {
      return item.children.some(child => location.pathname === child.href);
    }
    return false;
  };
  
  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-40 lg:hidden bg-gray-900 bg-opacity-75 transition-opacity ease-linear duration-300 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
        onClick={() => setSidebarOpen(false)}
      />
      
      {/* Sidebar component for desktop and mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform ease-in-out duration-300 lg:translate-x-0 lg:static lg:h-full flex-shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col bg-gray-900 bg-opacity-40 backdrop-filter backdrop-blur-lg border-r border-gray-800 shadow-glass text-white">
          {/* Close button for mobile */}
          <div className="absolute top-0 right-0 -mr-12 pt-2 lg:hidden">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center justify-between px-4 h-16 border-b border-gray-800">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-md bg-gradient-to-br from-secondary-500 to-primary-500 flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-secondary-400 to-primary-400">
                Sensor Hub
              </span>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="mt-5 flex-1 h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            <nav className="px-2 space-y-1">
              {navigation.map((item) => 
                item.hasChildren ? (
                  <div key={item.name}>
                    {/* Parent menu with dropdown */}
                    <button
                      className={`group w-full flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                        isItemActive(item)
                          ? 'bg-primary-900 bg-opacity-80 text-primary-200'
                          : 'text-gray-300 hover:bg-gray-800 hover:bg-opacity-40 hover:text-white'
                      }`}
                      onClick={() => setAnalyticsOpen(!analyticsOpen)}
                    >
                      <item.icon
                        className="mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-150"
                        aria-hidden="true"
                      />
                      <span className="flex-1 text-left">{item.name}</span>
                      {analyticsOpen ? (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                    
                    {/* Dropdown children */}
                    {analyticsOpen && (
                      <div className="mt-1 space-y-1 pl-3">
                        {item.children.map((child) => (
                          <NavLink
                            key={child.name}
                            to={child.href}
                            className={({ isActive }) =>
                              `group flex items-center pl-8 pr-2 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                                isActive
                                  ? 'bg-primary-900 bg-opacity-60 text-primary-200'
                                  : 'text-gray-400 hover:bg-gray-800 hover:bg-opacity-30 hover:text-white'
                              }`
                            }
                            onClick={() => {
                              if (window.innerWidth < 1024) {
                                setSidebarOpen(false);
                              }
                            }}
                          >
                            <child.icon
                              className="mr-3 flex-shrink-0 h-4 w-4 transition-colors duration-150"
                              aria-hidden="true"
                            />
                            <span>{child.name}</span>
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `group flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                        isActive
                          ? 'bg-primary-900 bg-opacity-80 text-primary-200'
                          : 'text-gray-300 hover:bg-gray-800 hover:bg-opacity-40 hover:text-white'
                      }`
                    }
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        setSidebarOpen(false);
                      }
                    }}
                  >
                    <item.icon
                      className="mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-150"
                      aria-hidden="true"
                    />
                    <span className="hidden md:hidden lg:inline">{item.name}</span>
                    <span className="inline lg:hidden md:inline">{item.name}</span>
                  </NavLink>
                )
              )}
            </nav>
          </div>
          
          {/* User info at bottom */}
          <div className="flex-shrink-0 flex border-t border-gray-800 p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-secondary-600 to-primary-600 flex items-center justify-center text-white">
                  <span className="text-sm font-medium">JD</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">John Doe</p>
                  <p className="text-xs font-medium text-gray-400 group-hover:text-gray-300">View profile</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
