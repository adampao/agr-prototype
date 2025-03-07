const { OpenAI } = require('openai');

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
      context = "debate",
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
        
      // OpenAI-specific prompt assembly
      systemPrompt = basePrompt + historicalContext;
    }
    
       
     // Check if OpenAI API key is set
     if (!process.env.OPENAI_API_KEY) {
       console.error('OpenAI API key is missing');
       return {
         statusCode: 500,
         body: JSON.stringify({ 
           error: "Failed to get response from OpenAI",
           details: "OpenAI API key is missing",
           hint: "Make sure to set your OpenAI API key in the .env file or Netlify environment variables"
         })
       };
     }
     
     // Initialize OpenAI client
     const openai = new OpenAI({
       apiKey: process.env.OPENAI_API_KEY
     });
    
    // Format messages for OpenAI (different from Claude format)
    const messages = [
      { role: "system", content: systemPrompt },
      ...previousMessages.map(msg => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content
      })),
      { role: "user", content: prompt }
    ];
    
    console.log('Making request to OpenAI API with params:', { 
      model: 'o3-mini-2025-01-31',
      hasApiKey: !!process.env.OPENAI_API_KEY,
      messageCount: messages.length
    });
           
    // Make request to OpenAI API
    const response = await openai.chat.completions.create({
      model: "o3-mini-2025-01-31", // Use your preferred model
      messages: messages,
      max_completion_tokens: 800,
    });
    
    // Return OpenAI's response in the same format as Claude's
    return {
      statusCode: 200,
      body: JSON.stringify({
        response: response.choices[0].message.content,
        philosopherId
      })
    };
    
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    
    // Enhanced error logging for debugging (similar to claude-chat.js)
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      response: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      } : 'No response data',
      apiKey: process.env.OPENAI_API_KEY ? 'API key exists (not showing for security)' : 'API key is missing'
    };
    
    console.error('Detailed error:', JSON.stringify(errorDetails, null, 2));
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Failed to get response from OpenAI",
        details: error.message,
        hint: error.response?.data?.error?.message || "Check if your API key is correctly set in Netlify environment variables"
      })
    };
  }
};
        
       