import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { recordFeedback, hasFeedback, getAnalyticsData } from '../../services/analyticsService';
import Button from './Button';

const FeedbackCard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [interestLevel, setInterestLevel] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasGivenFeedback, setHasGivenFeedback] = useState(hasFeedback());
  const [showTrigger, setShowTrigger] = useState(false);
  
  // Only show the feedback trigger after the user has been on the site for a minute
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasGivenFeedback) {
        setShowTrigger(true);
      }
    }, 60000); // 60 seconds
    
    return () => clearTimeout(timer);
  }, [hasGivenFeedback]);
  
  // Check if the user has used key features before showing the card
  useEffect(() => {
    const checkFeatureUsage = () => {
      const analyticsData = getAnalyticsData();
      const features = analyticsData.features || {};
      const hasUsedFeatures = Object.keys(features).length > 0;
      
      // Show feedback card after using multiple pages or key features
      if (hasUsedFeatures && !hasGivenFeedback) {
        setTimeout(() => {
          setIsOpen(true);
        }, 10000); // Show 10 seconds after using features
      }
    };
    
    // Check initially and set up an interval to check periodically
    checkFeatureUsage();
    const interval = setInterval(checkFeatureUsage, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [hasGivenFeedback]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Get the features used from analytics data
      const analyticsData = getAnalyticsData();
      const features = analyticsData.features || {};
      const pageViews = analyticsData.pageViews || {};
      
      const success = await recordFeedback({
        interestLevel,
        feedback,
        email: email || null,
        features,
        pageViews
      });
      
      if (success) {
        setStep(3); // Move to thank you step
        setHasGivenFeedback(true);
        
        // Close the card after a delay
        setTimeout(() => {
          setIsOpen(false);
          // Reset form after closing
          setTimeout(() => {
            setStep(1);
            setInterestLevel(null);
            setFeedback('');
            setEmail('');
          }, 500);
        }, 3000);
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
  
  const handleClose = () => {
    setIsOpen(false);
  };
  
  if (!showTrigger && !isOpen) {
    return null;
  }
  
  return (
    <>
      {/* Feedback Button Trigger */}
      <AnimatePresence>
        {!isOpen && showTrigger && !hasGivenFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <button
              onClick={() => setIsOpen(true)}
              className="bg-oliveGold hover:bg-oliveGold/90 text-white px-4 py-2 rounded-full flex items-center shadow-lg transition-colors"
            >
              <span className="mr-2">💬</span>
              Share Your Thoughts
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Feedback Card Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={handleClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {step === 1 && (
                <div>
                  <h3 className="text-2xl font-serif font-bold text-aegeanBlue mb-6">
                    How interested are you in AGR?
                  </h3>
                  <p className="text-aegeanBlue/80 mb-6">
                    We'd love to know your thoughts on the Ancient Greece Revisited platform. Your feedback helps us improve!
                  </p>
                  
                  <div className="space-y-3 mb-8">
                    {[
                      { value: 5, label: "Very interested - I can't wait to use it!" },
                      { value: 4, label: "Quite interested - Looks promising" },
                      { value: 3, label: "Somewhat interested - Need to see more" },
                      { value: 2, label: "Slightly interested - Not sure it's for me" },
                      { value: 1, label: "Not interested - Not what I'm looking for" }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setInterestLevel(option.value);
                          setStep(2);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                          interestLevel === option.value
                            ? 'border-oliveGold bg-oliveGold/10 text-oliveGold'
                            : 'border-aegeanBlue/20 hover:bg-aegeanBlue/5'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {step === 2 && (
                <form onSubmit={handleSubmit}>
                  <h3 className="text-2xl font-serif font-bold text-aegeanBlue mb-4">
                    Tell us more
                  </h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-aegeanBlue/70 mb-1">
                      What did you like or dislike about AGR?
                    </label>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      rows="4"
                      className="w-full px-4 py-2 border border-aegeanBlue/20 rounded-md focus:ring-2 focus:ring-oliveGold/50 focus:border-oliveGold outline-none"
                      placeholder="Share your thoughts about the platform..."
                      required
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-aegeanBlue/70 mb-1">
                      Email (optional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-aegeanBlue/20 rounded-md focus:ring-2 focus:ring-oliveGold/50 focus:border-oliveGold outline-none"
                      placeholder="your@email.com"
                    />
                    <p className="mt-1 text-xs text-aegeanBlue/60">
                      Only if you'd like us to contact you for beta testing
                    </p>
                  </div>
                  
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-aegeanBlue hover:text-aegeanBlue/70"
                    >
                      Back
                    </button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                    </Button>
                  </div>
                </form>
              )}
              
              {step === 3 && (
                <div className="text-center py-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-oracleGreen/20 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-oracleGreen" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-aegeanBlue mb-2">
                    Thank you for your feedback!
                  </h3>
                  <p className="text-aegeanBlue/80">
                    Your insights help us build a better platform.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FeedbackCard;