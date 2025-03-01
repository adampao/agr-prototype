import philosopherExpertise from './PhilosopherExpertiseMap';

// Helper function to check if a message contains any keywords from a list
const containsKeywords = (message, keywords) => {
  const lowercaseMessage = message.toLowerCase();
  return keywords.some(keyword => lowercaseMessage.includes(keyword.toLowerCase()));
};

// Function to analyze chat and detect if conversation is outside philosopher's expertise
export const analyzeConversation = (messages, currentPhilosopher) => {
  // Only check the latest user message
  if (!messages || messages.length < 1) return null;

  // Get the last user message
  const recentMessages = messages.slice(-3); // Check last 3 messages for context
  const lastUserMessage = recentMessages.filter(msg => msg.role === 'user' || msg.sender === 'user').pop();
    
  if (!lastUserMessage) return null;
  
  const userMessageContent = lastUserMessage.content || lastUserMessage.text;
  
  
  // Get current philosopher's expertise
  const philosopherData = philosopherExpertise[currentPhilosopher];
  if (!philosopherData) return null;
  
  // Check if the message contains topics outside the current philosopher's expertise
  for (const [topic, suggestion] of Object.entries(philosopherData.suggestionsMap)) {
    // Create an array of topic keywords (split by spaces and filter out short words)
    const topicKeywords = topic.split(' ').filter(word => word.length > 3);
    
    // If the message contains this topic
    if (containsKeywords(userMessageContent, topicKeywords)) {
      // Check if the suggested philosopher exists
      const suggestedPhilosopher = suggestion.philosopher;
      if (philosopherExpertise[suggestedPhilosopher]) {
        return {
          suggestedPhilosopher: suggestedPhilosopher,
          currentPhilosopher: currentPhilosopher,
          reason: suggestion.reason,
          topic: topic
        };
      }
    }
  }
  
  return null;
};

// Check if we should make a more sophisticated suggestion based on conversation flow
export const shouldSuggestPhilosopherSwitch = (messages, currentPhilosopher) => {
  // Only suggest after at least 3 exchanges to avoid premature suggestions
  if (!messages || messages.length < 6) return null;

  // Get last 3 user messages to analyze conversation trend
  const userMessages = messages
    .filter(msg => msg.role === 'user' || msg.sender === 'user')
    .slice(-3)
    .map(msg => msg.content || msg.text);
  
  // Combine messages for analysis
  const combinedMessages = userMessages.join(' ');
  
  // Get the topic that appears most in recent messages
  let dominantTopic = null;
  let maxCount = 0;
  
  // For each topic in other philosophers' expertise
  Object.keys(philosopherExpertise).forEach(philosopher => {
    if (philosopher.toLowerCase() !== currentPhilosopher.toLowerCase()) {
      philosopherExpertise[philosopher].primaryTopics.forEach(topic => {
        // Count occurrences
        const regex = new RegExp(`\\b${topic}\\b`, 'gi');
        const count = (combinedMessages.match(regex) || []).length;
        
        if (count > maxCount) {
          maxCount = count;
          dominantTopic = {
            topic: topic,
            philosopher: philosopher
          };
        }
      });
    }
  });
  
  // Only suggest if we found a dominant topic with significant mentions
  if (dominantTopic && maxCount >= 2) {
    const suggestedPhilosopher = dominantTopic.philosopher;
    return {
      suggestedPhilosopher: suggestedPhilosopher,
      currentPhilosopher: currentPhilosopher,
      reason: `The conversation has shifted toward topics related to ${dominantTopic.topic}, which is a specialty of ${suggestedPhilosopher}.`,
      topic: dominantTopic.topic
    };
  }
  
  return null;
};

export default {
  analyzeConversation,
  shouldSuggestPhilosopherSwitch
};