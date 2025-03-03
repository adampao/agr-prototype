const axios = require('axios');

exports.handler = async function(event, context) {
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Check if API key is configured
    const apiKey = process.env.ELEVENLABS_API_KEY;
    
    if (!apiKey) {
      console.error('ELEVENLABS_API_KEY is not set in environment variables');
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'API configuration error',
          hint: 'The ElevenLabs API key is missing. Please set the ELEVENLABS_API_KEY environment variable.'
        })
      };
    }

    // Parse request body
    let requestBody;
    try {
      requestBody = JSON.parse(event.body);
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid JSON in request body' })
      };
    }
    
    const { text, philosopherId, useSSML } = requestBody;
    
    // Validate required parameters
    if (!text || !philosopherId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required parameters: text and philosopherId' })
      };
    }
    
    // Map of philosopher IDs to voice IDs
    const philosopherVoiceMap = {
      socrates: "LysucvtFmzi1NVAE0rKp",
      aristotle: "asDeXBMC8hUkhqqL7agO", 
      plato: "DzcRs71mIqvZ5truEdVC",    
      heraclitus: "D06pMr3Hh2Q3cWozbkFp", 
      pythagoras: "7rBKQ2u3bcnWvvogpbSm", 
      xenophon: "7p1Ofvcwsv7UBPoFNcpI"   
    };
    
    const voiceId = philosopherVoiceMap[philosopherId];
    if (!voiceId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: `No voice ID for philosopher: ${philosopherId}` })
      };
    }

    console.log(`Sending request to ElevenLabs for philosopher ${philosopherId} (voice ${voiceId})`);
    
    // For debugging - log a masked version of the API key
    const maskedKey = apiKey.substring(0, 4) + '...' + apiKey.substring(apiKey.length - 4);
    console.log(`Using API key: ${maskedKey}`);
    
    // Check if text is SSML
    const isSSML = useSSML && text.startsWith('<speak>') && text.endsWith('</speak>');
    console.log(`Text ${isSSML ? 'contains' : 'does not contain'} SSML markup`);
    
    // Request data with or without SSML
    const requestData = {
      text: text,
      model_id: 'eleven_monolingual_v1',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75
      }
    };
    
    // Add text_type for SSML if applicable
    if (isSSML) {
      requestData.text_type = 'ssml';
    }
    
    // Make request to ElevenLabs
    try {
      const response = await axios({
        method: 'POST',
        url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
          'Accept': 'audio/mpeg'
        },
        data: requestData,
        responseType: 'arraybuffer'
      });
      
      console.log('ElevenLabs response received:', {
        status: response.status,
        contentType: response.headers['content-type'],
        dataLength: response.data ? response.data.length : 0
      });
      
      // Return the audio data as base64 with content-type
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        },
        body: JSON.stringify({
          audioData: Buffer.from(response.data).toString('base64'),
          contentType: response.headers['content-type'] || 'audio/mpeg'
        })
      };
      
    } catch (apiError) {
      // Handle different error types
      if (apiError.response) {
        // The API responded with a non-2xx status
        const status = apiError.response.status;
        let errorMessage = 'ElevenLabs API error';
        let hint = '';
        
        if (status === 401) {
          errorMessage = 'Authentication failed';
          hint = 'Please check your ElevenLabs API key.';
        } else if (status === 429) {
          errorMessage = 'Rate limit exceeded';
          hint = 'Your ElevenLabs account has reached its usage limit.';
        } else if (status >= 500) {
          errorMessage = 'ElevenLabs server error';
          hint = 'The speech service is currently experiencing issues. Please try again later.';
        }
        
        return {
          statusCode: status,
          body: JSON.stringify({
            error: errorMessage,
            hint: hint,
            details: {
              status: status,
              message: apiError.message
            }
          })
        };
      } else {
        // Network error or other issues
        return {
          statusCode: 500,
          body: JSON.stringify({
            error: 'Failed to connect to ElevenLabs',
            hint: 'There was a network issue connecting to the speech service.',
            details: apiError.message
          })
        };
      }
    }
    
  } catch (error) {
    console.error('Full error details:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to generate speech',
        hint: 'An unexpected error occurred in the speech generation service.',
        details: error.message
      })
    };
  }
};