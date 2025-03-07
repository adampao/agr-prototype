// services/aiApi.js
import axios from 'axios';
import { getPrompt, getPersona } from '../personas';

export const API_PROVIDERS = {
  CLAUDE: 'claude',
  OPENAI: 'openai'
};

// Shared philosopher data for prompt engineering
export const PHILOSOPHER_DATA = {
  // Time periods for each philosopher
  timePeriods: {
    socrates: '470-399 BCE',
    aristotle: '384-322 BCE',
    plato: '428-348 BCE',
    heraclitus: '535-475 BCE',
    pythagoras: '570-495 BCE',
    xenophon: '430-354 BCE'
  },
  
  // Historical knowledge boundaries for each philosopher
  knowledgeBoundaries: {
    socrates: {
      laterPhilosophers: ['Plato (as a mature philosopher)', 'Aristotle', 'Stoics', 'Epicureans'],
      keyEvents: ['Macedonian Empire', 'Roman Empire', 'Christianity', 'Modern science', 'Modern technology', 'Modern religion']
    },
    plato: {
      laterPhilosophers: ['Aristotle (full works)', 'Stoics', 'Epicureans', 'Neoplatonists'],
      keyEvents: ['Macedonian Empire (full extent)', 'Roman Empire', 'Christianity', 'Modern science', 'Modern technology', 'Modern religion']
    },
    aristotle: {
      laterPhilosophers: ['Stoics', 'Epicureans', 'Neoplatonists', 'Medieval philosophers'],
      keyEvents: ['Roman Empire', 'Christianity', 'Islamic Golden Age', 'Modern science', 'Modern technology', 'Modern religion']
    },
    heraclitus: {
      laterPhilosophers: ['Socrates', 'Plato', 'Aristotle', 'Stoics', 'Epicureans'],
      keyEvents: ['Peloponnesian War', 'Macedonian Empire', 'Roman Empire', 'Christianity', 'Modern science', 'Modern religion']
    },
    pythagoras: {
      laterPhilosophers: ['Heraclitus', 'Socrates', 'Plato', 'Aristotle'],
      keyEvents: ['Persian Wars (full extent)', 'Peloponnesian War', 'Christianity', 'Macedonian Empire', 'Roman Empire', 'Modern mathematics', 'Modern religion']
    },
    xenophon: {
      laterPhilosophers: ['Aristotle (full works)', 'Stoics', 'Epicureans'],
      keyEvents: ['Macedonian Empire (full extent)', 'Roman Empire', 'Christianity', 'Modern science', 'Modern technology', 'Modern religion']
    }
  },
  
  // Each philosopher's areas of expertise and their defining characteristics
  philosopherExpertise: {
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
  },
  
  // Philosopher base personas for chat
  philosopherBasePersonas: {
       
    
  },
  
  // Build the historical context template (can be customized further in individual API files)
  buildHistoricalContext: (philosopherId, timePeriod, boundaries, expertise, userContext = "") => {
    return `
Important: You are ${philosopherId.charAt(0).toUpperCase() + philosopherId.slice(1)} living in ancient Greece during ${timePeriod}. You have no knowledge of events, people, inventions, or concepts that came after your death. 

You are not aware of:
${boundaries.laterPhilosophers.map(p => `- ${p}`).join('\n')}
${boundaries.keyEvents.map(e => `- ${e}`).join('\n')}

If asked about something beyond your time, politely acknowledge this limitation with something like: "As I lived in ${timePeriod}, I wouldn't have knowledge of that. Perhaps [another philosopher] who came later might offer insights on this topic."

Your areas of special expertise include:
${Object.entries(expertise || {})
  .map(([area, reasons]) => `- ${area} ${reasons[0]}`)
  .join('\n')}

${userContext ? `\nAdditional context: ${userContext}` : ''}`;
  }
};

// Feature-based API selection logic
const selectApiProvider = (feature, philosopherId) => {
  // Use OpenAI for the debate arena
  if (feature === 'debate') {
    return API_PROVIDERS.OPENAI;
  }
  
  // Use Claude for specific philosophers
  if (['socrates', 'plato'].includes(philosopherId)) {
    return API_PROVIDERS.CLAUDE;
  }
  
  // Default to Claude for other features
  return API_PROVIDERS.CLAUDE;
};

