// src/services/elevenLabsApi.js
export const generateSpeech = async (text, philosopherId) => {
  try {
    // Call your secure backend function instead of ElevenLabs directly
    const response = await fetch('/.netlify/functions/text-to-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text,
        philosopherId
      })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    const audioBlob = await response.blob();
    return URL.createObjectURL(audioBlob);
  } catch (error) {
    console.error('Error generating speech:', error);
    throw error;
  }
};