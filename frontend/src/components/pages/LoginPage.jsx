import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // Import the useAuth hook

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // Get the login function from context

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to login');
      }

      login(); // Set the authentication state to true
      setMessage('Login successful! Redirecting to home...');
      setTimeout(() => {
        navigate('/home');
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md p-8 space-y-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
        <h2 className="text-3xl font-bold text-center text-white">Login</h2>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-blue-200"
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
              className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-blue-200"
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
              className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {message && <p className="text-green-400 text-sm">{message}</p>}
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
                className="font-medium text-yellow-400 hover:text-yellow-300"
              >
                Forgot your password?
              </button>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg transition-colors duration-300"
            >
              Sign in
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-blue-200">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="font-medium text-yellow-400 hover:text-yellow-300"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;