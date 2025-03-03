import React, { useState, useEffect, useRef } from 'react';
import Button from '../common/Button';

const QuickCapture = ({ onSave, isLoading, philosopher = 'aristotle' }) => {
  const [entry, setEntry] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [entryType, setEntryType] = useState('reflection');
  const [countdown, setCountdown] = useState(null);
  const textareaRef = useRef(null);
  
  // Focus the textarea when the component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);
  
  // Speech recognition setup
  useEffect(() => {
    if (!isRecording) return;
    
    let recognition = null;
    
    // Check if browser supports the Web Speech API
    if ('webkitSpeechRecognition' in window) {
      recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onstart = () => {
        setIsRecording(true);
        setCountdown(15); // 15 second countdown
      };
      
      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        // Update the entry with the transcription
        setEntry(prevEntry => {
          const baseEntry = finalTranscript || prevEntry;
          return interimTranscript ? `${baseEntry} ${interimTranscript}` : baseEntry;
        });
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        setCountdown(null);
      };
      
      recognition.onend = () => {
        setIsRecording(false);
        setCountdown(null);
      };
      
      // Start recognition
      recognition.start();
      
      // Auto-stop after 15 seconds
      const countdownInterval = setInterval(() => {
        setCountdown(prevCount => {
          if (prevCount <= 1) {
            clearInterval(countdownInterval);
            recognition.stop();
            return null;
          }
          return prevCount - 1;
        });
      }, 1000);
      
      // Cleanup function
      return () => {
        if (recognition) {
          recognition.stop();
        }
        clearInterval(countdownInterval);
      };
    } else {
      // Fallback for browsers that don't support the Web Speech API
      alert('Voice input is not supported in this browser. Try Chrome or Edge.');
      setIsRecording(false);
      
      // Cleanup function
      return () => {
        setIsRecording(false);
      };
    }
  }, [isRecording]);
  
  const handleStartVoiceCapture = () => {
    setIsRecording(true);
  };
  
  const handleStopVoiceCapture = () => {
    setIsRecording(false);
  };
  
  const handleSubmit = () => {
    if (entry.trim()) {
      onSave(entry.trim(), entryType);
      setEntry('');
      setEntryType('reflection');
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Entry type selector */}
      <div className="flex flex-wrap gap-2 mb-2">
        <button
          onClick={() => setEntryType('reflection')}
          className={`px-3 py-1.5 text-sm rounded-full transition ${
            entryType === 'reflection'
              ? 'bg-aegeanBlue text-white'
              : 'bg-aegeanBlue/10 text-aegeanBlue hover:bg-aegeanBlue/20'
          }`}
        >
          Reflection
        </button>
        <button
          onClick={() => setEntryType('question')}
          className={`px-3 py-1.5 text-sm rounded-full transition ${
            entryType === 'question'
              ? 'bg-philosophicalPurple text-white'
              : 'bg-philosophicalPurple/10 text-philosophicalPurple hover:bg-philosophicalPurple/20'
          }`}
        >
          Question
        </button>
        <button
          onClick={() => setEntryType('insight')}
          className={`px-3 py-1.5 text-sm rounded-full transition ${
            entryType === 'insight'
              ? 'bg-oracleGreen text-white'
              : 'bg-oracleGreen/10 text-oracleGreen hover:bg-oracleGreen/20'
          }`}
        >
          Insight
        </button>
      </div>
      
      {/* Philosopher prompt */}
      <div className={`p-3 rounded-md text-sm italic ${
        philosopher === 'oracle' 
          ? 'bg-oracleGreen/10 text-oracleGreen/90' 
          : 'bg-philosophicalPurple/10 text-philosophicalPurple/90'
      }`}>
        {entryType === 'reflection' && (
          <p>What are you reflecting on today? {philosopher.charAt(0).toUpperCase() + philosopher.slice(1)} is listening...</p>
        )}
        {entryType === 'question' && (
          <p>What philosophical question is on your mind? {philosopher.charAt(0).toUpperCase() + philosopher.slice(1)} will consider it...</p>
        )}
        {entryType === 'insight' && (
          <p>What insight has occurred to you? {philosopher.charAt(0).toUpperCase() + philosopher.slice(1)} will respond with wisdom...</p>
        )}
      </div>
      
      {/* Text input area */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          className={`w-full p-4 border rounded-lg focus:ring-2 focus:outline-none transition min-h-[150px] ${
            isRecording
              ? 'border-oracleGreen focus:ring-oracleGreen' 
              : 'border-aegeanBlue/20 focus:ring-aegeanBlue/50'
          }`}
          placeholder={
            entryType === 'reflection' ? "What's been meaningful to you today?" :
            entryType === 'question' ? "What philosophical question is on your mind?" :
            "What insight has occurred to you?"
          }
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          disabled={isLoading}
        />
        
        {/* Voice recording indicator */}
        {isRecording && (
          <div className="absolute top-2 right-2 flex items-center space-x-2 bg-oracleGreen/90 text-white px-3 py-1 rounded-full text-sm">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
            <span>Recording... {countdown !== null ? countdown : ''}</span>
          </div>
        )}
      </div>
      
      {/* Action buttons */}
      <div className="flex justify-between">
        <div className="space-x-2">
          {!isRecording ? (
            <Button
              variant="outline"
              onClick={handleStartVoiceCapture}
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
              </svg>
              Voice Input
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={handleStopVoiceCapture}
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
              </svg>
              Stop Recording
            </Button>
          )}
        </div>
        
        <Button
          onClick={handleSubmit}
          disabled={!entry.trim() || isLoading}
        >
          {isLoading ? (
            <>
              <span className="animate-spin h-4 w-4 mr-2 border-2 border-white/30 border-t-white rounded-full"></span>
              Saving...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
              Save Entry
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default QuickCapture;