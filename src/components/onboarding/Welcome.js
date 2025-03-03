import React from 'react';
import { motion } from 'framer-motion';
import Button from '../common/Button';

const Welcome = ({ onContinue }) => {
  return (
    <motion.div 
      className="text-center max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-aegeanBlue mb-6">
        The Oikosystem
      </h1>
      
      <motion.p 
        className="text-xl text-aegeanBlue/80 mb-8 italic font-serif"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        "Ancient Wisdom meets Modern Intelligence"
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <p className="text-lg text-aegeanBlue/90 mb-12">
          Welcome to a journey of self-discovery and growth, guided by the timeless 
          wisdom of ancient Greece and enhanced by modern AI technology
          <br />
          - created by the AGR team.
        </p>
        
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 justify-center">
          <Button 
            onClick={onContinue} 
            size="lg"
          >
            Begin Your Journey
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => window.open('https://www.youtube.com/c/AncientGreeceRevisited', '_blank')}
          >
            Learn More About AGR
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Welcome;