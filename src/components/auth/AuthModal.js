import React, { useState, useEffect } from 'react';
import { useAuth } from '../../services/AuthContext';

const AuthModal = ({ isOpen, onClose, initialMode = 'signin' }) => {
  const [mode, setMode] = useState(initialMode); // 'signin' or 'signup'
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signin, signup } = useAuth();
  
  // Reset form when modal opens or mode changes
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setEmail('');
      setName('');
      setPassword('');
      setError('');
    }
  }, [isOpen, initialMode]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (mode === 'signin') {
        const success = signin(email, password);
        if (success) {
          onClose();
        } else {
          setError('Failed to sign in. Please check your credentials.');
        }
      } else {
        // sign up
        if (!email) {
          setError('Email is required');
          setLoading(false);
          return;
        }
        
        const success = signup(email, name, password);
        if (success) {
          onClose();
        } else {
          setError('Failed to create an account.');
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError('An error occurred. Please try again.');
    }
    
    setLoading(false);
  };
  
  const handleClose = () => {
    if (onClose) onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h2 className="text-2xl font-serif font-bold text-aegeanBlue mb-6">
          {mode === 'signin' ? 'Sign In' : 'Create Account'}
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-aegeanBlue/70 mb-1" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-aegeanBlue/20 rounded-md focus:ring-2 focus:ring-oliveGold/50 focus:border-oliveGold outline-none"
              placeholder="you@example.com"
              required
            />
          </div>
          
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-aegeanBlue/70 mb-1" htmlFor="name">
                Display Name (Optional)
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-aegeanBlue/20 rounded-md focus:ring-2 focus:ring-oliveGold/50 focus:border-oliveGold outline-none"
                placeholder="How you want to be known"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-aegeanBlue/70 mb-1" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-aegeanBlue/20 rounded-md focus:ring-2 focus:ring-oliveGold/50 focus:border-oliveGold outline-none"
              placeholder="Password (Demo Only)"
              required
            />
            <p className="mt-1 text-xs text-aegeanBlue/60">
              For this demo, any password will work. Do not use real passwords.
            </p>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-oliveGold text-white rounded-md hover:bg-oliveGold/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
            
            <button
              type="button"
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-sm text-aegeanBlue hover:text-aegeanBlue/70"
            >
              {mode === 'signin' ? 'Create an account' : 'Already have an account?'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;