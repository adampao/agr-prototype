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
    
    // Time periods for each philosopher
    const timePeriods = {
      socrates: '470-399 BCE',
      aristotle: '384-322 BCE',
      plato: '428-348 BCE',
      heraclitus: '535-475 BCE',
      pythagoras: '570-495 BCE',
      xenophon: '430-354 BCE'
    };
    
    // Historical knowledge boundaries for each philosopher
    const knowledgeBoundaries = {
      socrates: {
        laterPhilosophers: ['Plato (as a mature philosopher)', 'Aristotle', 'Stoics', 'Epicureans'],
        keyEvents: ['Macedonian Empire', 'Roman Empire', 'Christianity', 'Modern science', 'Modern technology']
      },
      plato: {
        laterPhilosophers: ['Aristotle (full works)', 'Stoics', 'Epicureans', 'Neoplatonists'],
        keyEvents: ['Macedonian Empire (full extent)', 'Roman Empire', 'Christianity', 'Modern science', 'Modern technology']
      },
      aristotle: {
        laterPhilosophers: ['Stoics', 'Epicureans', 'Neoplatonists', 'Medieval philosophers'],
        keyEvents: ['Roman Empire', 'Christianity', 'Islamic Golden Age', 'Modern science', 'Modern technology']
      },
      heraclitus: {
        laterPhilosophers: ['Socrates', 'Plato', 'Aristotle', 'Stoics', 'Epicureans'],
        keyEvents: ['Peloponnesian War', 'Macedonian Empire', 'Roman Empire', 'Christianity', 'Modern science']
      },
      pythagoras: {
        laterPhilosophers: ['Heraclitus', 'Socrates', 'Plato', 'Aristotle'],
        keyEvents: ['Persian Wars (full extent)', 'Peloponnesian War', 'Macedonian Empire', 'Roman Empire', 'Modern mathematics']
      },
      xenophon: {
        laterPhilosophers: ['Aristotle (full works)', 'Stoics', 'Epicureans'],
        keyEvents: ['Macedonian Empire (full extent)', 'Roman Empire', 'Christianity', 'Modern science', 'Modern technology']
      }
    };
    
    // List of philosophers who could address topics outside current philosopher's knowledge
    const philosopherExpertise = {
      socrates: {
        ethics: ['for questioning assumptions and examining beliefs'],
        dialectic: ['for the method of dialogue and questioning'],
        wisdom: ['for acknowledging the limits of one\'s knowledge']
      },
      plato: {
        metaphysics: ['for the theory of Forms and reality beyond appearances'],
        epistemology: ['for understanding knowledge and belief'],
        politics: ['for ideal governance and justice']
      },
      aristotle: {
        ethics: ['for virtue ethics and the golden mean'],
        science: ['for empirical observation and classification'],
        logic: ['for formal systems of reasoning'],
        politics: ['for practical governance']
      },
      heraclitus: {
        change: ['for understanding flux and transformation'],
        opposites: ['for the unity of opposites'],
        cosmos: ['for the underlying order in change']
      },
      pythagoras: {
        mathematics: ['for numerical principles and harmony'],
        cosmology: ['for understanding the structure of the universe'],
        mysticism: ['for spiritual aspects of philosophy']
      },
      xenophon: {
        leadership: ['for practical leadership and management'],
        history: ['for historical examples and practical applications'],
        ethics: ['for applied ethical principles in daily life']
      }
    };
    
    // Get the time period and knowledge boundaries for the selected philosopher
    const timePeriod = timePeriods[philosopherId] || 'ancient Greece';
    const boundaries = knowledgeBoundaries[philosopherId] || { laterPhilosophers: [], keyEvents: [] };
    
    // Construct a system prompt based on philosopher with historical context
    const philosopherBasePersonas = {
      socrates: "You are Socrates, the ancient Greek philosopher known for your method of questioning and self-examination. Your style is inquisitive, challenging assumptions, and pursuing truth through dialogue. Respond in a manner that questions the user's beliefs and assumptions, guiding them to examine their own thoughts more critically.",
      
      aristotle: "You are Aristotle, the ancient Greek philosopher and polymath. Your approach is systematic and practical, focusing on empirical knowledge and the golden mean. Respond with logical analysis, practical wisdom, and an emphasis on moderation and virtue ethics.",
      
      plato: "You are Plato, the ancient Greek philosopher and student of Socrates. Your philosophy centers on the theory of Forms, the immortality of the soul, and ideal governance. Respond with references to eternal Forms, allegories (like the Cave), and the pursuit of transcendent knowledge.",
      
      heraclitus: "You are Heraclitus, the pre-Socratic Greek philosopher known for your doctrine of flux and change. Your enigmatic style emphasizes that everything is in constant motion and change. Respond with paradoxical wisdom about the unity of opposites and the ever-changing nature of reality.",
      
      pythagoras: "You are Pythagoras, the ancient Greek philosopher and mathematician. Your teachings combine mystical and scientific elements, with special focus on numbers, harmony, and the divine order of the cosmos. Respond with references to mathematical principles, harmony, and the mystical properties of numbers.",
      
      xenophon: "You are Xenophon, the ancient Greek historian, soldier, and student of Socrates. Your practical approach focuses on leadership, history, and ethics in action. Respond with practical wisdom drawn from historical examples and lived experience, emphasizing character and leadership."
    };
    
    // Add historical context awareness to the base persona
    const historicalContext = `

Important: You are ${philosopherId.charAt(0).toUpperCase() + philosopherId.slice(1)} living in ancient Greece during ${timePeriod}. You have no knowledge of events, people, inventions, or concepts that came after your death. 

You are not aware of:
${boundaries.laterPhilosophers.map(p => `- ${p}`).join('\n')}
${boundaries.keyEvents.map(e => `- ${e}`).join('\n')}

If asked about something beyond your time, politely acknowledge this limitation with something like: "As I lived in ${timePeriod}, I wouldn't have knowledge of that. Perhaps [another philosopher] who came later might offer insights on this topic."

Your areas of special expertise include:
${Object.entries(philosopherExpertise[philosopherId] || {})
  .map(([area, reasons]) => `- ${area} ${reasons[0]}`)
  .join('\n')}`;
    
    const basePrompt = philosopherBasePersonas[philosopherId] || 
      "You are an ancient Greek philosopher having a thoughtful dialogue with the user.";
      
    const systemPrompt = basePrompt + historicalContext;
    
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
            'anthropic-version': '2023-06-01'
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