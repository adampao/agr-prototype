const axios = require('axios');

exports.handler = async function(event, context) {
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { text, philosopherId } = JSON.parse(event.body);
    
    // Map of philosopher IDs to voice IDs (kept server-side for security)
    const philosopherVoiceMap = {
      socrates: 'your_socrates_voice_id',
      aristotle: 'your_aristotle_voice_id',
      // ...other philosophers
    };
    
    const voiceId = philosopherVoiceMap[philosopherId];
    if (!voiceId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: `No voice ID for philosopher: ${philosopherId}` })
      };
    }

    // Call ElevenLabs API (server-side with secure API key)
    const response = await axios({
      method: 'POST',
      url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY // Stored as environment variable
      },
      data: {
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      },
      responseType: 'arraybuffer' // Important for binary audio data
    });

    // Return the audio data
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'audio/mpeg'
      },
      body: Buffer.from(response.data).toString('base64'),
      isBase64Encoded: true
    };
  } catch (error) {
    console.log('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate speech' })
    };
  }
};