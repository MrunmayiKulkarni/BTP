import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

  // Debug: Log authentication state changes
  useEffect(() => {
    console.log('🔍 Auth state changed:', { isAuthenticated, user: !!user });
  }, [isAuthenticated, user]);

  // Only redirect if we have both authentication flags
  if (isAuthenticated && user) {
    console.log('✅ User is authenticated, redirecting to /home');
    return <Navigate to="/home" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);
    
    console.log('🚀 Starting login process...');

    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('📡 Login API response:', { status: response.status, data });

      if (!response.ok) {
        throw new Error(data.message || 'Failed to login');
      }

      console.log('🔑 Calling login function with token...');
      
      // Call the login function and wait for it to complete
      await login(data.token);
      
      console.log('✅ Login function completed');
      
      // Check auth state after login
      setTimeout(() => {
        console.log('🔍 Auth state after login:', { isAuthenticated, user: !!user });
      }, 100);
      
      // Manual navigation as backup
      console.log('🧭 Manually navigating to /home');
      navigate('/home', { replace: true });
      
    } catch (err) {
      console.error('❌ Login error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  console.log('🔄 LoginPage render - Auth state:', { isAuthenticated, user: !!user });

  return (
    <div 
      className="relative min-h-screen flex items-center justify-center p-6 bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1975&auto=format&fit=crop')" }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div className="relative z-10 w-full max-w-md p-8 space-y-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
        <h2 className="text-3xl font-bold text-center text-white">Login</h2>
        
        {/* Debug info - remove this in production */}
        <div className="text-xs text-yellow-300 bg-yellow-900/20 p-2 rounded">
          Debug: isAuth={isAuthenticated ? 'true' : 'false'}, hasUser={user ? 'true' : 'false'}
        </div>
        
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-blue-200 mb-2"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-blue-200 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
              placeholder="Enter your password"
            />
          </div>
          {error && (
            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          {message && (
            <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/30">
              <p className="text-green-400 text-sm">{message}</p>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="w-4 h-4 text-yellow-400 bg-white/20 border-white/30 rounded focus:ring-yellow-400 focus:ring-offset-gray-800"
              />
              <label
                htmlFor="remember-me"
                className="block ml-2 text-sm text-blue-200"
              >
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <button
                type="button"
                className="font-medium text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                Forgot your password?
              </button>
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-blue-200">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="font-medium text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;