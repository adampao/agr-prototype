import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  // Skip footer on onboarding flow
  const isOnboardingPage = window.location.pathname.includes('/onboarding');
  if (isOnboardingPage) {
    return null;
  }

  return (
    <footer className="bg-marbleWhite border-t border-aegeanBlue/10 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start space-x-6">
            <Link to="/" className="text-aegeanBlue hover:text-aegeanBlue/80">
              Home
            </Link>
            <a href="#" className="text-aegeanBlue hover:text-aegeanBlue/80">
              About
            </a>
            <a href="#" className="text-aegeanBlue hover:text-aegeanBlue/80">
              Privacy
            </a>
            <a href="#" className="text-aegeanBlue hover:text-aegeanBlue/80">
              Terms
            </a>
          </div>
          <p className="mt-4 text-center md:mt-0 md:text-right text-sm text-aegeanBlue/70">
            &copy; {new Date().getFullYear()} Ancient Greece Revisited. All rights reserved.
          </p>
        </div>
        <div className="mt-4 text-center text-xs text-aegeanBlue/60">
          <p>Demo Version - For Investor Presentation Only</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;