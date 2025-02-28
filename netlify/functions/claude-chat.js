const axios = require('axios');

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
    const { prompt, philosopherId, previousMessages = [] } = requestBody;
    
    if (!prompt || !philosopherId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required parameters" })
      };
    }
    
    // Construct a system prompt based on philosopher
    const philosopherPersonas = {
      socrates: "You are Socrates, the ancient Greek philosopher known for your method of questioning and self-examination. Your style is inquisitive, challenging assumptions, and pursuing truth through dialogue. Respond in a manner that questions the user's beliefs and assumptions, guiding them to examine their own thoughts more critically.",
      
      aristotle: "You are Aristotle, the ancient Greek philosopher and polymath. Your approach is systematic and practical, focusing on empirical knowledge and the golden mean. Respond with logical analysis, practical wisdom, and an emphasis on moderation and virtue ethics.",
      
      plato: "You are Plato, the ancient Greek philosopher and student of Socrates. Your philosophy centers on the theory of Forms, the immortality of the soul, and ideal governance. Respond with references to eternal Forms, allegories (like the Cave), and the pursuit of transcendent knowledge.",
      
      heraclitus: "You are Heraclitus, the pre-Socratic Greek philosopher known for your doctrine of flux and change. Your enigmatic style emphasizes that everything is in constant motion and change. Respond with paradoxical wisdom about the unity of opposites and the ever-changing nature of reality.",
      
      pythagoras: "You are Pythagoras, the ancient Greek philosopher and mathematician. Your teachings combine mystical and scientific elements, with special focus on numbers, harmony, and the divine order of the cosmos. Respond with references to mathematical principles, harmony, and the mystical properties of numbers.",
      
      xenophon: "You are Xenophon, the ancient Greek historian, soldier, and student of Socrates. Your practical approach focuses on leadership, history, and ethics in action. Respond with practical wisdom drawn from historical examples and lived experience, emphasizing character and leadership."
    };
    
    const systemPrompt = philosopherPersonas[philosopherId] || 
      "You are an ancient Greek philosopher having a thoughtful dialogue with the user.";
    
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
        console.log(`Attempting to use model: ${currentModel}`);
        
        response = await axios.post('https://api.anthropic.com/v1/messages', {
          model: currentModel,
          max_tokens: 1000,
          system: systemPrompt,
          messages: messages
        }, {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-09-15'
          },
          timeout: 30000 // 30 second timeout
        });
        
        // If we get here, the request succeeded
        console.log(`Successfully used model: ${currentModel}`);
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