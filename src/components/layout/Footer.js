import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AboutModal from '../common/AboutModal';
import { recordFeedback, getAnalyticsData } from '../../services/analyticsService';

const Footer = () => {
  const location = useLocation();
  const [isOnboardingPage, setIsOnboardingPage] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form fields
  const [feedbackText, setFeedbackText] = useState('');
  const [email, setEmail] = useState('');
  const [likedFeature, setLikedFeature] = useState('');
  const [contactOk, setContactOk] = useState(false);

  useEffect(() => {
    // Check if we're on the onboarding page
    setIsOnboardingPage(location.pathname.includes('/onboarding'));
  }, [location]);

  // Skip rendering footer on onboarding flow
  if (isOnboardingPage) {
    return null;
  }

  const openFeedbackModal = () => {
    setFeedbackModalOpen(true);
  };

  const closeFeedbackModal = () => {
    setFeedbackModalOpen(false);
    // Reset the form submission status after some time
    setTimeout(() => {
      setFormSubmitted(false);
      // Reset form fields
      setFeedbackText('');
      setEmail('');
      setLikedFeature('');
      setContactOk(false);
    }, 1000);
  };
  
  const openAboutModal = () => {
    setAboutModalOpen(true);
  };

  const closeAboutModal = () => {
    setAboutModalOpen(false);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Get the features used from analytics data
      const analyticsData = getAnalyticsData();
      const features = analyticsData.features || {};
      const pageViews = analyticsData.pageViews || {};
      
      // Use the same feedback system as FeedbackCard
      const success = await recordFeedback({
        interestLevel: 5, // Default to high interest for footer feedback
        feedback: feedbackText,
        email: email || null,
        features: {
          ...features,
          // Add the liked feature if provided
          ...(likedFeature ? { [likedFeature]: 1 } : {})
        },
        pageViews,
        source: 'footer', // Mark the source as footer
        contactOk: contactOk
      });
      
      if (success) {
        console.log('Feedback successfully submitted');
        setFormSubmitted(true);
        
        // Close the modal after a delay
        setTimeout(() => {
          closeFeedbackModal();
        }, 2000);
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('There was a problem submitting your feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-marbleWhite border-t border-aegeanBlue/10 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start space-x-6">
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
      {feedbackModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button 
              onClick={closeFeedbackModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {formSubmitted ? (
              <div className="py-8 text-center">
                <div className="text-oracleGreen text-5xl mb-4">✓</div>
                <h3 className="text-2xl font-serif font-bold text-aegeanBlue mb-2">Thank You!</h3>
                <p className="text-aegeanBlue/80">Your feedback has been submitted successfully.</p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-serif font-bold text-aegeanBlue mb-4">Share Your Feedback</h3>
                <p className="text-aegeanBlue/80 mb-6">
                  We value your thoughts and suggestions to improve The Oikosystem. Please share your experience with us.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-aegeanBlue/70 mb-1" htmlFor="email">
                      Email
                    </label>
                    <input 
                      id="email"
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-aegeanBlue/20 rounded-md focus:ring-2 focus:ring-oliveGold/50 focus:border-oliveGold outline-none"
                      placeholder="you@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-aegeanBlue/70 mb-1" htmlFor="liked-feature">
                      What feature did you like most?
                    </label>
                    <input 
                      id="liked-feature"
                      type="text" 
                      value={likedFeature}
                      onChange={(e) => setLikedFeature(e.target.value)}
                      className="w-full px-4 py-2 border border-aegeanBlue/20 rounded-md focus:ring-2 focus:ring-oliveGold/50 focus:border-oliveGold outline-none"
                      placeholder="Study, Journal, Agora..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-aegeanBlue/70 mb-1" htmlFor="feedback-text">
                      Your Feedback
                    </label>
                    <textarea 
                      id="feedback-text"
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      required
                      rows="4"
                      className="w-full px-4 py-2 border border-aegeanBlue/20 rounded-md focus:ring-2 focus:ring-oliveGold/50 focus:border-oliveGold outline-none resize-none"
                      placeholder="Please share your thoughts, suggestions or issues..."
                    ></textarea>
                  </div>
                  
                  <div className="flex items-start">
                    <input
                      id="contact-ok"
                      type="checkbox"
                      checked={contactOk}
                      onChange={(e) => setContactOk(e.target.checked)}
                      className="h-4 w-4 mt-1 text-oliveGold border-aegeanBlue/20 rounded focus:ring-oliveGold/50"
                    />
                    <label htmlFor="contact-ok" className="ml-3 text-sm text-aegeanBlue/70">
                      It's okay to contact me about my feedback
                    </label>
                  </div>
                  
                  <div className="flex gap-3 justify-end pt-2">
                    <button 
                      type="button"
                      className="px-4 py-2 text-aegeanBlue hover:bg-aegeanBlue/5 rounded-md transition-colors"
                      onClick={closeFeedbackModal}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-oliveGold text-white rounded-md hover:bg-oliveGold/90 transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* About Modal */}
      <AboutModal isOpen={aboutModalOpen} onClose={closeAboutModal} />
    </footer>
  );
};

export default Footer;