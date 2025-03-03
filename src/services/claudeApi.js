import axios from 'axios';

// Function to interact with our Netlify function that calls Claude
export const sendMessageToPhilosopher = async (philosopherId, message, previousMessages = [], userContext = "") => {
  try {
    const response = await axios.post('/.netlify/functions/claude-chat', {
      prompt: message,
      philosopherId,
      previousMessages,
      userContext
    });
    
    return response.data;
  } catch (error) {
    console.error('Error sending message to philosopher:', error);
    
    // Handle the error more gracefully
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Server responded with error:', error.response.data);
      throw new Error(`Server error: ${error.response.data.error || 'Unknown error'}`);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server');
      throw new Error('Network error: Unable to reach the server. Please check your connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
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
      []
    );
    
    return response.response;
  } catch (error) {
    console.error('Error getting philosophical insight:', error);
    
    // Return a default insight if the API call fails
    return "The wisdom you seek may sometimes be found in silence. Consider this moment an opportunity for your own reflection.";
  }
};