import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../common/Card';
import Button from '../common/Button';

const reasons = [
  { id: 'learning', label: 'Learning about ancient wisdom', icon: '📚' },
  { id: 'personal-growth', label: 'Personal growth and self-reflection', icon: '🌱' },
  { id: 'professional', label: 'Professional development', icon: '💼' },
  { id: 'philosophical', label: 'Philosophical interests and discussions', icon: '🧠' },
  { id: 'life-challenges', label: 'Guidance for life challenges', icon: '🛤️' },
  { id: 'curiosity', label: 'General curiosity', icon: '🔍' },
];

const OracleQuestion = ({ onContinue }) => {
  const [selectedReason, setSelectedReason] = useState(null);
  
  const handleContinue = () => {
    if (selectedReason) {
      onContinue(selectedReason);
    }
  };

  return (
    <motion.div 
      className="max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl font-serif font-bold text-aegeanBlue mb-4">
          The Oracle's First Question
        </h2>
        <p className="text-lg text-aegeanBlue/80">
          What brings you to seek ancient wisdom today?
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reasons.map((reason, index) => (
          <motion.div
            key={reason.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Card 
              variant={selectedReason === reason.id ? 'oracle' : 'interactive'}
              className={`transition-all duration-200 ${selectedReason === reason.id ? 'ring-2 ring-oracleGreen' : ''}`}
              onClick={() => setSelectedReason(reason.id)}
            >
              <div className="flex items-center">
                <span className="text-3xl mr-4">{reason.icon}</span>
                <span className="text-lg">{reason.label}</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <Button 
          onClick={handleContinue} 
          disabled={!selectedReason}
          size="lg"
        >
          Continue
        </Button>
      </div>
    </motion.div>
  );
};

export default OracleQuestion;