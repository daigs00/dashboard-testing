import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AlertCircle } from 'lucide-react';

/**
 * Login Page Component
 * 
 * Provides the authentication entry point for the application:
 * - Email and password login form
 * - Form validation and error handling
 * - "Remember me" option
 * - Password recovery link
 * - Registration link for new users
 * - Automatic redirect for already authenticated users
 * 
 * The component integrates with the AuthContext to manage
 * authentication state across the application.
 */
const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  
  // Preload background image to avoid flash of unstyled content
  // Creates smooth fade-in effect when the page loads
  useEffect(() => {
    const img = new Image();
    img.src = '/bg-gradient.jpg';
    img.onload = () => setBackgroundLoaded(true);
  }, []);
  
  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  // Handle form submission
  // Validates inputs and attempts login via the auth context
  // Displays appropriate error messages on failure
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    if (!email || !password) {
      setError('Please enter both email and password');
      setIsLoading(false);
      return;
    }
    
    const result = await login(email, password);
    
    if (!result.success) {
      setError(result.error || 'Invalid email or password');
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col justify-center sm:px-6 lg:px-8 relative">
      {/* Background gradient overlay - provides visual backdrop for the login form */}
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
            Server Room Monitor
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Sign in to monitor your server room
          </p>
        </div>
        
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          {/* Login form card with glass effect styling */}
          <div className="bg-gray-900 bg-opacity-60 backdrop-filter backdrop-blur-lg py-8 px-6 shadow-glass sm:rounded-xl border border-gray-800">
            {error && (
              <div className="bg-danger-900 bg-opacity-50 border-l-4 border-danger-500 p-4 mb-6 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-danger-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-danger-200">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email input field with label and validation */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email address
                </label>
                <div className="mt-1">
                  {/* Email input with appropriate styling and validation */}
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-lg shadow-sm bg-gray-800 bg-opacity-50 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className="mt-1">
                  {/* Password input with appropriate styling and validation */}
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-lg shadow-sm bg-gray-800 bg-opacity-50 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter your password"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {/* Remember me checkbox option */}
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-700 rounded bg-gray-800"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                    Remember me
                  </label>
                </div>
                
                <div className="text-sm">
                  {/* Forgot password link */}
                  <Link to="/forgot-password" className="font-medium text-primary-400 hover:text-primary-300">
                    Forgot your password?
                  </Link>
                </div>
              </div>
              
              <div>
                {/* Submit button with loading state handling */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-secondary-600 to-primary-600 hover:from-secondary-500 hover:to-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70"
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  {/* Divider line with "Or" text */}
                  <div className="w-full border-t border-gray-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-900 bg-opacity-60 text-gray-400">Or</span>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-400">
                  Don't have an account?{' '}
                  {/* Registration link for new users */}
                  <Link to="/register" className="font-medium text-primary-400 hover:text-primary-300">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
