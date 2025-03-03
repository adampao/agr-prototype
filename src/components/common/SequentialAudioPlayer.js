import React, { useState, useRef, useEffect } from 'react';

const SequentialAudioPlayer = ({ audioUrls, onEnded, autoPlay = false }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Simplified approach - directly manage our own audio loading and playback
  
  // Reset everything when URLs change
  useEffect(() => {
    // Reset state for new message
    setCurrentIndex(0);
    setIsPlaying(false);
    setIsLoaded(false);
    
    // Try to load the first segment if we have URLs
    if (audioUrls && audioUrls.length > 0 && audioRef.current) {
      audioRef.current.src = audioUrls[0];
      audioRef.current.load();
    }
  }, [audioUrls]);
  
  // Handle initial autoplay when audio is first loaded
  useEffect(() => {
    if (!audioRef.current || !audioUrls || audioUrls.length === 0) return;
    
    const handleCanPlay = () => {
      setIsLoaded(true);
      
      // Only auto-play on initial load if autoPlay is true
      if (autoPlay && currentIndex === 0 && !isPlaying) {
        setIsPlaying(true);
        audioRef.current.play().catch(err => {
          console.error("Autoplay failed:", err);
          setIsPlaying(false);
        });
      }
    };
    
    // Simple ended handler
    const handleEnded = () => {
      // If we have more segments
      if (currentIndex < audioUrls.length - 1) {
        // Move to next segment
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        setIsLoaded(false);
        
        // Load and play next segment
        audioRef.current.src = audioUrls[nextIndex];
        audioRef.current.load();
        // Next segment will autoplay because isPlaying is still true
      } else {
        // All segments complete - full stop
        setIsPlaying(false);
        if (onEnded) onEnded();
      }
    };
    
    // Set current segment and attach listeners
    audioRef.current.src = audioUrls[currentIndex];
    audioRef.current.volume = volume;
    audioRef.current.loop = false; // Never loop
    
    // Add event listeners
    audioRef.current.addEventListener('canplay', handleCanPlay);
    audioRef.current.addEventListener('ended', handleEnded);
    
    // Clean up
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('canplay', handleCanPlay);
        audioRef.current.removeEventListener('ended', handleEnded);
      }
    };
  }, [audioUrls, currentIndex, volume, autoPlay]);
  
  // Handle play/pause state
  useEffect(() => {
    if (!audioRef.current || !isLoaded) return;
    
    if (isPlaying) {
      // Start or resume playing
      audioRef.current.play().catch(err => {
        console.error("Play failed:", err);
        setIsPlaying(false);
      });
    } else {
      // Pause playback
      audioRef.current.pause();
    }
  }, [isPlaying, isLoaded]);
  
  // Simple play/pause toggle that always works
  const togglePlay = () => {
    setIsPlaying(prevState => !prevState);
  };
  
  // Volume change handler
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };
  
  // Don't render if no audio
  if (!audioUrls || audioUrls.length === 0) {
    return null;
  }
  
  return (
    <div className="flex items-center space-x-2 my-1">
      <button
        onClick={togglePlay}
        className="p-1 rounded-full hover:bg-aegeanBlue/10 transition-colors"
        title={isPlaying ? "Pause" : "Play"}
        disabled={!isLoaded}
      >
        {isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        )}
      </button>
      
      <div className="flex items-center space-x-1">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071a1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243a1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
        </svg>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={handleVolumeChange}
          className="w-16 h-1 bg-aegeanBlue/30 rounded-lg appearance-none cursor-pointer"
        />
      </div>
      
      {!isLoaded ? (
        <span className="text-xs text-gray-500 animate-pulse">Loading audio...</span>
      ) : (
        <span className="text-xs text-gray-500">
          {currentIndex + 1}/{audioUrls.length}
        </span>
      )}
      
      <audio
        ref={audioRef}
        className="hidden"
        preload="auto"
      />
    </div>
  );
};

export default SequentialAudioPlayer;