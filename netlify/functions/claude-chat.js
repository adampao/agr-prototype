const axios = require('axios');
// Import the persona system
let personas;
let getPrompt;

try {
  // Try to import the new persona system
  const personasModule = require('../../src/personas');
  personas = personasModule.default;
  getPrompt = personasModule.getPrompt;
  } catch (error) {
  console.log("Could not import persona system:", error.message);
}

// Also import the legacy data as fallback
const { PHILOSOPHER_DATA } = require('../../src/services/aiApi');

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  try {
    // Parse the incoming request body
    const requestBody = JSON.parse(event.body);
    const { 
      prompt, 
      philosopherId, 
      previousMessages = [], 
      userContext = "", 
      context = "chat",
      userTokenUsage,
      tokenLimit
    } = requestBody;
    
    if (!prompt || !philosopherId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required parameters" })
      };
    }
    
    // Check token limit if provided
    if (tokenLimit && userTokenUsage && userTokenUsage.dailyUsed >= tokenLimit) {
      return {
        statusCode: 429,
        body: JSON.stringify({ 
          error: "Token limit reached", 
          message: "You've reached your daily token limit. Please complete the feedback form to gain more access."
        })
      };
    }
    
    let systemPrompt;
    
    // First try to use the new persona system
    if (getPrompt) {
      try {
        systemPrompt = getPrompt(philosopherId, context, userContext);
      } catch (error) {
        console.log(`Error getting prompt from persona system: ${error.message}`);
        systemPrompt = null;
      }
    }
    
    // Fall back to the legacy system if needed
    if (!systemPrompt) {
      
      
      // Get the time period and knowledge boundaries for the selected philosopher
      const timePeriod = PHILOSOPHER_DATA.timePeriods[philosopherId] || 'ancient Greece';
      const boundaries = PHILOSOPHER_DATA.knowledgeBoundaries[philosopherId] || { laterPhilosophers: [], keyEvents: [] };
      const expertise = PHILOSOPHER_DATA.philosopherExpertise[philosopherId] || {};
      
      // Build the historical context using the shared utility function
      const historicalContext = PHILOSOPHER_DATA.buildHistoricalContext(
        philosopherId, 
        timePeriod, 
        boundaries, 
        expertise, 
        userContext
      );
      
      // Get the base persona from shared data
      const basePrompt = PHILOSOPHER_DATA.philosopherBasePersonas[philosopherId] || 
        "You are an ancient Greek philosopher having a thoughtful dialogue with the user.";
        
      // Claude-specific prompt assembly - add philosophy-specific enhancements if needed
      systemPrompt = basePrompt + historicalContext;
    }
          
    // Format the conversation history for Claude API
    // The system prompt needs to be a top-level parameter, not a message
    const messages = [
      ...previousMessages,
      { role: "user", content: prompt }
    ];
    
    // Log for debugging (removing sensitive data)
    console.log('Making request to Claude API with params:', { 
      model: 'claude-3-haiku-20240307',
      hasApiKey: !!process.env.ANTHROPIC_API_KEY,
      messageCount: messages.length
    });
    
    // Make request to Claude API
    // Try the specified model first, but have fallbacks in case that model isn't available
    let model = 'claude-3-haiku-20240307';
    
    // Fallback models in order of preference
    const fallbackModels = [
      'claude-3-haiku-20240307',
      'claude-3-haiku',
      'claude-3-sonnet-20240229',
      'claude-3-opus-20240229',
      'claude-instant-1.2'
    ];
    
    let response = null;
    let lastError = null;
    
    // Try each model until one works
    for (const currentModel of fallbackModels) {
      try {               
        response = await axios.post('https://api.anthropic.com/v1/messages', {
          model: currentModel,
          max_tokens: 1000,
          system: systemPrompt,
          messages: messages
        }, {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01'
          },
          timeout: 30000 // 30 second timeout
        });
        
        // If we get here, the request succeeded        
        break;
      } catch (err) {
        console.log(`Failed with model ${currentModel}: ${err.message}`);
        lastError = err;
        
        // If this is anything other than a model availability issue, break the loop
        if (err.response?.data?.error?.type !== 'model_not_found' && 
            !err.message.includes('model') && 
            !err.message.toLowerCase().includes('not found')) {
          break;
        }
      }
    }
    
    // If we still have no response, throw the last error to be caught by the outer try/catch
    if (!response) {
      throw lastError || new Error('All model attempts failed');
    }
    
    // Use the successful response
    const claudeResponse = response;
    
    // Return Claude's response
    return {
      statusCode: 200,
      body: JSON.stringify({
        response: claudeResponse.data.content[0].text,
        philosopherId
      })
    };
    
  } catch (error) {
    console.error('Error calling Claude API:', error);
    
    // Enhanced error logging for debugging
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      response: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      } : 'No response data',
      apiKey: process.env.ANTHROPIC_API_KEY ? 'API key exists (not showing for security)' : 'API key is missing'
    };
    
    console.error('Detailed error:', JSON.stringify(errorDetails, null, 2));
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Failed to get response from Claude",
        details: error.message,
        hint: error.response?.data?.error?.message || "Check if your API key is correctly set in Netlify environment variables"
      })
    };
  }
};