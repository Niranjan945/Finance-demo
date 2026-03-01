import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard'); // We will build this next!
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-rzp-card p-8 rounded-xl shadow-sm border border-rzp-border max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="bg-rzp-bg p-3 rounded-full text-rzp-primary">
            <Lock size={24} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-rzp-primary mb-2">Welcome Back</h2>
        <p className="text-center text-rzp-text mb-8 text-sm">Sign in to your trading journal</p>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-rzp-primary mb-1">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full p-2 border border-rzp-border rounded-md focus:outline-none focus:ring-2 focus:ring-rzp-accent/20 focus:border-rzp-accent transition-colors"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-rzp-primary mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full p-2 border border-rzp-border rounded-md focus:outline-none focus:ring-2 focus:ring-rzp-accent/20 focus:border-rzp-accent transition-colors"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-rzp-accent text-white py-2.5 rounded-md font-medium hover:bg-blue-700 transition-colors mt-2">
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-rzp-text">
          Don't have an account? <Link to="/register" className="text-rzp-accent font-medium hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;