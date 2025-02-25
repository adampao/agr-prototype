import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Card from '../common/Card';
import Button from '../common/Button';

const JournalEntry = ({ entry, onSaveReflection }) => {
  const [reflection, setReflection] = useState('');
  const [isReflecting, setIsReflecting] = useState(false);
  
  const handleSaveReflection = () => {
    onSaveReflection(entry.id, reflection);
    setReflection('');
    setIsReflecting(false);
  };
  
  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card variant={entry.type === 'oracle' ? 'oracle' : 'philosophical'}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-serif font-semibold text-aegeanBlue">
              {entry.title}
            </h3>
            <p className="text-sm text-aegeanBlue/60">
              {format(new Date(entry.timestamp), 'MMMM d, yyyy • h:mm a')}
            </p>
          </div>
          <div className="flex space-x-2">
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
        </div>
        
        <div className="mb-4">
          <p className="text-aegeanBlue/90 whitespace-pre-line">
            {entry.content}
          </p>
        </div>
        
        {entry.aiInsight && (
          <div className={`p-4 rounded-md mb-4 ${
            entry.type === 'oracle' 
              ? 'bg-oracleGreen/10 border border-oracleGreen/20' 
              : 'bg-philosophicalPurple/10 border border-philosophicalPurple/20'
          }`}>
            <p className="text-sm italic">
              {entry.aiInsight}
            </p>
            <p className="text-right text-sm font-medium mt-2">
              — {entry.philosopher || 'The Oracle'}
            </p>
          </div>
        )}
        
        {entry.reflection && (
          <div className="p-4 bg-aegeanBlue/10 rounded-md mb-4">
            <h4 className="text-sm font-medium text-aegeanBlue mb-2">Your Reflection</h4>
            <p className="text-sm text-aegeanBlue/90">
              {entry.reflection}
            </p>
          </div>
        )}
        
        {isReflecting ? (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-aegeanBlue mb-2">Add Your Reflection</h4>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              className="w-full p-3 border border-aegeanBlue/20 rounded-md focus:outline-none focus:ring-2 focus:ring-aegeanBlue/50 bg-white text-aegeanBlue/90 min-h-[100px]"
              placeholder="What thoughts arise from this entry?"
            />
            <div className="flex justify-end space-x-2 mt-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsReflecting(false)}
              >
                Cancel
              </Button>
              <Button 
                size="sm"
                onClick={handleSaveReflection}
                disabled={!reflection.trim()}
              >
                Save Reflection
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsReflecting(true)}
              disabled={!!entry.reflection}
            >
              {entry.reflection ? 'Reflection Added' : 'Add Reflection'}
            </Button>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default JournalEntry;