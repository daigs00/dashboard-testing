import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  
  // Preload background image
  useEffect(() => {
    const img = new Image();
    img.src = '/bg-gradient.jpg';
    img.onload = () => setBackgroundLoaded(true);
  }, []);
  
  return (
    <div className="min-h-screen flex overflow-hidden bg-gray-900">
      {/* Background gradient overlay */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700"
        style={{ 
          backgroundImage: `url('/bg-gradient.jpg')`,
          opacity: backgroundLoaded ? 1 : 0,
        }}
      ></div>
      
      {/* Content wrapper with glass effect */}
      <div className="relative flex w-full z-10">
        {/* Sidebar */}
        <Sidebar 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
        />
        
        {/* Main Content */}
        <div className="flex flex-col flex-1 w-0 overflow-hidden">
          <Header setSidebarOpen={setSidebarOpen} />
          
          <main className="relative flex-1 overflow-y-auto focus:outline-none">
            <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              {/* Page content */}
              <Outlet />
            </div>
          </main>

          {/* Footer */}
          <footer className="bg-gray-900 bg-opacity-30 backdrop-filter backdrop-blur-lg border-t border-gray-800 py-3 px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-300">
            <p>Sensor Dashboard © {new Date().getFullYear()}</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
