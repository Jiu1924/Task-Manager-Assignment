import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { ExclamationTriangleIcon, KeyIcon, EnvelopeIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-300">Sign in to your account</p>
        </div>

        {error && (
          <div className="glass-dark p-4 rounded-xl mb-6 flex items-start gap-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-orange-400 flex-shrink-0 mt-0.5" />
            <p className="text-gray-200">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Email
            </label>
            <div className="glass relative">
              <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-transparent border-none text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 rounded-xl"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Password
            </label>
            <div className="glass relative">
              <KeyIcon className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-transparent border-none text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 rounded-xl"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full glass-dark hover:glass p-3 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength="1" className="opacity-25" />
                  <path d="M12 12c.55 0 1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1v-6c0-.55.45-1 1-1z" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength="1" className="opacity-75" />
                </svg>
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRightIcon className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-300">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-400 hover:text-blue-300 font-semibold">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
