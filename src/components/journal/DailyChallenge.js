import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../common/Card';
import Button from '../common/Button';

const DailyChallenge = ({ challenge, onCompleteChallenge }) => {
  const [response, setResponse] = useState('');
  const [isCompleted, setIsCompleted] = useState(challenge.completed || false);
  const [showDetails, setShowDetails] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    if (response.trim()) {
      setIsSubmitting(true);
      await onCompleteChallenge(challenge.id, response);
      setIsCompleted(true);
      setIsSubmitting(false);
    }
  };
  
  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card variant="oracle" className={isCompleted ? 'opacity-90 border-l-4 border-l-oracleGreen' : ''}>
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-3">
            {isCompleted && (
              <span className="bg-oracleGreen text-white p-1 rounded-full mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
            )}
            <div>
              <h3 className="text-xl font-serif font-semibold text-aegeanBlue">
                {challenge.title}
              </h3>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="inline-block px-2 py-1 text-xs font-medium bg-oracleGreen/20 text-oracleGreen rounded-full">
                  {challenge.difficulty}
                </span>
                <span className="inline-block px-2 py-1 text-xs font-medium bg-oracleGreen/20 text-oracleGreen rounded-full">
                  {challenge.category}
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="text-aegeanBlue/70 hover:text-aegeanBlue"
          >
            {showDetails ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </Button>
        </div>
        
        <AnimatedContent show={showDetails}>
          <div className="mt-4">
            <p className="text-aegeanBlue/90 mb-4">
              {challenge.description}
            </p>
            
            {challenge.philosophy && (
              <div className="p-4 bg-oracleGreen/10 rounded-md mb-4 border border-oracleGreen/20">
                <h4 className="text-sm font-medium text-oracleGreen mb-2">Philosophical Context</h4>
                <p className="text-sm text-aegeanBlue/90 italic">
                  {challenge.philosophy}
                </p>
              </div>
            )}
            
            {challenge.completed ? (
              <div className="p-4 bg-aegeanBlue/10 rounded-md mb-4 border border-aegeanBlue/20">
                <h4 className="text-sm font-medium text-aegeanBlue mb-2">Your Response</h4>
                <p className="text-sm text-aegeanBlue/90 whitespace-pre-line">
                  {challenge.response}
                </p>
              </div>
            ) : (
              <div className="mt-4">
                <label className="block text-sm font-medium text-aegeanBlue mb-2">
                  Your Response
                </label>
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  className="w-full p-3 border border-aegeanBlue/20 rounded-md focus:outline-none focus:ring-2 focus:ring-aegeanBlue/50 bg-white text-aegeanBlue/90 min-h-[150px]"
                  placeholder="Reflect on this challenge and share your thoughts..."
                  disabled={isCompleted || isSubmitting}
                />
                <div className="flex justify-end mt-3">
                  <Button
                    onClick={handleSubmit}
                    disabled={!response.trim() || isCompleted || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin h-4 w-4 mr-2 border-2 border-white/30 border-t-white rounded-full"></span>
                        Submitting...
                      </>
                    ) : (
                      <>Complete Challenge</>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </AnimatedContent>
      </Card>
    </motion.div>
  );
};

// Helper component for animating content
const AnimatedContent = ({ show, children }) => {
  return (
    <motion.div
      initial={false}
      animate={{ 
        height: show ? 'auto' : 0,
        opacity: show ? 1 : 0
      }}
      transition={{ duration: 0.3 }}
      style={{ overflow: 'hidden' }}
    >
      {children}
    </motion.div>
  );
};

export default DailyChallenge;