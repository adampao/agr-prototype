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
    const messages = [
      { role: "system", content: systemPrompt },
      ...previousMessages,
      { role: "user", content: prompt }
    ];
    
    // Make request to Claude API
    const claudeResponse = await axios.post('https://api.anthropic.com/v1/messages', {
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      messages: messages
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      }
    });
    
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
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Failed to get response from Claude",
        details: error.message
      })
    };
  }
};