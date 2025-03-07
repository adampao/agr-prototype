import axios from 'axios';
import { 
  sendMessageToPhilosopher as sendMessage,
  getDailyChallenge as getChallenge,
  getPhilosophicalInsight as getInsight
} from './aiApi';

// Function to interact with our Netlify function that calls Claude
// This uses the shared API module with the central prompt engineering
export const sendMessageToPhilosopher = async (philosopherId, message, previousMessages = [], userContext = "") => {
  // Forward to the unified API that handles both Claude and OpenAI
  return sendMessage(philosopherId, message, previousMessages, userContext, 'chat');
};

// Function to get a daily philosophical challenge
// Pass-through to the unified API
export const getDailyChallenge = async () => {
  return getChallenge();
};

// Function to get philosophical insights on a journal entry
// Pass-through to the unified API, specifying 'journal' context
export const getPhilosophicalInsight = async (entry, philosopherId = 'aristotle') => {
  return getInsight(entry, philosopherId);
};