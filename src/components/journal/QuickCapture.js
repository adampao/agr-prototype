import React, { useState } from 'react';

const QuickCapture = ({ onSave }) => {
  const [entry, setEntry] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = () => {
    if (entry.trim()) {
      onSave(entry);
      setEntry('');
    }
  };

  const startVoiceCapture = () => {
    // Simulate voice recording
    setIsRecording(true);
    
    // In a real app, this would use the Web Speech API
    setTimeout(() => {
      setIsRecording(false);
      setEntry('Voice input captured: Reflecting on today\'s challenges with patience.');
    }, 2000);
  };

  return (
    <div className="quick-capture-container p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-2">Capture Your Thoughts</h3>
      
      <textarea
        className="w-full p-3 border rounded-md mb-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="What's on your mind? (10-15 seconds)"
        rows={3}
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
      />
      
      <div className="flex gap-2">
        <button
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          onClick={startVoiceCapture}
          disabled={isRecording}
        >
          {isRecording ? 'Recording...' : 'Voice Input'}
        </button>
        
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex-grow"
          onClick={handleSubmit}
          disabled={!entry.trim()}
        >
          Capture
        </button>
      </div>
    </div>
  );
};

export default QuickCapture;