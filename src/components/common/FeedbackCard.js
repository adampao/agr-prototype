import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { recordFeedback, hasFeedback, getAnalyticsData } from '../../services/analyticsService';
import Button from './Button';

const FeedbackCard = ({ openFromFooter = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [interestLevel, setInterestLevel] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasGivenFeedback, setHasGivenFeedback] = useState(hasFeedback());
  const [showTrigger, setShowTrigger] = useState(false);
  const [journalRating, setJournalRating] = useState(0);
  const [studyRating, setStudyRating] = useState(0);
  const [agoraRating, setAgoraRating] = useState(0);
  const [journalNotTested, setJournalNotTested] = useState(false);
  const [studyNotTested, setStudyNotTested] = useState(false);
  const [agoraNotTested, setAgoraNotTested] = useState(false);
  
  // Create a global event listener for opening the feedback card
  useEffect(() => {
    // Define a custom event handler
    const handleOpenFeedback = () => {
      console.log("FeedbackCard: received openFeedback event");
      setIsOpen(true);
    };
    
    // Add event listener for a custom event
    window.addEventListener('openFeedback', handleOpenFeedback);
    
    // Legacy check for direct flag setting
    if (window.openFeedbackCard) {
      console.log("FeedbackCard: detected openFeedbackCard flag");
      setIsOpen(true);
      window.openFeedbackCard = false;
    }
    
    // Cleanup
    return () => {
      window.removeEventListener('openFeedback', handleOpenFeedback);
    };
  }, []);
  
  // If openFromFooter prop changes, open the feedback card
  useEffect(() => {
    if (openFromFooter) {
      console.log("Opening feedback from footer");
      setIsOpen(true);
    }
  }, [openFromFooter]);
  
  // Only show the feedback trigger after the user has been on the site for a short time
  useEffect(() => {
    if (hasGivenFeedback) return;
    
    const timer = setTimeout(() => {
      if (!hasGivenFeedback) {
        setShowTrigger(true);
        console.log("Setting showTrigger to true"); // Debugging log
      }
    }, 60000); // time 
    
    return () => clearTimeout(timer);
  }, [hasGivenFeedback]);
  
  // Check if the user has used key features before showing the card
  useEffect(() => {
    // Don't set up any timers if feedback was already given
    if (hasGivenFeedback) return;
    
    let initialTimer;
    let interval;
    
    const checkFeatureUsage = () => {
      if (isOpen) return; // Don't open if already open
      
      const analyticsData = getAnalyticsData();
      const features = analyticsData.features || {};
      const hasUsedFeatures = Object.keys(features).length > 0;
      
      // Show feedback card after using multiple pages or key features
      if (hasUsedFeatures && !hasGivenFeedback) {
        setTimeout(() => {
          setIsOpen(true);
        }, 300000); // Show 5 minutes after using features
      }
    };
    
    // Check after a delay and set up an interval to check less frequently
    initialTimer = setTimeout(checkFeatureUsage, 90000); // First check
    interval = setInterval(checkFeatureUsage, 600000); // Check every 10 minutes
    
    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [hasGivenFeedback, isOpen]);
  
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
        pageViews,
        pageRatings: {
          journal: {
            rating: journalRating,
            notTested: journalNotTested
          },
          study: {
            rating: studyRating,
            notTested: studyNotTested
          },
          agora: {
            rating: agoraRating,
            notTested: agoraNotTested
          }
        }
      });
      
      if (success) {
        // Set step to thank you
        setStep(3);
        setHasGivenFeedback(true);
        
        // Display thank you message THEN close after a short delay
        setTimeout(() => {
          setIsOpen(false);
          setShowTrigger(false);
          
          // Reset form state in background
          setTimeout(() => {
            setStep(1);
            setInterestLevel(null);
            setFeedback('');
            setEmail('');
            setJournalRating(0);
            setStudyRating(0);
            setAgoraRating(0);
            setJournalNotTested(false);
            setStudyNotTested(false);
            setAgoraNotTested(false);
          }, 500);
        }, 1500); // Wait 1.5 seconds before closing
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
  
  // Only hide completely if not open and no trigger should be shown
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
            className="fixed bottom-6 left-0 right-0 mx-auto w-max z-[1000]"
          >
            <button
              onClick={() => setIsOpen(true)}
              className="bg-oliveGold/80 hover:bg-oliveGold text-white px-4 py-2 rounded-full flex items-center shadow-lg transition-colors backdrop-blur-sm"
            >
              <span className="mr-2">💬</span>
              <span className="whitespace-nowrap">Share Your Feedback</span>
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
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-4 sm:p-6"
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
                    How interested are you in using this product?
                  </h3>
                  <p className="text-aegeanBlue/80 mb-6">
                    We'd love to know your thoughts on the Ancient Greece Revisited AI platform. Your feedback helps us create a meaningful product!
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
                      What did you like or dislike about this demo? 
                    </label>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      rows="4"
                      className="w-full px-4 py-2 border border-aegeanBlue/20 rounded-md focus:ring-2 focus:ring-oliveGold/50 focus:border-oliveGold outline-none"
                      placeholder="Share your thoughts about the demo. How would it be meaningful to you?"
                      required
                    />
                  </div>

                 {/* Page Ratings */}
<div className="space-y-4 my-6">
  <h4 className="font-medium text-aegeanBlue">Rate your experience with each section:</h4>
  
  {/* Journal Rating */}
  <div className="mb-5">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <label className="text-sm font-medium text-aegeanBlue/70 w-16 mr-4">
          Journal
        </label>
        
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={`journal-${star}`}
              type="button"
              onClick={() => {
                setJournalRating(star);
                setJournalNotTested(false);
              }}
              disabled={journalNotTested}
              className={`text-2xl text-aegeanBlue focus:outline-none ${journalNotTested ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {star <= journalRating ? "★" : "☆"}
            </button>
          ))}
          <span className="ml-5 text-sm text-aegeanBlue/60 min-w-[80px]">
            {journalNotTested ? "Not tested" : journalRating > 0 ? `${journalRating}/5` : "Not rated"}
          </span>
        </div>
      </div>
      
      <div className="flex items-center ml-6">
        <input
          type="checkbox"
          id="journal-not-tested"
          checked={journalNotTested}
          onChange={(e) => {
            setJournalNotTested(e.target.checked);
            if (e.target.checked) setJournalRating(0);
          }}
          className="mr-2"
        />
        <label htmlFor="journal-not-tested" className="text-xs text-aegeanBlue/60">
          I didn't test this
        </label>
      </div>
    </div>
  </div>
  
  {/* Study Rating - Same pattern */}
  <div className="mb-5">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <label className="text-sm font-medium text-aegeanBlue/70 w-16 mr-4">
          Study
        </label>
        
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={`study-${star}`}
              type="button"
              onClick={() => {
                setStudyRating(star);
                setStudyNotTested(false);
              }}
              disabled={studyNotTested}
              className={`text-2xl text-aegeanBlue focus:outline-none ${studyNotTested ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {star <= studyRating ? "★" : "☆"}
            </button>
          ))}
          <span className="ml-3 text-sm text-aegeanBlue/60 min-w-[70px]">
            {studyNotTested ? "Not tested" : studyRating > 0 ? `${studyRating}/5` : "Not rated"}
          </span>
        </div>
      </div>
      
      <div className="flex items-center ml-1">
        <input
          type="checkbox"
          id="study-not-tested"
          checked={studyNotTested}
          onChange={(e) => {
            setStudyNotTested(e.target.checked);
            if (e.target.checked) setStudyRating(0);
          }}
          className="mr-2"
        />
        <label htmlFor="study-not-tested" className="text-xs text-aegeanBlue/60">
          I didn't test this
        </label>
      </div>
    </div>
  </div>
  
  {/* Agora Rating - Same pattern */}
  <div className="mb-5">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <label className="text-sm font-medium text-aegeanBlue/70 w-16 mr-4">
          Agora
        </label>
        
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={`agora-${star}`}
              type="button"
              onClick={() => {
                setAgoraRating(star);
                setAgoraNotTested(false);
              }}
              disabled={agoraNotTested}
              className={`text-2xl text-aegeanBlue focus:outline-none ${agoraNotTested ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {star <= agoraRating ? "★" : "☆"}
            </button>
          ))}
          <span className="ml-3 text-sm text-aegeanBlue/60 min-w-[70px]">
            {agoraNotTested ? "Not tested" : agoraRating > 0 ? `${agoraRating}/5` : "Not rated"}
          </span>
        </div>
      </div>
      
      <div className="flex items-center ml-1">
        <input
          type="checkbox"
          id="agora-not-tested"
          checked={agoraNotTested}
          onChange={(e) => {
            setAgoraNotTested(e.target.checked);
            if (e.target.checked) setAgoraRating(0);
          }}
          className="mr-2"
        />
        <label htmlFor="agora-not-tested" className="text-xs text-aegeanBlue/60">
          I didn't test this
        </label>
      </div>
    </div>
  </div>
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
                      Only if you'd like us to contact you regarding your feedback 
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