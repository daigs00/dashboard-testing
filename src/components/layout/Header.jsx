import React, { useState } from 'react';
import { MenuIcon, Search, Bell, User, Settings, LogOut, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = ({ setSidebarOpen }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { user, logout } = useAuth();
  
  return (
    <header className="sticky top-0 z-20 flex-shrink-0 flex h-16 bg-gray-900 bg-opacity-40 backdrop-filter backdrop-blur-lg border-b border-gray-800 shadow-glass-sm">
      <div className="flex-1 px-4 flex justify-between">
        <div className="flex-1 flex items-center">
          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden px-2.5 text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </button>
          
          {/* Search bar */}
          <div className="max-w-lg w-full lg:max-w-xs ml-2 lg:ml-0">
            <label htmlFor="search" className="sr-only">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                id="search"
                name="search"
                className="block w-full pl-10 pr-3 py-2 rounded-lg text-sm bg-gray-800 bg-opacity-50 border border-gray-700 placeholder-gray-400 text-gray-200 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Search sensors, metrics..."
                type="search"
              />
            </div>
          </div>
        </div>
        
        <div className="ml-4 flex items-center md:ml-6 space-x-1">
          {/* Help button */}
          <button
            type="button"
            className="p-1.5 rounded-full text-gray-300 hover:text-white hover:bg-gray-800 hover:bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <span className="sr-only">View help</span>
            <HelpCircle className="h-5 w-5" />
          </button>
          
          {/* Notifications dropdown */}
          <div className="relative">
            <button
              type="button"
              className="p-1.5 rounded-full text-gray-300 hover:text-white hover:bg-gray-800 hover:bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                if (profileOpen) setProfileOpen(false);
              }}
            >
              <span className="sr-only">View notifications</span>
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-secondary-500 ring-2 ring-gray-900"></span>
            </button>
            
            {/* Notifications dropdown */}
            {notificationsOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-lg shadow-glass bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg border border-gray-800 focus:outline-none text-white">
                <div className="py-2 px-3 border-b border-gray-800">
                  <h3 className="text-sm font-medium">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto py-1">
                  <div className="px-3 py-2 hover:bg-gray-800 hover:bg-opacity-50 cursor-pointer border-l-4 border-warning-500">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Power consumption alert</p>
                      <span className="text-xs text-gray-400">5m ago</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Power consumption exceeded threshold (5.4kW)</p>
                  </div>
                  <div className="px-3 py-2 hover:bg-gray-800 hover:bg-opacity-50 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">System update available</p>
                      <span className="text-xs text-gray-400">1h ago</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">A new system update is available for installation</p>
                  </div>
                  <div className="px-3 py-2 hover:bg-gray-800 hover:bg-opacity-50 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Sensor offline</p>
                      <span className="text-xs text-gray-400">2h ago</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Temperature sensor in Server Room is offline</p>
                  </div>
                </div>
                <div className="py-1 border-t border-gray-800">
                  <Link to="/notifications" className="block px-3 py-2 text-xs font-medium text-primary-400 hover:bg-gray-800 hover:bg-opacity-50">
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          {/* Profile dropdown */}
          <div className="relative ml-2">
            <div>
              <button
                className="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  if (notificationsOpen) setNotificationsOpen(false);
                }}
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full flex items-center justify-center bg-gradient-to-br from-secondary-600 to-primary-600 text-white">
                  <span className="font-medium text-sm">{user?.name?.charAt(0) || 'U'}</span>
                </div>
              </button>
            </div>
            
            {profileOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-lg shadow-glass bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg border border-gray-800 focus:outline-none text-white">
                <div className="py-3 px-4 border-b border-gray-800">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-secondary-600 to-primary-600 flex items-center justify-center text-white">
                      <span className="font-medium">{user?.name?.charAt(0) || 'U'}</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">{user?.name || 'User'}</p>
                      <p className="text-xs text-gray-400">{user?.email || 'user@example.com'}</p>
                    </div>
                  </div>
                </div>
                <div className="py-1">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:bg-opacity-50 hover:text-white"
                    onClick={() => setProfileOpen(false)}
                  >
                    <User className="mr-3 h-4 w-4 text-gray-400" />
                    Your Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:bg-opacity-50 hover:text-white"
                    onClick={() => setProfileOpen(false)}
                  >
                    <Settings className="mr-3 h-4 w-4 text-gray-400" />
                    Settings
                  </Link>
                </div>
                <div className="py-1 border-t border-gray-800">
                  <button
                    onClick={() => {
                      logout();
                      setProfileOpen(false);
                    }}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:bg-opacity-50 hover:text-white"
                  >
                    <LogOut className="mr-3 h-4 w-4 text-gray-400" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
