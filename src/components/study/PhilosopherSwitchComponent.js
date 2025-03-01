// PhilosopherSwitchComponent.jsx

import React from 'react';

const PhilosopherSwitch = ({ 
  isVisible, 
  suggestedPhilosopher, 
  currentPhilosopher,
  reason,
  onAccept, 
  onDecline 
}) => {
  // If the component shouldn't be visible or we're missing required props, don't render anything
  if (!isVisible || !suggestedPhilosopher || !currentPhilosopher) return null;
  
  console.log("Rendering switch component with:", { suggestedPhilosopher, currentPhilosopher, reason });
  
  return (
    <div className="bg-marbleWhite border-l-4 border-oliveGold p-4 mb-4 rounded shadow-md">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-6 w-6 text-philosophicalPurple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-aegeanBlue font-medium">
            {currentPhilosopher} suggests:
          </p>
          <p className="mt-1 text-sm text-gray-700">
            This inquiry seems to venture into territory where {suggestedPhilosopher} has greater expertise.
          </p>
          {reason && (
            <p className="mt-1 text-sm italic text-gray-600">
              "{reason}"
            </p>
          )}
          <p className="mt-2 text-sm text-gray-700">
            Would you like to continue this discussion with {suggestedPhilosopher}?
          </p>
          <div className="mt-3 flex">
            <button
              onClick={onAccept}
              className="bg-oliveGold hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded mr-2 text-sm transition-colors"
            >
              Yes, switch to {suggestedPhilosopher}
            </button>
            <button
              onClick={onDecline}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-3 rounded text-sm transition-colors"
            >
              No, continue with {currentPhilosopher}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhilosopherSwitch;