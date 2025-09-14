import React from 'react';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md p-8 space-y-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
        <h2 className="text-3xl font-bold text-center text-white">Login</h2>
        <form className="space-y-6">
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
              className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
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
              <a
                href="#"
                className="font-medium text-yellow-400 hover:text-yellow-300"
              >
                Forgot your password?
              </a>
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
