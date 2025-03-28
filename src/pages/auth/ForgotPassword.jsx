import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Forgot Password Page Component
 * 
 * Allows users to initiate password recovery:
 * - Collects user email address
 * - Sends password reset instructions
 * - Provides feedback on submission
 * - Links back to login page
 * 
 * Currently implemented as a stub component with minimal
 * functionality. Will be fully implemented in future iterations.
 */
const ForgotPassword = () => {
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  
  // Preload background image
  useEffect(() => {
    const img = new Image();
    img.src = '/bg-gradient.jpg';
    img.onload = () => setBackgroundLoaded(true);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col justify-center sm:px-6 lg:px-8 relative">
      {/* Background gradient overlay */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700"
        style={{ 
          backgroundImage: `url('/bg-gradient.jpg')`,
          opacity: backgroundLoaded ? 1 : 0,
        }}
      ></div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-secondary-600 to-primary-600 shadow-lg mb-4">
            <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="mt-2 text-3xl font-extrabold text-white">
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Or{' '}
            <Link to="/login" className="font-medium text-primary-400 hover:text-primary-300">
              return to sign in
            </Link>
          </p>
        </div>
        
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-gray-900 bg-opacity-60 backdrop-filter backdrop-blur-lg py-8 px-6 shadow-glass sm:rounded-xl border border-gray-800">
            <div className="bg-gray-800 bg-opacity-50 border-l-4 border-primary-500 p-4 mb-6 rounded-md">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-gray-300">
                    This is a stub component. Password reset functionality will be implemented in the future.
                  </p>
                </div>
              </div>
            </div>
            
            <form className="mt-8 space-y-6">
              {/* Form fields would go here */}
              <div>
                <Link to="/login">
                  <button
                    type="button"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-secondary-600 to-primary-600 hover:from-secondary-500 hover:to-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Back to Login
                  </button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
