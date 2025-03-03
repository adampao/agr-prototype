import React, { useState, useRef, useEffect } from 'react';

const AudioPlayer = ({ audioUrl, onEnded, autoPlay = false }) => {
  console.log("AudioPlayer component rendering with URL:", audioUrl);
  
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isReady, setIsReady] = useState(false);
  const [playAttempts, setPlayAttempts] = useState(0);
  
  // Check when component mounts or URL changes
  useEffect(() => {
    console.log(`AudioPlayer useEffect for URL: ${audioUrl?.substring(0, 30)}...`);
    if (!audioUrl) {
      console.log("No audio URL provided to AudioPlayer");
      return;
    }
    
    // Reset state when URL changes
    setIsPlaying(false);
    setIsReady(false);
    
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.load();
    }
  }, [audioUrl]);
  
  // Set up event listeners
  useEffect(() => {
    if (!audioRef.current || !audioUrl) return;
    
    const handleCanPlay = () => {
      console.log("🎵 Audio can play now!");
      setIsReady(true);
      
      if (autoPlay) {
        console.log("Attempting autoplay...");
        playAudio();
      }
    };
    
    const handleError = (e) => {
      console.error("❌ Audio error:", e);
      if (audioRef.current?.error) {
        console.error(
          "Error details:",
          audioRef.current.error.code,
          audioRef.current.error.message
        );
      }
    };
    
    const handleEnded = () => {
      console.log("Audio playback ended");
      setIsPlaying(false);
      if (onEnded) onEnded();
    };
    
    // Add event listeners
    audioRef.current.addEventListener('canplay', handleCanPlay);
    audioRef.current.addEventListener('error', handleError);
    audioRef.current.addEventListener('ended', handleEnded);
    
    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('canplay', handleCanPlay);
        audioRef.current.removeEventListener('error', handleError);
        audioRef.current.removeEventListener('ended', handleEnded);
      }
    };
  }, [audioUrl, autoPlay, onEnded]);
  
  // Handle play state changes
  useEffect(() => {
    if (!audioRef.current || !isReady) return;
    
    if (isPlaying) {
      playAudio();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, isReady]);
  
  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  
  // Function to play audio with retry logic
  const playAudio = () => {
    if (!audioRef.current || !audioUrl) {
      console.error("Cannot play: No audio element or URL");
      return;
    }
    
    setPlayAttempts(prev => prev + 1);
    
    console.log(`Attempting to play audio (attempt ${playAttempts + 1})...`);
    const playPromise = audioRef.current.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log("✅ Audio playback started successfully!");
          setIsPlaying(true);
        })
        .catch(err => {
          console.error("❌ Play error:", err);
          setIsPlaying(false);
          
          // Auto-retry once after a user interaction
          if (playAttempts < 1) {
            console.log("Trying again after a short delay...");
            setTimeout(playAudio, 500);
          }
        });
    }
  };
  
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      playAudio();
    }
  };
  
  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };
  
  return (
    <div className="flex items-center space-x-2 my-1">
      <button
        onClick={togglePlay}
        className="p-1 rounded-full hover:bg-aegeanBlue/10 transition-colors"
        title={isPlaying ? "Pause" : "Play"}
        disabled={!audioUrl || !isReady}
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
          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
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
      
      {!isReady && audioUrl && (
        <span className="text-xs text-gray-500 animate-pulse">Loading audio...</span>
      )}
      
      <audio
        ref={audioRef}
        className="hidden"
        preload="auto"
      />
    </div>
  );
};

export default AudioPlayer;