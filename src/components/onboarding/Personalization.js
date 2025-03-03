import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../common/Card';
import Button from '../common/Button';

// These would come from your AI service in a real app
const philosophicalQuotes = [
  {
    text: "The unexamined life is not worth living.",
    author: "Socrates",
    context: "This quote reminds us of the importance of self-reflection and critical thinking in our pursuit of wisdom and fulfillment."
  },
  {
    text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle",
    context: "This quote emphasizes the power of habits and consistent practice in developing virtue and excellence."
  },
  {
    text: "No man ever steps in the same river twice, for it's not the same river and he's not the same man.",
    author: "Heraclitus",
    context: "This quote highlights the constant nature of change and the importance of adapting to life's ever-changing circumstances."
  },
  {
    text: "The mind is not a vessel to be filled, but a fire to be kindled.",
    author: "Plutarch",
    context: "This quote emphasizes that true education is about inspiring a love of learning rather than merely accumulating facts."
  },
  {
    text: "Know thyself.",
    author: "Inscription at the Temple of Apollo at Delphi",
    context: "This ancient maxim reminds us that self-knowledge is the foundation of wisdom and personal growth."
  }
];

const dailyChallenges = [
  {
    title: "The Socratic Examination",
    description: "Identify one belief you hold strongly. Now, question it thoroughly. What evidence supports it? What might challenge it? Can you see it from another perspective?",
    difficulty: "Moderate",
    category: "Critical Thinking"
  },
  {
    title: "Stoic Resilience",
    description: "Identify something causing you stress that is beyond your control. Practice accepting it while focusing your energy on what you can change.",
    difficulty: "Challenging",
    category: "Emotional Regulation"
  },
  {
    title: "Aristotle's Golden Mean",
    description: "Consider a virtue (courage, honesty, etc.). Reflect on how this virtue represents a balance between two extremes in your life.",
    difficulty: "Moderate",
    category: "Virtue Ethics"
  }
];

const Personalization = ({ userPreferences, onContinue }) => {
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [isGenerating, setIsGenerating] = useState(true);
  
  useEffect(() => {
    // Simulate AI generating personalized content
    const timer = setTimeout(() => {
      // Select a quote based on user preferences (in a real app, this would be from AI)
      const quoteIndex = Math.floor(Math.random() * philosophicalQuotes.length);
      setSelectedQuote(philosophicalQuotes[quoteIndex]);
      
      // Select a daily challenge
      const challengeIndex = Math.floor(Math.random() * dailyChallenges.length);
      setDailyChallenge(dailyChallenges[challengeIndex]);
      
      setIsGenerating(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [userPreferences]);

  return (
    <motion.div 
      className="max-w-3xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif font-bold text-aegeanBlue mb-4">
          Personalization Magic
        </h2>
        <p className="text-lg text-aegeanBlue/80">
          Based on your responses, we've crafted your personalized experience.
        </p>
      </div>
      
      {isGenerating ? (
        <div className="py-16 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-aegeanBlue mb-4"></div>
          <p className="text-lg font-serif text-aegeanBlue/80">The Oracle is consulting the ancient wisdom...</p>
        </div>
      ) : (
        <>
          {/* Personalized Quote Section */}
          {selectedQuote && (
            <motion.div 
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <h3 className="text-xl font-serif font-semibold text-aegeanBlue mb-4">
                Your Philosophical Quote
              </h3>
              <Card variant="philosophical" className="overflow-hidden">
                <div className="bg-philosophicalPurple/20 -m-6 mb-6 p-6">
                  <blockquote className="italic text-xl font-serif text-aegeanBlue">
                    "{selectedQuote.text}"
                  </blockquote>
                  <p className="mt-4 text-right font-medium text-aegeanBlue">— {selectedQuote.author}</p>
                </div>
                <p className="text-aegeanBlue/80">
                  {selectedQuote.context}
                </p>
              </Card>
            </motion.div>
          )}
          
          {/* Daily Challenge Section */}
          {dailyChallenge && (
            <motion.div 
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <h3 className="text-xl font-serif font-semibold text-aegeanBlue mb-4">
                Your First Daily Challenge
              </h3>
              <Card variant="oracle" className="overflow-hidden">
                <div className="bg-oracleGreen/20 -m-6 mb-6 p-6">
                  <h4 className="text-xl font-medium text-oracleGreen">{dailyChallenge.title}</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-oracleGreen/20 text-oracleGreen rounded-full">
                      {dailyChallenge.difficulty}
                    </span>
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-oracleGreen/20 text-oracleGreen rounded-full">
                      {dailyChallenge.category}
                    </span>
                  </div>
                </div>
                <p className="text-aegeanBlue/80">
                  {dailyChallenge.description}
                </p>
              </Card>
            </motion.div>
          )}
          
          {/* Explanation Section */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <Card>
              <h3 className="text-xl font-serif font-semibold text-aegeanBlue mb-4">
                How We'll Personalize Your Experience
              </h3>
              <p className="text-aegeanBlue/80 mb-4">
                Your responses will help us tailor your experience in several ways:
              </p>
              <ul className="list-disc list-inside space-y-2 text-aegeanBlue/80">
                <li>Customize philosophical guidance to match your learning style</li>
                <li>Focus content on your areas of philosophical interest</li>
                <li>Align daily challenges with your current life goals</li>
                <li>Adapt AI interactions to suit your preferences</li>
              </ul>
            </Card>
          </motion.div>
          
          <div className="mt-12 text-center">
            <Button 
              onClick={onContinue}
              size="lg"
            >
              Continue to Your Oikosystem
            </Button>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default Personalization;