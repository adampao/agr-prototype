import axios from 'axios';

// Function to interact with our Netlify function that calls Claude
export const sendMessageToPhilosopher = async (philosopherId, message, previousMessages = []) => {
  try {
    const response = await axios.post('/.netlify/functions/claude-chat', {
      prompt: message,
      philosopherId,
      previousMessages
    });
    
    return response.data;
  } catch (error) {
    console.error('Error sending message to philosopher:', error);
    throw error;
  }
};