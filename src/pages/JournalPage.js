import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/layout/Layout';
import QuickCapture from '../components/journal/QuickCapture';
import JournalEntry from '../components/journal/JournalEntry';
import DailyChallenge from '../components/journal/DailyChallenge';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { sendMessageToPhilosopher, getDailyChallenge } from '../services/claudeApi';

const JournalPage = () => {
  const [entries, setEntries] = useState([]);
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [view, setView] = useState('entries'); // 'entries', 'challenges'
  const [isLoading, setIsLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [currentPhilosopher, setCurrentPhilosopher] = useState('aristotle'); // Default philosopher
  
  useEffect(() => {
    // Load entries and challenges from localStorage
    const savedEntries = localStorage.getItem('journalEntries');
    const savedChallenge = localStorage.getItem('dailyChallenge');
    
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
    
    if (savedChallenge) {
      setDailyChallenge(JSON.parse(savedChallenge));
    } else {
      // If no challenge exists, create a new one
      createNewDailyChallenge();
    }
  }, []);
  
  // Save entries to localStorage when updated
  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem('journalEntries', JSON.stringify(entries));
    }
  }, [entries]);
  
  // Save challenge to localStorage when updated
  useEffect(() => {
    if (dailyChallenge) {
      localStorage.setItem('dailyChallenge', JSON.stringify(dailyChallenge));
    }
  }, [dailyChallenge]);
  
  const createNewDailyChallenge = async () => {
    try {
      const newChallenge = await getDailyChallenge();
      setDailyChallenge(newChallenge);
    } catch (error) {
      console.error('Error creating new challenge:', error);
      // Fallback to static challenge
      setDailyChallenge({
        id: 'challenge1',
        title: 'The Socratic Examination',
        description: 'Identify one belief you hold strongly. Now, question it thoroughly. What evidence supports it? What might challenge it? Can you see it from another perspective?',
        difficulty: 'Moderate',
        category: 'Critical Thinking',
        philosophy: 'Socrates believed that the unexamined life is not worth living. By questioning our beliefs, we can separate truth from mere opinion and achieve greater wisdom.'
      });
    }
  };
  
  const handleSaveCapture = async (content, type = 'reflection') => {
    setIsLoading(true);
    
    try {
      // Get AI insight using Anthropic's API
      const philosopherResponse = await sendMessageToPhilosopher(
        currentPhilosopher,
        `Please provide a very brief philosophical insight (maximum 1-2 sentences, no more than 30 words total) on this journal entry: "${content}"`,
        []
      );
      
      const aiInsight = philosopherResponse.response;
      
      const newEntry = {
        id: `entry-${Date.now()}`,
        title: type === 'question' ? 'Philosophical Question' : 
               type === 'insight' ? 'Philosophical Insight' : 
               'Daily Reflection',
        timestamp: new Date().toISOString(),
        content: content,
        type: currentPhilosopher === 'oracle' ? 'oracle' : 'philosophical',
        philosopher: currentPhilosopher.charAt(0).toUpperCase() + currentPhilosopher.slice(1),
        aiInsight: aiInsight,
        tags: [type]
      };
      
      setEntries([newEntry, ...entries]);
      setIsLoading(false);
      setShowOverlay(false);
    } catch (error) {
      console.error('Error getting AI insight:', error);
      
      // Fallback without AI insight if the API call fails
      const newEntry = {
        id: `entry-${Date.now()}`,
        title: type === 'question' ? 'Philosophical Question' : 'Daily Reflection',
        timestamp: new Date().toISOString(),
        content: content,
        type: 'philosophical',
        tags: [type]
      };
      
      setEntries([newEntry, ...entries]);
      setIsLoading(false);
      setShowOverlay(false);
    }
  };
  
  const handleSaveReflection = (entryId, reflection) => {
    setEntries(entries.map(entry => 
      entry.id === entryId ? { ...entry, reflection } : entry
    ));
  };
  
  const handleDeleteEntry = (entryId) => {
    setEntries(entries.filter(entry => entry.id !== entryId));
  };
  
  const handleCompleteChallenge = async (challengeId, response) => {
    setIsLoading(true);
    
    try {
      // Get AI insight on the challenge response
      const philosopherResponse = await sendMessageToPhilosopher(
        currentPhilosopher,
        `This is a response to the philosophical challenge "${dailyChallenge.title}": "${response}". Please provide a very brief philosophical insight (maximum 1-2 sentences, no more than 30 words total) on this response.`,
        []
      );
      
      const aiInsight = philosopherResponse.response;
      
      // Create a journal entry from the challenge response
      const newEntry = {
        id: `entry-challenge-${Date.now()}`,
        title: `Challenge: ${dailyChallenge.title}`,
        timestamp: new Date().toISOString(),
        content: response,
        type: 'philosophical',
        philosopher: currentPhilosopher.charAt(0).toUpperCase() + currentPhilosopher.slice(1),
        aiInsight: aiInsight,
        tags: ['Challenge', dailyChallenge.category]
      };
      
      setEntries([newEntry, ...entries]);
      
      // Mark the challenge as completed
      setDailyChallenge({
        ...dailyChallenge,
        completed: true,
        response: response
      });
      
      // Create a new challenge for tomorrow
      setTimeout(() => {
        createNewDailyChallenge();
      }, 86400000); // 24 hours
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error getting AI insight:', error);
      
      // Fallback without AI insight
      setDailyChallenge({
        ...dailyChallenge,
        completed: true,
        response: response
      });
      
      setIsLoading(false);
    }
  };
  
  const handlePhilosopherChange = (philosopherId) => {
    setCurrentPhilosopher(philosopherId);
  };
  
  return (
    <Layout>
      <div className="min-h-screen bg-marbleWhite">
      <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h1 className="text-3xl font-serif font-bold text-aegeanBlue mb-4 md:mb-0">
              Your Philosophical Journal
            </h1>
            <div className="flex space-x-2">
              <Button 
                variant={view === 'entries' ? 'primary' : 'outline'} 
                onClick={() => setView('entries')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                Journal
              </Button>
              <Button 
                variant={view === 'challenges' ? 'primary' : 'outline'}
                onClick={() => setView('challenges')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                </svg>
                Challenges
              </Button>
              <Button 
                variant="secondary"
                onClick={() => setShowOverlay(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                New Entry
              </Button>
            </div>
          </div>
          
          {/* Philosopher selector */}
          <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-aegeanBlue/70 mb-2">Choose Your Philosophical Guide</h3>
            <div className="flex flex-wrap gap-2">
              {['socrates', 'plato', 'aristotle', 'heraclitus', 'pythagoras', 'xenophon'].map(philosopher => (
                <button
                  key={philosopher}
                  onClick={() => handlePhilosopherChange(philosopher)}
                  className={`px-3 py-1.5 text-sm rounded-full transition ${
                    currentPhilosopher === philosopher
                      ? 'bg-aegeanBlue text-white'
                      : 'bg-aegeanBlue/10 text-aegeanBlue hover:bg-aegeanBlue/20'
                  }`}
                >
                  {philosopher.charAt(0).toUpperCase() + philosopher.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          {/* Main content */}
          <AnimatePresence mode="wait">
            {view === 'entries' ? (
              <motion.div
                key="entries"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-serif font-semibold text-aegeanBlue mb-4">
                  Journal Entries
                </h2>
                
                {entries.length > 0 ? (
                  entries.map((entry, index) => (
                    <JournalEntry
                      key={entry.id}
                      entry={entry}
                      onSaveReflection={handleSaveReflection}
                      onDelete={handleDeleteEntry}
                      initiallyExpanded={index === 0 && new Date(entry.timestamp) > new Date(Date.now() - 300000)} // Expanded if it's the newest entry and created in the last 5 minutes
                    />
                  ))
                ) : (
                  <Card>
                    <div className="text-center py-12">
                      <h3 className="text-lg font-medium text-aegeanBlue mb-3">Your Journal Awaits</h3>
                      <p className="text-aegeanBlue/70 mb-6 max-w-md mx-auto">
                        Begin your philosophical journey by capturing your thoughts, questions, or insights.
                      </p>
                      <Button onClick={() => setShowOverlay(true)}>
                        Create Your First Entry
                      </Button>
                    </div>
                  </Card>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="challenges"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-serif font-semibold text-aegeanBlue mb-4">
                  Daily Challenge
                </h2>
                
                {dailyChallenge && (
                  <DailyChallenge 
                    challenge={dailyChallenge} 
                    onCompleteChallenge={handleCompleteChallenge} 
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Quick capture overlay */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isLoading && setShowOverlay(false)}
          >
            <motion.div 
              className="bg-white rounded-xl w-full max-w-lg shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-serif font-semibold text-aegeanBlue">
                    Capture Your Thoughts
                  </h2>
                  <button 
                    onClick={() => !isLoading && setShowOverlay(false)}
                    className="text-aegeanBlue/50 hover:text-aegeanBlue"
                    disabled={isLoading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <QuickCapture 
                  onSave={handleSaveCapture} 
                  isLoading={isLoading}
                  philosopher={currentPhilosopher}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Loading overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white rounded-lg p-6 shadow-xl flex items-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-aegeanBlue"></div>
              <p className="text-aegeanBlue font-medium">
                Consulting with {currentPhilosopher.charAt(0).toUpperCase() + currentPhilosopher.slice(1)}...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default JournalPage;