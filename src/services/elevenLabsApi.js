// Simplified text preprocessing without SSML
const preprocessText = (text) => {
  // Just remove text within asterisks - no SSML tags
  let processedText = text.replace(/\*([^*]+)\*/g, ' ');
  
  // Clean up any duplicate spaces
  processedText = processedText.replace(/\s+/g, ' ');
  
  return processedText;
};

// Split text into chunks at natural break points
const splitIntoChunks = (text, maxChunkSize = 500) => {
  // If text is already short enough, return it as a single chunk
  if (text.length <= maxChunkSize) {
    return [text];
  }
  
  const chunks = [];
  let remainingText = text;
  
  while (remainingText.length > 0) {
    // Try to find sentence boundaries for natural splits
    let chunkSize = Math.min(maxChunkSize, remainingText.length);
    
    // If we need to break the text...
    if (chunkSize < remainingText.length) {
      // Look for the last sentence break within our limit
      // We'll check for periods, question marks, and exclamation points
      // followed by a space or end of text
      let lastBreak = -1;
      
      // Look for sentence endings
      for (const endChar of ['. ', '? ', '! ', '.\n', '?\n', '!\n']) {
        const lastIndex = remainingText.lastIndexOf(endChar, chunkSize);
        if (lastIndex > lastBreak) {
          lastBreak = lastIndex + endChar.length - 1; // Include the period but not the space
        }
      }
      
      // If we couldn't find a good break point, try paragraph breaks
      if (lastBreak === -1) {
        const lastParagraphBreak = remainingText.lastIndexOf('\n\n', chunkSize);
        if (lastParagraphBreak !== -1) {
          lastBreak = lastParagraphBreak + 1;
        }
      }
      
      // If we still couldn't find a break, just use a space
      if (lastBreak === -1) {
        const lastSpace = remainingText.lastIndexOf(' ', chunkSize);
        if (lastSpace !== -1) {
          lastBreak = lastSpace;
        } else {
          // If no good break found, just cut at the maximum size
          lastBreak = chunkSize - 1;
        }
      }
      
      // Extract this chunk and add it to our array
      const chunk = remainingText.substring(0, lastBreak + 1);
      chunks.push(chunk);
      
      // Update the remaining text
      remainingText = remainingText.substring(lastBreak + 1);
    } else {
      // Add the final piece
      chunks.push(remainingText);
      remainingText = '';
    }
  }
  
  return chunks;
};

// Process a single chunk of text
const processChunk = async (chunk, philosopherId) => {
  console.log(`Processing chunk (${chunk.length} chars): ${chunk.substring(0, 50)}...`);
  
  // Preprocess to handle asterisk content - NO SSML
  const processedText = preprocessText(chunk);
  
  // Try the API call
  try {
    const payload = {
      text: processedText,
      philosopherId
    };
    
    const response = await fetch('/.netlify/functions/text-to-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      let errorDetails = {};
      try {
        errorDetails = await response.json();
      } catch (e) {
        errorDetails = { error: response.statusText };
      }
      
      console.error("API error response:", errorDetails);
      
      if (response.status === 401) {
        throw new Error("Authentication failed: Please check your ElevenLabs API key");
      }
      
      throw new Error(`API error: ${response.statusText}`);
    }
    
    const responseData = await response.json();
    
    // Convert base64 to blob
    const byteCharacters = atob(responseData.audioData);
    const byteArrays = [];
    const sliceSize = 1024;
    
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      
      byteArrays.push(new Uint8Array(byteNumbers));
    }
    
    const blob = new Blob(byteArrays, { type: responseData.contentType || 'audio/mpeg' });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Error processing chunk:", error);
    throw error;
  }
};

// Main function to generate speech
export const generateSpeech = async (text, philosopherId) => {
  try {
    console.log("Generating speech for:", { text: text.substring(0, 50) + "...", philosopherId });
    
    // Split the text into manageable chunks (smaller chunks for more reliability)
    const chunks = splitIntoChunks(text, 500); // 500 char chunks
    console.log(`Split text into ${chunks.length} chunks`);
    
    if (chunks.length === 1) {
      // For single chunks, just process normally
      const audioUrl = await processChunk(chunks[0], philosopherId);
      console.log("Generated single audio URL:", audioUrl);
      return [audioUrl]; // Return as array for consistency
    } else {
      // For multiple chunks, process them sequentially and return all URLs
      console.log(`Processing ${chunks.length} chunks sequentially...`);
      
      // Process all chunks and collect their URLs
      const audioUrls = [];
      for (let i = 0; i < chunks.length; i++) {
        console.log(`Processing chunk ${i+1} of ${chunks.length}...`);
        
        try {
          const audioUrl = await processChunk(chunks[i], philosopherId);
          audioUrls.push(audioUrl);
          console.log(`Chunk ${i+1} processed successfully`);
        } catch (error) {
          console.error(`Error processing chunk ${i+1}:`, error);
          // Continue with other chunks even if one fails
        }
      }
      
      console.log(`Generated ${audioUrls.length} audio URLs`);
      return audioUrls;
    }
  } catch (error) {
    console.error('Speech generation error:', error);
    // Use fallback audio as a last resort
    return [getFallbackAudio(philosopherId)];
  }
};

// Fallback audio function - returns dummy audio URLs for testing without API
const getFallbackAudio = (philosopherId) => {
  console.log("Using fallback audio for", philosopherId);
  
  // Create a short beep sound
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Set different tones for different philosophers
  const tones = {
    socrates: 440, // A4
    aristotle: 392, // G4
    plato: 349, // F4
    heraclitus: 330, // E4
    pythagoras: 294, // D4
    xenophon: 262  // C4
  };
  
  oscillator.frequency.value = tones[philosopherId] || 440;
  oscillator.type = 'sine';
  
  gainNode.gain.value = 0.1;
  
  // Create a 1-second beep
  oscillator.start();
  setTimeout(() => {
    oscillator.stop();
  }, 500);
  
  // Return a mock audio URL
  return `data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQQAAAAAAA==`;
};