export const sendMessageToPhilosopher = async (
  philosopherId, 
  message, 
  previousMessages = [], 
  userContext = "",
  feature = 'chat' // 'chat', 'debate', etc.
) => {
  try {
    // Determine which API to use based on feature and philosopher
    const apiProvider = selectApiProvider(feature, philosopherId);
    
    console.log(`Using API provider: ${apiProvider} for feature: ${feature} with philosopher: ${philosopherId}`);
    
    // Get context-specific prompt from our persona system
    const persona = getPersona(philosopherId);
    const contextInfo = persona ? `Using ${feature} context from persona file` : 'Using legacy prompt system';
    console.log(`${contextInfo} for ${philosopherId}`);
    
    const endpoint = apiProvider === API_PROVIDERS.OPENAI 
      ? '/.netlify/functions/openai-chat'
      : '/.netlify/functions/claude-chat';
    
    // Add the context parameter to specify which type of prompt to use
    const response = await axios.post(endpoint, {
      prompt: message,
      philosopherId,
      previousMessages,
      userContext,
      context: feature // Pass the context to the serverless function
    });
    
    return response.data;
  } catch (error) {
    // Error handling (unchanged from your implementation)
    console.error('Error sending message to philosopher:', error);
    
    if (error.response) {
      console.error('Server responded with error:', error.response.data);
      throw new Error(`Server error: ${error.response.data.error || 'Unknown error'}`);
    } else if (error.request) {
      console.error('No response received from server');
      throw new Error('Network error: Unable to reach the server. Please check your connection.');
    } else {
      console.error('Error setting up request:', error.message);
      throw new Error(`Request error: ${error.message}`);
    }
  }
};

// Function to get a daily philosophical challenge
export const getDailyChallenge = async () => {
  try {
    // This would normally call an API endpoint
    // For now, we'll return a predefined challenge
    const challenges = [
      {
        id: 'challenge1',
        title: 'The Socratic Examination',
        description: 'Identify one belief you hold strongly. Now, question it thoroughly. What evidence supports it? What might challenge it? Can you see it from another perspective?',
        difficulty: 'Moderate',
        category: 'Critical Thinking',
        philosophy: 'Socrates believed that the unexamined life is not worth living. By questioning our beliefs, we can separate truth from mere opinion and achieve greater wisdom.'
      },
      {
        id: 'challenge2',
        title: 'Aristotle\'s Golden Mean',
        description: 'Choose one virtue (courage, temperance, etc.). Identify what its excess and deficiency would look like in your life. How can you cultivate the middle path?',
        difficulty: 'Moderate',
        category: 'Virtue Ethics',
        philosophy: 'Aristotle taught that virtue lies in the middle between excess and deficiency. Finding this "golden mean" is the key to developing character and living a good life.'
      },
      {
        id: 'challenge3',
        title: 'Heraclitus\' River',
        description: 'Observe something in your life that appears constant but is actually changing. Record how you feel about this impermanence.',
        difficulty: 'Easy',
        category: 'Change & Impermanence',
        philosophy: 'Heraclitus said "No man ever steps in the same river twice." Everything is in constant flux, though we often fail to notice the subtle changes.'
      }
    ];
    
    return challenges[Math.floor(Math.random() * challenges.length)];
  } catch (error) {
    console.error('Error getting daily challenge:', error);
    throw error;
  }
};

// Function to get philosophical insights on a journal entry
export const getPhilosophicalInsight = async (entry, philosopherId = 'aristotle') => {
  try {
    const response = await sendMessageToPhilosopher(
      philosopherId,
      `Please provide a brief philosophical insight (1 or 2 sentences maximum) about this journal entry: "${entry}"`,
      [],
      "", // No user context
      'journal' // Specify 'journal' context to use the journal-specific prompt
    );
    
    return response.response;
  } catch (error) {
    console.error('Error getting philosophical insight:', error);
    
    // Return a default insight if the API call fails
    return "The wisdom you seek may sometimes be found in silence. Consider this moment an opportunity for your own reflection.";
  }
};