import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AboutModal from '../common/AboutModal';
import FeedbackCard from '../common/FeedbackCard';
import Button from '../common/Button';

const Footer = () => {
  const location = useLocation();
  const [isOnboardingPage, setIsOnboardingPage] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);

  useEffect(() => {
    // Check if we're on the onboarding page
    setIsOnboardingPage(location.pathname.includes('/onboarding'));
  }, [location]);

  // Skip rendering footer on onboarding flow
  if (isOnboardingPage) {
    return null;
  }

  const openFeedbackModal = () => {
    // Dispatch a custom event to trigger the feedback card
    console.log("Footer: dispatching openFeedback event");
    const event = new Event('openFeedback');
    window.dispatchEvent(event);
  };
  
  const openAboutModal = () => {
    setAboutModalOpen(true);
  };

  const closeAboutModal = () => {
    setAboutModalOpen(false);
  };
  
  // Function to open the waitlist modal
  const openWaitlistModal = () => {
    const modal = document.getElementById('waitlist-modal');
    if (modal) {
      if (typeof modal.showModal === 'function') {
        modal.showModal();
      } else {
        alert('Your browser does not support the dialog element.');
      }
    } else {
      alert('Waitlist modal not found. Please try again on the home page.');
    }
  };

  return (
    <footer className="bg-marbleWhite border-t border-aegeanBlue/10 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex flex-wrap justify-center md:justify-start space-x-4 md:space-x-6 items-center">
            <Link to="/" className="text-aegeanBlue hover:text-aegeanBlue/80">
              Home
            </Link>
            <button 
              onClick={openAboutModal}
              className="text-aegeanBlue hover:text-aegeanBlue/80 cursor-pointer"
            >
              About
            </button>
            <button 
              onClick={openFeedbackModal}
              className="text-aegeanBlue hover:text-aegeanBlue/80 cursor-pointer"
            >
              Feedback
            </button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={openWaitlistModal}
              className="mt-2 md:mt-0"
            >
              Join the Waitlist
            </Button>
          </div>
          <p className="mt-4 text-center md:mt-0 md:text-right text-sm text-aegeanBlue/70">
            &copy; {new Date().getFullYear()} Ancient Greece Revisited. All rights reserved.
          </p>
        </div>
        <div className="mt-4 text-center text-xs text-aegeanBlue/60">
          <p>Demo Version - For Presentation Only</p>
        </div>
      </div>
      
      {/* About Modal */}
      <AboutModal isOpen={aboutModalOpen} onClose={closeAboutModal} />
      
      {/* Include the FeedbackCard component to ensure it gets rendered */}
      <FeedbackCard />
      
      {/* Waitlist Modal */}
      <dialog id="waitlist-modal" className="modal p-0 rounded-lg shadow-elegant max-w-md w-full bg-white">
        <div className="p-6">
          <h3 className="text-2xl font-serif font-bold text-aegeanBlue mb-4">Join Our Waitlist</h3>
          <p className="text-aegeanBlue/80 mb-6">
            Be the first to know when The Oikosystem launches. We'll notify you as soon as it's ready.
          </p>
          
          <form name="waitlist" method="POST" data-netlify="true" className="space-y-4">
            <input type="hidden" name="form-name" value="waitlist" />
            
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
                Name (Optional)
                <input 
                  type="text" 
                  name="name"
                  className="w-full mt-1 px-4 py-2 border border-aegeanBlue/20 rounded-md focus:ring-2 focus:ring-oliveGold/50 focus:border-oliveGold outline-none"
                  placeholder="Your name"
                />
              </label>
            </p>
            
            <p className="flex items-start">
              <label className="flex items-start">
                <input
                  name="interest"
                  type="checkbox"
                  className="h-4 w-4 mt-1 text-oliveGold border-aegeanBlue/20 rounded focus:ring-oliveGold/50"
                />
                <span className="ml-3 text-sm text-aegeanBlue/70">
                  I'd like to participate in beta testing
                </span>
              </label>
            </p>
            
            <div className="flex gap-3 justify-end">
              <Button 
                variant="ghost" 
                onClick={() => document.getElementById('waitlist-modal').close()}
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </div>
      </dialog>
    </footer>
  );
};

export default Footer;