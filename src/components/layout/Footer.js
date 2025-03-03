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
            <Link to="/about" className="text-aegeanBlue hover:text-aegeanBlue/80">
              About
            </Link>
            <Link to="/privacy" className="text-aegeanBlue hover:text-aegeanBlue/80">
              Privacy
            </Link>
            <Link to="/terms" className="text-aegeanBlue hover:text-aegeanBlue/80">
              Terms
            </Link>
            <button 
              onClick={() => document.getElementById('feedback-modal').showModal()}
              className="text-aegeanBlue hover:text-aegeanBlue/80 cursor-pointer"
            >
              Feedback
            </button>
          </div>
          <p className="mt-4 text-center md:mt-0 md:text-right text-sm text-aegeanBlue/70">
            &copy; {new Date().getFullYear()} Ancient Greece Revisited. All rights reserved.
          </p>
        </div>
        <div className="mt-4 text-center text-xs text-aegeanBlue/60">
          <p>Demo Version - For Investor Presentation Only</p>
        </div>
      </div>
      
      {/* Feedback Modal */}
      <dialog id="feedback-modal" className="modal p-0 rounded-lg shadow-elegant max-w-md w-full bg-white">
        <div className="p-6">
          <h3 className="text-2xl font-serif font-bold text-aegeanBlue mb-4">Share Your Feedback</h3>
          <p className="text-aegeanBlue/80 mb-6">
            We value your thoughts and suggestions to improve The Oikosystem. Please share your experience with us.
          </p>
          
          <form name="feedback" method="POST" data-netlify="true" className="space-y-4">
            <input type="hidden" name="form-name" value="feedback" />
            
            <p>
              <label className="block text-sm font-medium text-aegeanBlue/70 mb-1">
                Email
                <input 
                  type="email" 
                  name="email" 
                  required
                  className="w-full mt-1 px-4 py-2 border border-aegeanBlue/20 rounded-md focus:ring-2 focus:ring-oliveGold/50 focus:border-oliveGold outline-none"
                  placeholder="you@example.com"
                />
              </label>
            </p>
            
            <p>
              <label className="block text-sm font-medium text-aegeanBlue/70 mb-1">
                What feature did you like most?
                <input 
                  type="text" 
                  name="liked-feature"
                  className="w-full mt-1 px-4 py-2 border border-aegeanBlue/20 rounded-md focus:ring-2 focus:ring-oliveGold/50 focus:border-oliveGold outline-none"
                  placeholder="Study, Journal, Agora..."
                />
              </label>
            </p>
            
            <p>
              <label className="block text-sm font-medium text-aegeanBlue/70 mb-1">
                Your Feedback
                <textarea 
                  name="feedback-text"
                  required
                  rows="4"
                  className="w-full mt-1 px-4 py-2 border border-aegeanBlue/20 rounded-md focus:ring-2 focus:ring-oliveGold/50 focus:border-oliveGold outline-none resize-none"
                  placeholder="Please share your thoughts, suggestions or issues..."
                ></textarea>
              </label>
            </p>
            
            <p className="flex items-start">
              <label className="flex items-start">
                <input
                  name="contact-ok"
                  type="checkbox"
                  className="h-4 w-4 mt-1 text-oliveGold border-aegeanBlue/20 rounded focus:ring-oliveGold/50"
                />
                <span className="ml-3 text-sm text-aegeanBlue/70">
                  It's okay to contact me about my feedback
                </span>
              </label>
            </p>
            
            <div className="flex gap-3 justify-end">
              <button 
                type="button"
                className="px-4 py-2 text-aegeanBlue hover:bg-aegeanBlue/5 rounded-md transition-colors"
                onClick={() => document.getElementById('feedback-modal').close()}
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-oliveGold text-white rounded-md hover:bg-oliveGold/90 transition-colors">
                Submit
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </footer>
  );
};

export default Footer;