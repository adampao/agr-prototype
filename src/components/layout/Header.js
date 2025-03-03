import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
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
          <nav className="hidden md:ml-6 md:flex md:space-x-8">
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
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;