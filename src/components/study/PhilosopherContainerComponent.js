// PhilosopherContainer.jsx
import React, { useState } from 'react';
import PhilosopherChat from './PhilosopherChat';
import philosopherExpertise from './philosopherExpertise';

const PhilosopherContainer = () => {
  // State to track the currently selected philosopher
  const [currentPhilosopher, setCurrentPhilosopher] = useState('Socrates');
  
  // Function to handle switching philosophers
  const handleSwitchPhilosopher = (newPhilosopher) => {
    if (philosopherExpertise[newPhilosopher]) {
      setCurrentPhilosopher(newPhilosopher);
    }
  };
  
  return (
    <div className="flex flex-col h-screen bg-MARBLE_WHITE">
      <header className="bg-AEGEAN_BLUE text-white p-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Ancient Greece Revisited</h1>
          <p className="text-sm">Currently speaking with: {currentPhilosopher}</p>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar with philosopher options */}
        <div className="w-64 bg-gray-100 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4 text-AEGEAN_BLUE">Choose a Philosopher</h2>
          
          <div className="space-y-2">
            {Object.keys(philosopherExpertise).map((philosopher) => (
              <button
                key={philosopher}
                onClick={() => handleSwitchPhilosopher(philosopher)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  currentPhilosopher === philosopher
                    ? 'bg-AEGEAN_BLUE text-white'
                    : 'bg-white hover:bg-gray-200'
                }`}
              >
                <div className="font-medium">{philosopher}</div>
                <div className="text-xs mt-1">
                  {philosopherExpertise[philosopher].description}
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Main chat area */}
        <div className="flex-1 overflow-hidden">
          <PhilosopherChat
            currentPhilosopher={currentPhilosopher}
            onSwitchPhilosopher={handleSwitchPhilosopher}
          />
        </div>
      </div>
    </div>
  );
};

export default PhilosopherContainer;