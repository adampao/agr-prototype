import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Card from '../common/Card';
import Button from '../common/Button';
import { getPhilosophicalInsight } from '../../services/claudeApi';

const JournalEntry = ({ entry, onSaveReflection, onDelete, initiallyExpanded = false }) => {
  const [reflection, setReflection] = useState('');
  const [isReflecting, setIsReflecting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  
  const handleSaveReflection = () => {
    onSaveReflection(entry.id, reflection);
    setReflection('');
    setIsReflecting(false);
  };
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
      onDelete(entry.id);
    }
  };
  
  const handleAskAI = async () => {
    setIsLoading(true);
    try {
      const insight = await getPhilosophicalInsight(entry.content, entry.philosopher?.toLowerCase() || 'aristotle');
      setAiResponse(insight);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Generic error message
      setAiResponse("I seem to be contemplating too deeply. Perhaps we can discuss this another time.");
    } finally {
      setIsLoading(false);
    }
  };
  
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'MMMM d, yyyy • h:mm a');
  };
  
  return (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      layout
    >
      <Card variant={entry.type === 'oracle' ? 'oracle' : 'philosophical'}
      className="journal-paper">
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div>
            <h3 className="text-xl font-serif font-semibold text-aegeanBlue">
              {entry.title}
            </h3>
            <p className="text-sm text-aegeanBlue/60">
              {formatDate(entry.timestamp)}
            </p>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-aegeanBlue/50 hover:text-aegeanBlue relative z-20"
            >
              {isExpanded ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {entry.tags && entry.tags.map(tag => (
            <span 
              key={tag}
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                entry.type === 'oracle' 
                  ? 'bg-oracleGreen/20 text-oracleGreen' 
                  : 'bg-philosophicalPurple/20 text-philosophicalPurple'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="mb-4">
          <p className="journal-text">
            {entry.content}
          </p>
        </div>
        
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
           {entry.aiInsight && (
    <div className="philosopher-insight">
      <p className="text-sm">
        {entry.aiInsight}
      </p>
      <p className="text-right text-sm font-medium mt-2">
        — {entry.philosopher || 'The Oracle'}
      </p>
    </div>
  )}
            
            {entry.reflection && (
            <div className="p-4 bg-aegeanBlue/10 rounded-md mb-4 user-reflection">
            <h4 className="text-sm font-medium text-aegeanBlue mb-2">Your Reflection</h4>
            <p className="text-sm journal-text">
              {entry.reflection}
            </p>
          </div>
        )}
            
            {aiResponse && (
              <div className={`p-4 rounded-md mb-4 philosopher-insight ${
                entry.type === 'oracle' 
                  ? 'bg-oracleGreen/10 border border-oracleGreen/20' 
                  : 'bg-philosophicalPurple/10 border border-philosophicalPurple/20'
              }`}>
                <h4 className="text-sm font-medium text-aegeanBlue mb-2">Additional Insight</h4>
                <p className="text-sm italic">
                  {aiResponse}
                </p>
                <p className="text-right text-sm font-medium mt-2">
                  — {entry.philosopher || 'The Oracle'}
                </p>
              </div>
            )}
            
            {isReflecting ? (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-aegeanBlue mb-2">Add Your Reflection</h4>
                <textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  className="w-full p-3 border border-aegeanBlue/20 rounded-md focus:outline-none focus:ring-2 focus:ring-aegeanBlue/50 bg-white text-aegeanBlue/90 min-h-[100px] relative z-10"
                  placeholder="What thoughts arise from this entry?"
                />
                <div className="flex justify-end space-x-2 mt-2 relative z-10">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsReflecting(false)}
                    className="relative z-10"
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm"
                    onClick={handleSaveReflection}
                    disabled={!reflection.trim()}
                    className="relative z-10"
                  >
                    Save Reflection
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row justify-between mt-4 relative z-10 gap-3 sm:gap-0">
              <div className="flex flex-wrap gap-2 sm:space-x-2 relative z-10">
                {!entry.reflection && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsReflecting(true)}
                    className="relative z-10"
                  >
                    Add Reflection
                  </Button>
                )}
                
                {entry.reflection && !aiResponse && (
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={handleAskAI}
                    disabled={isLoading}
                    className="relative z-10"
                  >
                    {isLoading ? (
                      <>
                        <span className="animate-spin h-4 w-4 mr-2 border-2 border-aegeanBlue/30 border-t-aegeanBlue rounded-full"></span>
                        Thinking...
                      </>
                    ) : (
                      <>Ask for Insight</>
                    )}
                  </Button>
                )}
              </div>
              
              <Button
                variant="danger"
                size="sm"
                onClick={handleDelete}
                className="relative z-10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Delete
              </Button>
            </div>
            )}
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};

export default JournalEntry;