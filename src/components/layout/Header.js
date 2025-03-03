import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import AuthModal from '../auth/AuthModal';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'signup'
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, signout } = useAuth();
  
  // Skip header on onboarding flow
  if (location.pathname.includes('/onboarding')) {
    return null;
  }
  
  const navigation = [
    { name: 'Journal', href: '/journal' },
    { name: 'Study', href: '/study' },
    { name: 'Agora', href: '/agora' },
    { name: 'Profile', href: '/profile' },
  ];
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleSignOut = () => {
    signout();
    if (location.pathname === '/profile') {
      navigate('/');
    }
  };

  const openSignIn = () => {
    setAuthMode('signin');
    setAuthModalOpen(true);
  };

  const openSignUp = () => {
    setAuthMode('signup');
    setAuthModalOpen(true);
  };

  return (
    <header className="bg-marbleWhite border-b border-aegeanBlue/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <span className="font-serif text-2xl font-bold text-aegeanBlue">The Oikosystem</span>
              </Link>
            </div>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center">
            <nav className="md:ml-6 md:flex md:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                    isActive(item.href)
                      ? 'border-oliveGold text-aegeanBlue'
                      : 'border-transparent text-aegeanBlue/70 hover:border-aegeanBlue/30 hover:text-aegeanBlue'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            
            {/* Auth buttons */}
            <div className="ml-6 flex items-center space-x-4">
              {currentUser ? (
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-aegeanBlue flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full overflow-hidden bg-aegeanBlue/10">
                      <img 
                        src={currentUser.avatar || 'https://via.placeholder.com/150'} 
                        alt="Profile" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span>{currentUser.name}</span>
                  </div>
                  <button 
                    onClick={handleSignOut}
                    className="text-sm text-aegeanBlue/70 hover:text-aegeanBlue"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <>
                  <button 
                    onClick={openSignIn}
                    className="text-sm text-aegeanBlue/70 hover:text-aegeanBlue"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={openSignUp}
                    className="px-4 py-1 text-sm bg-oliveGold text-white rounded-md hover:bg-oliveGold/90"
                  >
                    Create Account
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-aegeanBlue hover:text-aegeanBlue hover:bg-aegeanBlue/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-oliveGold"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive(item.href)
                    ? 'bg-oliveGold/10 border-oliveGold text-aegeanBlue'
                    : 'border-transparent text-aegeanBlue/70 hover:bg-aegeanBlue/10 hover:border-aegeanBlue/30 hover:text-aegeanBlue'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile auth options */}
            <div className="mt-4 pt-4 border-t border-aegeanBlue/10">
              {currentUser ? (
                <>
                  <div className="pl-3 pr-4 py-2 flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full overflow-hidden bg-aegeanBlue/10">
                      <img 
                        src={currentUser.avatar || 'https://via.placeholder.com/150'} 
                        alt="Profile" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="text-aegeanBlue font-medium">{currentUser.name}</span>
                  </div>
                  <button 
                    onClick={handleSignOut}
                    className="block w-full text-left pl-3 pr-4 py-3 text-base font-medium text-aegeanBlue/70 hover:bg-aegeanBlue/10 rounded-md mb-1"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={openSignIn}
                    className="block w-full text-left pl-3 pr-4 py-3 text-base font-medium text-aegeanBlue/70 hover:bg-aegeanBlue/10 rounded-md mb-1"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={openSignUp}
                    className="block w-full text-left pl-3 pr-4 py-3 text-base font-medium bg-aegeanBlue/10 text-aegeanBlue font-medium rounded-md"
                  >
                    Create Account
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </header>
  );
};

export default Header;