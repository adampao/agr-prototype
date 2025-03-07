import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../common/Button';
import { sendMessageToPhilosopher, API_PROVIDERS } from '../../services/aiApi';
import PhilosopherSwitch from '../study/PhilosopherSwitchComponent';
import { useAuth } from '../../services/AuthContext';
import { getAllPersonas } from '../../personas';

// Import philosophers data from persona system
const philosopherPersonas = getAllPersonas();
const philosophers = Object.values(philosopherPersonas).map(philosopher => ({
  id: philosopher.id,
  name: philosopher.name,
  specialty: philosopher.specialty,
  timePeriod: philosopher.lifespan,
  description: philosopher.description,
  imageSrc: philosopher.imageSrc,
  modernImageSrc: philosopher.modernImageSrc,
  accent: philosopher.accent,
  darkAccent: philosopher.accent?.replace('/20', '').replace('/30', '').replace('/90', '') + ' text-white'
}));

// Sample debate topics
const debateTopics = [
  {
    id: 'virtue',
    title: 'The Nature of Virtue',
    description: 'Is virtue a kind of knowledge that can be taught, or is it innate?'
  },
  {
    id: 'justice',
    title: 'What Is Justice?',
    description: 'Is justice merely what benefits the strongest, or does it have objective value?'
  },
  {
    id: 'knowledge',
    title: 'Sources of Knowledge',
    description: 'Do we gain knowledge through sensory experience or through reason and contemplation?'
  },
  {
    id: 'happiness',
    title: 'The Path to Happiness',
    description: 'What constitutes a good life? Is pleasure the highest good, or is virtue?'
  },
  {
    id: 'reality',
    title: 'The Nature of Reality',
    description: 'Is reality found in the physical world we perceive, or in unchanging forms?'
  },
  {
    id: 'custom',
    title: 'Custom Topic',
    description: 'Enter your own philosophical question or topic'
  }
];

const PhilosopherDebate = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const [philosopher1, setPhilosopher1] = useState(null);
  const [philosopher2, setPhilosopher2] = useState(null);
  const [philosopher3, setPhilosopher3] = useState(null); // Add the third philosopher
  const [philosopher4, setPhilosopher4] = useState(null); // Add the fourth philosopher
  const [userContext, setUserContext] = useState("");
  const [philosopherInvites, setPhilosopherInvites] = useState({});
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [customTopic, setCustomTopic] = useState('');
  const [debateMessages, setDebateMessages] = useState([]);
  const [debateStarted, setDebateStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userPrompt, setUserPrompt] = useState('');
  const [currentTurn, setCurrentTurn] = useState(null); // To track which philosopher's turn it is
  const [debateStage, setDebateStage] = useState('setup'); // 'setup', 'opening', 'discussion', 'conclusion'
  const [switchSuggestion, setSwitchSuggestion] = useState(null);
  const [votes, setVotes] = useState({});
  const [hasVoted, setHasVoted] = useState(false);  // Add this state to track if user has voted
  const [componentKey, setComponentKey] = useState(0);
  const [expectedConclusions, setExpectedConclusions] = useState(2);
  const [pointsAwarded, setPointsAwarded] = useState(false);
  const [achievementUnlocked, setAchievementUnlocked] = useState(null);
  
  // Achievement definitions
  const achievements = [
    { 
      id: 'sophia_novice',
      name: 'Wisdom Novice', 
      description: 'Accumulated 5 Sophia Points on your philosophical journey',
      icon: '🔍',
      threshold: 5
    },
    {
      id: 'sophia_seeker',
      name: 'Wisdom Seeker',
      description: 'Accumulated 10 Sophia Points through philosophical inquiry',
      icon: '🦉',
      threshold: 10
    }
  ];

  // Check for unlocked achievements based on points
  const checkAchievements = (points) => {
    if (!currentUser || !currentUser.achievements) return null;
    
    // Get list of achievement IDs user already has
    const userAchievementIds = currentUser.achievements.map(a => a.id);
    
    // Find achievements that should be unlocked but user doesn't have yet
    const newAchievements = achievements.filter(achievement => 
      points >= achievement.threshold && 
      !userAchievementIds.includes(achievement.id)
    );
    
    return newAchievements.length > 0 ? newAchievements[0] : null;
  };
  
  // Function to award Sophia points to the user
  const awardSophiaPoints = (points = 1) => {
    if (currentUser) {
      // Calculate new points total
      const newTotal = (currentUser.stats.sophiaPoints || 0) + points;
      
      // Check for achievements
      const newAchievement = checkAchievements(newTotal);
      
      // Build updated user object
      let updatedUser = {
        ...currentUser,
        stats: {
          ...currentUser.stats,
          sophiaPoints: newTotal
        }
      };
      
      // Add achievement if earned
      if (newAchievement) {
        const achievementToAdd = {
          ...newAchievement,
          date: new Date().toISOString()
        };
        
        updatedUser = {
          ...updatedUser,
          achievements: [
            ...(currentUser.achievements || []),
            achievementToAdd
          ]
        };
        
        // Show achievement notification
        setAchievementUnlocked(newAchievement);
        
        // Clear achievement notification after a delay
        setTimeout(() => {
          setAchievementUnlocked(null);
        }, 8000);
      }
      
      // Update user profile
      updateUserProfile(updatedUser);
      setPointsAwarded(true);
      
      // Reset the points awarded flag after a few seconds
      setTimeout(() => {
        setPointsAwarded(false);
      }, 5000);
    }
  };
  
  // Function to increment the debate count
  const incrementDebateCount = () => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        stats: {
          ...currentUser.stats,
          debatesCount: (currentUser.stats.debatesCount || 0) + 1
        }
      };
      
      // Update user profile
      updateUserProfile(updatedUser);
    }
  };
 
  
  const messagesEndRef = useRef(null);
  // Helper function to get the next philosopher's turn
const getNextTurn = (currentId) => {
  const activePhilosophers = [philosopher1, philosopher2, philosopher3, philosopher4].filter(Boolean);
  const currentIndex = activePhilosophers.findIndex(p => p.id === currentId);
  const nextIndex = (currentIndex + 1) % activePhilosophers.length;
  return activePhilosophers[nextIndex].id;
};
  
  // Scroll to bottom of messages when they update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [debateMessages]);
  
  // Initialize vote counts when philosophers change
  useEffect(() => {
    const newVotes = {};
    if (philosopher1) newVotes[philosopher1.id] = 0;
    if (philosopher2) newVotes[philosopher2.id] = 0;
    if (philosopher3) newVotes[philosopher3.id] = 0;
    if (philosopher4) newVotes[philosopher4.id] = 0;
    setVotes(newVotes);
  }, [philosopher1, philosopher2, philosopher3, philosopher4]);
  
  // Function to start the debate
  const startDebate = async () => {
    if (!philosopher1 || !philosopher2 || (!selectedTopic && !customTopic)) {
      alert('Please select two philosophers and a topic to begin.');
      return;
    }
    
    const topicText = selectedTopic === 'custom' 
      ? customTopic 
      : debateTopics.find(t => t.id === selectedTopic)?.description || '';
    
    setDebateStarted(true);
    setDebateStage('opening');
    setIsLoading(true);
    
    // Add system message to introduce the debate
    setDebateMessages([
      { 
        type: 'system', 
        text: `Welcome to a philosophical debate between ${philosopher1.name} and ${philosopher2.name} on the topic: "${topicText}".` 
      }
    ]);
    
    // Generate the opening statement from philosopher 1
    try {
      const prompt = `You are participating in a philosophical debate with ${philosopher2.name} on the topic: "${topicText}". Please provide your opening statement on this topic, explaining your philosophical position in about 150 words. Remember that you are ${philosopher1.name} from ancient Greece and should maintain your historical perspective, without knowledge of events after your lifetime.`;
      
      const response = await sendMessageToPhilosopher(
        philosopher1.id,
        prompt,
        [],
        userContext,
        'debate' // Specify the feature (debate uses OpenAI)
      );
      
      // Add philosopher 1's opening statement
      setDebateMessages(messages => [
        ...messages,
        { 
          type: 'philosopher', 
          philosopherId: philosopher1.id, 
          text: response.response,
          isOpening: true
        }
      ]);
      
      // Now get philosopher 2's opening statement
      const prompt2 = `You are participating in a philosophical debate with ${philosopher1.name} on the topic: "${topicText}". Please provide your opening statement on this topic, explaining your philosophical position in about 150 words. Remember that you are ${philosopher2.name} from ancient Greece and should maintain your historical perspective, without knowledge of events after your lifetime.`;
      
      const response2 = await sendMessageToPhilosopher(
        philosopher2.id,
        prompt2,
        [],
        userContext,
        'debate' // Specify the feature (debate uses OpenAI)
      );
      
      // Add philosopher 2's opening statement
      setDebateMessages(messages => [
        ...messages,
        { 
          type: 'philosopher', 
          philosopherId: philosopher2.id, 
          text: response2.response,
          isOpening: true
        }
      ]);
      
      // Set debate stage to discussion and prepare for first response
      setDebateStage('discussion');
      setCurrentTurn(philosopher1.id);
      
    } catch (error) {
      console.error('Error starting debate:', error);
      
      // Check if it's an OpenAI API key issue
      const errorMessage = error.message && error.message.includes('OpenAI API key') 
        ? 'The debate feature requires an OpenAI API key. Please add a valid key to your .env file.'
        : `There was an error starting the debate. ${error.message}`;
      
      setDebateMessages(messages => [
        ...messages,
        { 
          type: 'system', 
          text: errorMessage
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to continue the debate (next turn)
  const continueTurn = async () => {
    if (isLoading || !debateStarted) return;
    
    setIsLoading(true);
    
    try {
      // Determine whose turn it is and who responds
      const currentPhilosopher = philosophers.find(p => p.id === currentTurn);
      const otherPhilosopherId = currentPhilosopher.id === philosopher1.id ? philosopher2.id : philosopher1.id;
      const otherPhilosopher = philosophers.find(p => p.id === otherPhilosopherId);
      
      // Extract the previous statements for context
      const previousStatements = debateMessages
        .filter(m => m.type === 'philosopher')
        .map(m => ({
          philosopher: philosophers.find(p => p.id === m.philosopherId)?.name,
          text: m.text
        }));
      
      // Get the most recent statement from the other philosopher
      const lastStatement = previousStatements
        .filter(s => s.philosopher === otherPhilosopher.name)
        .pop();
      
      // Create the prompt for the current philosopher to respond
      const prompt = `You are ${currentPhilosopher.name} in a philosophical debate with ${otherPhilosopher.name}. 
      
${otherPhilosopher.name} has just said: "${lastStatement?.text || "We are debating about " + (selectedTopic === 'custom' ? customTopic : debateTopics.find(t => t.id === selectedTopic)?.description)}".

Please respond to ${otherPhilosopher.name}'s points, defending your philosophical position and challenging theirs. If appropriate, you may mention another philosopher like Plato, Heraclitus, Xenophon, Socrates, Aristotle, Pythagoras or another one if their ideas are relevant to this topic.

Keep your response concise (about 150 words) and remember to maintain your historical perspective as ${currentPhilosopher.name} from ancient Greece (${currentPhilosopher.timePeriod}).`;
      
      // Format messages for API call
      const previousMessages = debateMessages
        .filter(m => m.type === 'philosopher')
        .map(m => {
          return { 
            role: 'assistant', 
            content: `[${philosophers.find(p => p.id === m.philosopherId)?.name}]: ${m.text}` 
          };
        });
      
      const response = await sendMessageToPhilosopher(
        currentPhilosopher.id,
        prompt,
        previousMessages,
        userContext,
        'debate' // Specify the feature (debate uses OpenAI)
      );
      
// Check if the response mentions another philosopher
const currentPhilosophers = [philosopher1, philosopher2, philosopher3, philosopher4].filter(Boolean);
if (currentPhilosophers.length < 4) {
  philosophers.forEach(phil => {
    if (currentPhilosophers.every(p => p.id !== phil.id) && 
        response.response.includes(phil.name)) {
      setSwitchSuggestion({
        suggestedPhilosopher: phil.name,
        currentPhilosopher: currentPhilosopher.name,
        reason: `This topic involves aspects of ${phil.specialty}`
      });
    }
  });
}

      // Add the response to the debate messages
      setDebateMessages(messages => [
        ...messages,
        { 
          type: 'philosopher', 
          philosopherId: currentPhilosopher.id, 
          text: response.response,
          isOpening: false
        }
      ]);
      
      // Switch turns to the other philosopher
      const nextTurn = getNextTurn(currentPhilosopher.id);
setCurrentTurn(nextTurn);
      
    } catch (error) {
      console.error('Error continuing debate:', error);
      setDebateMessages(messages => [
        ...messages,
        { 
          type: 'system', 
          text: `There was an error continuing the debate. ${error.message}` 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle voting
const handleVote = (philosopherId) => {
  // Award Sophia points for voting in a debate
  if (currentUser && !hasVoted) {
    awardSophiaPoints(1);
  }
  
  setVotes(prevVotes => ({
    ...prevVotes,
    [philosopherId]: (prevVotes[philosopherId] || 0) + 1
  }));

  setHasVoted(true);

   // Add system message about the vote
   setDebateMessages(messages => [
    ...messages,
    { 
      type: 'system', 
      text: `You voted for ${philosophers.find(p => p.id === philosopherId)?.name}.`
    }
  ]);
};
  
  // Function to handle user intervention in the debate
  const handleUserIntervention = async () => {
    if (!userPrompt.trim() || isLoading) return;
    
    setIsLoading(true);

    const respondingPhilosopherId = currentTurn;
  const respondingPhilosopher = philosophers.find(p => p.id === respondingPhilosopherId);
    
    // Add user message to the debate
    setDebateMessages(messages => [
      ...messages,
      { type: 'user', text: userPrompt.trim() }
    ]);
    
// Look for direct requests to add philosophers
const lowerPrompt = userPrompt.toLowerCase().trim();
if (
  (lowerPrompt.includes("add") || 
   lowerPrompt.includes("bring") || 
   lowerPrompt.includes("introduce") ||
   lowerPrompt.includes("invite")) && 
  !philosopher3
) {
  // Check if a specific philosopher is mentioned
  let mentionedPhil = null;
  
  philosophers.forEach(phil => {
    if (
      phil.id !== philosopher1.id && 
      phil.id !== philosopher2.id &&
      lowerPrompt.includes(phil.name.toLowerCase())
    ) {
      mentionedPhil = phil;
    }
  });
  
  // If a specific philosopher was mentioned
  if (mentionedPhil) {
    setSwitchSuggestion({
      suggestedPhilosopher: mentionedPhil.name,
      currentPhilosopher: philosophers.find(p => p.id === respondingPhilosopherId)?.name,
      reason: `The audience has requested ${mentionedPhil.name} join our discussion.`
    });
  } 
  // If no specific philosopher was mentioned but user wants to add one
  else if (
    lowerPrompt.includes("philosopher") || 
    lowerPrompt.includes("another") ||
    lowerPrompt.includes("third")
  ) {
    // Find philosophers not in the debate
    const availablePhils = philosophers.filter(p => 
      p.id !== philosopher1.id && 
      p.id !== philosopher2.id
    );
    
    if (availablePhils.length > 0) {
      // Choose a philosopher based on the topic
      const randomPhil = availablePhils[Math.floor(Math.random() * availablePhils.length)];
      
      setSwitchSuggestion({
        suggestedPhilosopher: randomPhil.name,
        currentPhilosopher: philosophers.find(p => p.id === respondingPhilosopherId)?.name,
        reason: `The audience wishes to hear from another perspective. ${randomPhil.name}'s views on ${randomPhil.specialty} would be valuable.`
      });
    }
  }
}

    try {
      
      
      // Format messages for API call
      const previousMessages = debateMessages
        .filter(m => m.type === 'philosopher')
        .map(m => {
          return { 
            role: 'assistant', 
            content: `[${philosophers.find(p => p.id === m.philosopherId)?.name}]: ${m.text}` 
          };
        });
      
      // Add the user's intervention
      previousMessages.push({ role: 'user', content: userPrompt.trim() });
      
      const response = await sendMessageToPhilosopher(
        respondingPhilosopherId,
        `You are ${respondingPhilosopher.name} in a philosophical debate. The audience has asked: "${userPrompt.trim()}". Please respond to this question while maintaining your philosophical position and historical perspective as ${respondingPhilosopher.name} from ancient Greece (${respondingPhilosopher.timePeriod}).`,
        previousMessages,
        userContext,
        'debate' // Specify the feature (debate uses OpenAI)
      );
      
      // Add the philosopher's response to the user
      setDebateMessages(messages => [
        ...messages,
        { 
          type: 'philosopher', 
          philosopherId: respondingPhilosopherId, 
          text: response.response,
          isResponse: true
        }
      ]);

      // Switch turns to the next philosopher after responding to the user
    // This ensures different philosophers respond to subsequent user questions
    const nextTurn = getNextTurn(respondingPhilosopherId);
    setCurrentTurn(nextTurn);
      
    } catch (error) {
      console.error('Error handling user intervention:', error);
      setDebateMessages(messages => [
        ...messages,
        { 
          type: 'system', 
          text: `There was an error processing your question. ${error.message}` 
        }
      ]);
    } finally {
      setIsLoading(false);
      setUserPrompt('');
    }
  };
  
  // Function to conclude the debate
  const concludeDebate = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setDebateStage('conclusion');
    
    try {
      // Get active philosophers
      const activePhilosophers = [philosopher1, philosopher2, philosopher3, philosopher4].filter(Boolean);
      // Set the expected conclusions count for voting
      setExpectedConclusions(activePhilosophers.length);
      
      // Get concluding statements from active philosophers
      const topicText = selectedTopic === 'custom' 
        ? customTopic 
        : debateTopics.find(t => t.id === selectedTopic)?.description || '';
      
      // Add system message for conclusion
      setDebateMessages(messages => [
        ...messages,
        { 
          type: 'system', 
          text: 'The debate is concluding. Each philosopher will now provide their final thoughts.' 
        }
      ]);
      
      // Format previous messages for context
      const previousMessages = debateMessages
        .filter(m => m.type === 'philosopher')
        .map(m => {
          const philosopherName = philosophers.find(p => p.id === m.philosopherId)?.name || "Unknown";
          return { 
            role: 'assistant', 
            content: `[${philosopherName}]: ${m.text}` 
          };
        });
        
      // Get all active philosophers' names except philosopher1
      let otherNames = "";
      if (activePhilosophers.length > 1) {
        otherNames = activePhilosophers
          .filter(p => p !== philosopher1)
          .map(p => p.name)
          .join(' and ');
      }
      
      // Variables to store responses for each philosopher
      let response1, response2, response3, response4;
      
      // Get philosopher 1's conclusion if it exists
      if (philosopher1) {
        const promptConclusion1 = `You are ${philosopher1.name} in a philosophical debate ${otherNames ? 'with ' + otherNames : ''} on the topic: "${topicText}". Please provide your concluding statement, summarizing your position and the key points of your argument. Keep it concise (about 100 words) and maintain your historical perspective as ${philosopher1.name} from ancient Greece (${philosopher1.timePeriod}).`;
        
        response1 = await sendMessageToPhilosopher(
          philosopher1.id,
          promptConclusion1,
          previousMessages,
          userContext,
          'debate' // Specify the feature (debate uses OpenAI)
        );
        
        // Add philosopher 1's conclusion
        setDebateMessages(messages => [
          ...messages,
          { 
            type: 'philosopher', 
            philosopherId: philosopher1.id, 
            text: response1.response,
            isConclusion: true
          }
        ]);
      }
      
      // Get philosopher 2's conclusion if it exists
      if (philosopher2 && response1) {
        const promptConclusion2 = `You are ${philosopher2.name} in a philosophical debate with ${philosopher1.name} on the topic: "${topicText}". Please provide your concluding statement, summarizing your position and the key points of your argument. Keep it concise (about 100 words) and maintain your historical perspective as ${philosopher2.name} from ancient Greece (${philosopher2.timePeriod}).`;
        
        response2 = await sendMessageToPhilosopher(
          philosopher2.id,
          promptConclusion2,
          previousMessages.concat([
            { 
              role: 'assistant', 
              content: `[${philosopher1.name}]: ${response1.response}` 
            }
          ]),
          userContext,
          'debate' // Specify the feature (debate uses OpenAI)
        );
        
        // Add philosopher 2's conclusion
        setDebateMessages(messages => [
          ...messages,
          { 
            type: 'philosopher', 
            philosopherId: philosopher2.id, 
            text: response2.response,
            isConclusion: true
          }
        ]);
      }

      // Get philosopher 3's conclusion if it exists
      if (philosopher3 && response1 && response2) {
        const promptConclusion3 = `You are ${philosopher3.name} in a philosophical debate with ${philosopher1.name} and ${philosopher2.name} on the topic: "${topicText}". Please provide your concluding statement, summarizing your position and the key points of your argument. Keep it concise (about 100 words) and maintain your historical perspective as ${philosopher3.name} from ancient Greece (${philosopher3.timePeriod}).`;
        
        response3 = await sendMessageToPhilosopher(
          philosopher3.id,
          promptConclusion3,
          previousMessages.concat([
            { 
              role: 'assistant', 
              content: `[${philosopher1.name}]: ${response1.response}, [${philosopher2.name}]: ${response2.response}`
            }
          ]),
          userContext,
          'debate' // Specify the feature (debate uses OpenAI)
        );
        
        // Add philosopher 3's conclusion
        setDebateMessages(messages => [
          ...messages,
          { 
            type: 'philosopher', 
            philosopherId: philosopher3.id, 
            text: response3.response,
            isConclusion: true
          }
        ]);

        // Get philosopher 4's conclusion if it exists
        if (philosopher4 && response1 && response2 && response3) {
          const promptConclusion4 = `You are ${philosopher4.name} in a philosophical debate with ${philosopher1.name}, ${philosopher2.name}, and ${philosopher3.name} on the topic: "${topicText}". Please provide your concluding statement, summarizing your position and the key points of your argument. Keep it concise (about 100 words) and maintain your historical perspective as ${philosopher4.name} from ancient Greece (${philosopher4.timePeriod}).`;
          
          response4 = await sendMessageToPhilosopher(
            philosopher4.id,
            promptConclusion4,
            previousMessages.concat([
              { 
                role: 'assistant', 
                content: `[${philosopher1.name}]: ${response1.response}, [${philosopher2.name}]: ${response2.response}, [${philosopher3.name}]: ${response3.response}`
              }
            ]),
            userContext,
            'debate' // Specify the feature (debate uses OpenAI)
          );
          
          // Add philosopher 4's conclusion
          setDebateMessages(messages => [
            ...messages,
            { 
              type: 'philosopher', 
              philosopherId: philosopher4.id, 
              text: response4.response,
              isConclusion: true
            }
          ]);
        }
      }
      
      // Add final system message
      setDebateMessages(messages => [
        ...messages,
        { 
          type: 'system', 
          text: 'The debate has concluded. You may reset to start a new debate or continue the conversation.' 
        }
      ]);
      
      // Increment the user's debate count
      incrementDebateCount();
      
    } catch (error) {
      console.error('Error concluding debate:', error);
      setDebateMessages(messages => [
        ...messages,
        { 
          type: 'system', 
          text: `There was an error concluding the debate. ${error.message}` 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to reset the debate
  const resetDebate = () => {
    setPhilosopher1(null);
    setPhilosopher2(null);
    setPhilosopher3(null);
    setPhilosopher4(null);
    setPhilosopherInvites({});
    setSelectedTopic(null);
    setCustomTopic('');
    setDebateMessages([]);
    setDebateStarted(false);
    setDebateStage('setup');
    setCurrentTurn(null);
    setUserPrompt('');
    setSwitchSuggestion(null);
    setVotes({});  // Reset votes
    setHasVoted(false);  // Reset hasVoted flag
    setComponentKey(prevKey => prevKey + 1);
  };
  
  
  // Function to save debate transcript
const saveDebate = () => {
  const debateTitle = selectedTopic === 'custom' 
    ? customTopic.substring(0, 30) 
    : debateTopics.find(t => t.id === selectedTopic)?.title;
    
  const debateText = debateMessages
    .map(msg => {
      if (msg.type === 'philosopher') {
        const philosopher = philosophers.find(p => p.id === msg.philosopherId);
        if (msg.isOpening) {
          return `[${philosopher?.name} - Opening Statement]\n${msg.text}`;
        } else if (msg.isConclusion) {
          return `[${philosopher?.name} - Concluding Remarks]\n${msg.text}`;
        } else {
          return `[${philosopher?.name}]\n${msg.text}`;
        }
      } else if (msg.type === 'user') {
        return `[Audience Question]\n${msg.text}`;
      } else {
        return `[System]\n${msg.text}`;
      }
    })
    .join('\n\n');
    
  // Create a download link
  const element = document.createElement('a');
  const file = new Blob([debateText], {type: 'text/plain'});
  element.href = URL.createObjectURL(file);
  element.download = `Philosophical Debate - ${debateTitle || 'Custom Topic'}.txt`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

  // Handle philosopher selection, ensuring they can't pick the same philosopher twice
  const handlePhilosopherSelect = (philosopher, position) => {
    if (position === 1) {
      if (philosopher2 && philosopher2.id === philosopher.id) {
        setPhilosopher2(null);
      }
      setPhilosopher1(philosopher);
    } else {
      if (philosopher1 && philosopher1.id === philosopher.id) {
        setPhilosopher1(null);
      }
      setPhilosopher2(philosopher);
    }
  };
  
  // Set up debate selection UI
  if (debateStage === 'setup') {
    return (
      <div key={componentKey} className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-serif font-bold text-aegeanBlue mb-6">
        Create a Philosophical Debate
      </h2>
        
        {/* Philosopher Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-aegeanBlue mb-3">Select Two Philosophers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Philosopher 1 Selection */}
            <div>
              <h4 className="text-md font-medium text-aegeanBlue/80 mb-2">First Philosopher</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {philosophers.map(phil => (
                  <div
                    key={`phil1-${phil.id}`}
                    className={`cursor-pointer p-3 rounded-lg transition-colors flex flex-col items-center ${
                      philosopher1 && philosopher1.id === phil.id 
                        ? phil.darkAccent
                        : phil.accent + ' hover:opacity-80'
                    }`}
                    onClick={() => handlePhilosopherSelect(phil, 1)}
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden mb-2">
                      <img 
                        src={phil.modernImageSrc} 
                        alt={phil.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm font-medium">{phil.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Philosopher 2 Selection */}
            <div>
              <h4 className="text-md font-medium text-aegeanBlue/80 mb-2">Second Philosopher</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {philosophers.map(phil => (
                  <div
                    key={`phil2-${phil.id}`}
                    className={`cursor-pointer p-3 rounded-lg transition-colors flex flex-col items-center ${
                      philosopher2 && philosopher2.id === phil.id 
                        ? phil.darkAccent
                        : phil.accent + ' hover:opacity-80'
                    }`}
                    onClick={() => handlePhilosopherSelect(phil, 2)}
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden mb-2">
                      <img 
                        src={phil.modernImageSrc} 
                        alt={phil.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm font-medium">{phil.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Topic Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-aegeanBlue mb-3">Select a Debate Topic</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {debateTopics.map(topic => (
              <div
                key={topic.id}
                className={`cursor-pointer p-4 rounded-lg border transition-colors ${
                  selectedTopic === topic.id 
                    ? 'bg-aegeanBlue text-white border-aegeanBlue'
                    : 'bg-white text-aegeanBlue border-aegeanBlue/20 hover:border-aegeanBlue/50'
                }`}
                onClick={() => setSelectedTopic(topic.id)}
              >
                <h4 className="font-medium mb-1">{topic.title}</h4>
                <p className="text-sm opacity-90">{topic.description}</p>
              </div>
            ))}
          </div>
          
          {/* Custom Topic Input */}
          {selectedTopic === 'custom' && (
            <div className="mt-4">
              <textarea
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="Enter your philosophical question or topic for debate..."
                className="w-full p-3 border border-aegeanBlue/20 rounded-md focus:outline-none focus:ring-2 focus:ring-aegeanBlue/50 resize-y min-h-[80px]"
              />
            </div>
          )}
        </div>
        
        {/* Start Debate Button */}
        <div className="flex justify-center">
          <Button
            onClick={startDebate}
            disabled={!philosopher1 || !philosopher2 || (!selectedTopic || (selectedTopic === 'custom' && !customTopic.trim()))}
            variant="primary"
            className="px-8"
          >
            Begin Philosophical Debate
          </Button>
        </div>
      </div>
      
    );
  }
  
// Handle switching to a suggested philosopher
const handlePhilosopherSwitch = (suggestion) => {
  if (!suggestion) return;
  
  // Find the suggested philosopher object
  const suggestedPhil = philosophers.find(p => p.name === suggestion.suggestedPhilosopher);
  if (!suggestedPhil) return;
  
  // Check if we already have 4 philosophers
  const currentPhilosophers = [philosopher1, philosopher2, philosopher3, philosopher4].filter(Boolean);
  if (currentPhilosophers.length >= 4) {
    // Add a system message explaining we've reached the maximum
    setDebateMessages(messages => [
      ...messages,
      { 
        type: 'system', 
        text: `${suggestion.currentPhilosopher} suggests ${suggestion.suggestedPhilosopher} would have valuable input, but our debate already has the maximum number of participants.` 
      }
    ]);
    setSwitchSuggestion(null);
    return;
  }
  
  // Add system message about the switch
  setDebateMessages(messages => [
    ...messages,
    { 
      type: 'system', 
      text: `${suggestion.currentPhilosopher} has suggested that ${suggestion.suggestedPhilosopher} join the debate on this topic.`
    }
  ]);

  // Track who has invited whom
  const invitingPhilosopherId = philosophers.find(p => p.name === suggestion.currentPhilosopher)?.id;
  setPhilosopherInvites(prev => ({
    ...prev,
    [invitingPhilosopherId]: suggestedPhil.id
  }));
  
  // Add the new philosopher to the first available slot
  if (!philosopher3) {
    setPhilosopher3(suggestedPhil);
  } else if (!philosopher4) {
    setPhilosopher4(suggestedPhil);
  }
  
  // Get the debate context to give to the new philosopher
  const debateContext = debateMessages
    .filter(m => m.type === 'philosopher' || m.type === 'system')
    .map(m => {
      if (m.type === 'philosopher') {
        const phil = philosophers.find(p => p.id === m.philosopherId);
        return `${phil?.name}: ${m.text}`;
      } else {
        return `[System]: ${m.text}`;
      }
    })
    .join('\n\n');
  
  // Add introduction message from the new philosopher with full context
  setTimeout(async () => {
    try {
      const topicText = selectedTopic === 'custom' 
        ? customTopic 
        : debateTopics.find(t => t.id === selectedTopic)?.description || '';
      
      const prompt = `You are ${suggestedPhil.name} joining an ongoing philosophical debate on the topic: "${topicText}".
      
Here is the debate so far:

${debateContext}

Please provide a brief introduction (about 100 words) explaining your perspective on this topic, acknowledging that you've been invited to join the conversation by ${suggestion.currentPhilosopher}.`;
      
      const response = await sendMessageToPhilosopher(
        suggestedPhil.id,
        prompt,
        [],
        userContext,
        'debate' // Specify the feature (debate uses OpenAI)
      );
      
      setDebateMessages(messages => [
        ...messages,
        { 
          type: 'philosopher', 
          philosopherId: suggestedPhil.id, 
          text: response.response,
          isIntroduction: true
        }
      ]);
      
    } catch (error) {
      console.error('Error introducing new philosopher:', error);
    }
  }, 500);
  
  // Clear the suggestion
  setSwitchSuggestion(null);
};

  // Debate in progress UI
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col h-full bg-white rounded-lg shadow-md overflow-hidden">
      {/* Debate Header */}
      <div className="p-4 border-b bg-marbleWhite flex justify-between items-center">
  <div className="flex items-center space-x-4">
    {philosopher1 && (
      <div className={`flex items-center p-2 rounded-lg ${philosopher1.accent}`}>
        <div className="w-10 h-10 rounded-full overflow-hidden mr-2">
          <img 
            src={philosopher1.modernImageSrc} 
            alt={philosopher1.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <span className="font-medium">{philosopher1.name}</span>
      </div>
    )}
    <div className="text-aegeanBlue">vs</div>
    {philosopher2 && (
      <div className={`flex items-center p-2 rounded-lg ${philosopher2.accent}`}>
        <div className="w-10 h-10 rounded-full overflow-hidden mr-2">
          <img 
            src={philosopher2.modernImageSrc} 
            alt={philosopher2.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <span className="font-medium">{philosopher2.name}</span>
      </div>
    )}
    {philosopher3 && (
      <>
        <div className="text-aegeanBlue">vs</div>
        <div className={`flex items-center p-2 rounded-lg ${philosopher3.accent}`}>
          <div className="w-10 h-10 rounded-full overflow-hidden mr-2">
            <img 
              src={philosopher3.modernImageSrc} 
              alt={philosopher3.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-medium">{philosopher3.name}</span>
        </div>
      </>
    )}
    {philosopher4 && (
  <>
    <div className="text-aegeanBlue">vs</div>
    <div className={`flex items-center p-2 rounded-lg ${philosopher4.accent}`}>
      <div className="w-10 h-10 rounded-full overflow-hidden mr-2">
        <img 
          src={philosopher4.modernImageSrc} 
          alt={philosopher4.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <span className="font-medium">{philosopher4.name}</span>
    </div>
  </>
)}
  </div>
  <div>
    <Button variant="outline" size="sm" onClick={resetDebate}>
      New Debate
    </Button>
  </div>
</div>
      
      {/* Debate Content */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-marbleWhite/50">
        <AnimatePresence>
          {debateMessages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${
                message.type === 'user' 
                  ? 'justify-end' 
                  : 'justify-start'
              }`}
            >
              {message.type === 'philosopher' ? (
                <div className="flex items-start max-w-[85%]">
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-2 mt-1 flex-shrink-0">
                    <img 
                      src={philosophers.find(p => p.id === message.philosopherId)?.modernImageSrc} 
                      alt={philosophers.find(p => p.id === message.philosopherId)?.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className={`rounded-lg p-3 ${
                    philosophers.find(p => p.id === message.philosopherId)?.accent
                  } ${
                    message.isOpening ? 'border-l-4 border-oliveGold' :
                    message.isConclusion ? 'border-l-4 border-terracotta' : ''
                  }`}>
                    {message.isOpening && (
                      <div className="text-xs uppercase font-medium mb-1 text-oliveGold">Opening Statement</div>
                    )}
                    {message.isConclusion && (
                      <div className="text-xs uppercase font-medium mb-1 text-terracotta">Concluding Remarks</div>
                    )}
                    {message.text.split('\n').map((text, i) => (
                      <React.Fragment key={i}>
                        {text}
                        {i !== message.text.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ) : message.type === 'user' ? (
                <div className="max-w-[80%] rounded-lg p-3 bg-aegeanBlue text-white rounded-tr-none">
                  {message.text}
                </div>
              ) : (
                <div className="w-full bg-philosophicalPurple/10 border border-philosophicalPurple/20 rounded-lg p-3 text-center text-philosophicalPurple">
                  {message.text}
                </div>
              )}
            </motion.div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-aegeanBlue/20 text-aegeanBlue rounded-tl-none">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <PhilosopherSwitch
  isVisible={!!switchSuggestion}
  suggestedPhilosopher={switchSuggestion?.suggestedPhilosopher}
  currentPhilosopher={switchSuggestion?.currentPhilosopher}
  reason={switchSuggestion?.reason}
  onAccept={() => handlePhilosopherSwitch(switchSuggestion)}
  onDecline={() => setSwitchSuggestion(null)}
/>

{/* Points awarded notification */}
<AnimatePresence>
  {pointsAwarded && (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-4 right-4 bg-oliveGold/10 border border-oliveGold/30 text-oliveGold rounded-lg p-3 flex items-center shadow-lg z-20 max-w-xs"
    >
      <span className="text-xl mr-2">✨</span>
      <div>
        <p className="font-medium text-sm">+2 Sophia Points</p>
        <p className="text-xs">For philosophical debate</p>
      </div>
    </motion.div>
  )}
</AnimatePresence>

{/* Achievement unlocked notification */}
<AnimatePresence>
  {achievementUnlocked && (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed top-20 right-4 bg-philosophicalPurple/10 border border-philosophicalPurple/30 text-philosophicalPurple rounded-lg p-3 shadow-lg z-20 max-w-xs"
    >
      <div className="flex items-center mb-1">
        <div className="text-2xl mr-2">{achievementUnlocked.icon}</div>
        <h4 className="font-serif font-semibold">Achievement Unlocked!</h4>
      </div>
      <p className="font-medium text-sm">{achievementUnlocked.name}</p>
      <p className="text-xs text-philosophicalPurple/80">{achievementUnlocked.description}</p>
    </motion.div>
  )}
</AnimatePresence>

{/* Voting UI - Show only after all philosophers have concluded */}
{debateStage === 'conclusion' && 
  !hasVoted &&
  debateMessages.filter(m => m.type === 'philosopher' && m.isConclusion).length >= expectedConclusions && (
  <div className="w-full bg-marbleWhite/70 border border-aegeanBlue/20 rounded-lg p-4 mt-4">
    <h3 className="text-center font-medium text-aegeanBlue mb-2">
      Who made the stronger argument?
    </h3>
    <div className="flex justify-center space-x-6">
      <Button
        onClick={() => handleVote(philosopher1?.id)}
        variant="outline"
        className="flex items-center space-x-2"
      >
        <img 
          src={philosopher1?.modernImageSrc} 
          alt={philosopher1?.name} 
          className="w-6 h-6 rounded-full object-cover" 
        />
        <span>{philosopher1?.name}</span>
        {votes[philosopher1?.id] > 0 && (
          <span className="ml-1 bg-aegeanBlue/10 px-2 py-0.5 rounded-full text-xs">
            {votes[philosopher1?.id]}
          </span>
        )}
      </Button>
      
      <Button
        onClick={() => handleVote(philosopher2?.id)}
        variant="outline"
        className="flex items-center space-x-2"
      >
        <img 
          src={philosopher2?.modernImageSrc} 
          alt={philosopher2?.name} 
          className="w-6 h-6 rounded-full object-cover" 
        />
        <span>{philosopher2?.name}</span>
        {votes[philosopher2?.id] > 0 && (
          <span className="ml-1 bg-aegeanBlue/10 px-2 py-0.5 rounded-full text-xs">
            {votes[philosopher2?.id]}
          </span>
        )}
      </Button>
      
      {philosopher3 && (
        <Button
          onClick={() => handleVote(philosopher3?.id)}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <img 
            src={philosopher3?.modernImageSrc} 
            alt={philosopher3?.name} 
            className="w-6 h-6 rounded-full object-cover" 
          />
          <span>{philosopher3?.name}</span>
          {votes[philosopher3?.id] > 0 && (
            <span className="ml-1 bg-aegeanBlue/10 px-2 py-0.5 rounded-full text-xs">
              {votes[philosopher3?.id]}
            </span>
          )}
        </Button>
      )}

{philosopher4 && (
  <Button
    onClick={() => handleVote(philosopher4?.id)}
    variant="outline"
    className="flex items-center space-x-2"
  >
    <img 
      src={philosopher4?.modernImageSrc} 
      alt={philosopher4?.name} 
      className="w-6 h-6 rounded-full object-cover" 
    />
    <span>{philosopher4?.name}</span>
    {votes[philosopher4?.id] > 0 && (
      <span className="ml-1 bg-aegeanBlue/10 px-2 py-0.5 rounded-full text-xs">
        {votes[philosopher4?.id]}
      </span>
    )}
  </Button>
)}
    </div>
  </div>
)}

<div ref={messagesEndRef} />

          
        </AnimatePresence>
      </div>
      
      {/* Debate Controls */}
      <div className="p-4 border-t bg-white">
        {debateStage === 'discussion' ? (
          <div className="space-y-4">
            <div className="flex space-x-2">
              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="Ask a question or make a comment..."
                className="flex-grow py-2 px-4 border border-aegeanBlue/20 rounded-md focus:outline-none focus:ring-2 focus:ring-aegeanBlue/50 bg-marbleWhite min-h-[40px] max-h-32 resize-y"
                disabled={isLoading}
              />
              <Button
                onClick={handleUserIntervention}
                disabled={!userPrompt.trim() || isLoading}
                variant="secondary"
              >
                Ask
              </Button>
            </div>
            <div className="flex justify-between">
              <Button
                onClick={continueTurn}
                disabled={isLoading || debateStage !== 'discussion'}
                variant="outline"
                className="flex-1 mr-2"
              >
                {isLoading ? 'Thinking...' : `Next Response (${philosophers.find(p => p.id === currentTurn)?.name})`}
              </Button>
              <Button
                onClick={concludeDebate}
                disabled={isLoading || debateStage !== 'discussion' || debateMessages.filter(m => m.type === 'philosopher').length < 4}
                variant="outline"
                className="flex-1 ml-2"
              >
                Conclude Debate
              </Button>
            </div>
          </div>
      ) : debateStage === 'conclusion' ? (
        <div className="flex justify-center space-x-4">
          <Button
            onClick={saveDebate}
            variant="outline"
          >
            Save Transcript
          </Button>
          <Button
            onClick={resetDebate}
            variant="primary"
          >
            Start New Debate
          </Button>
        </div>
        ) : (
          <div className="flex justify-center items-center text-aegeanBlue">
            {isLoading ? 'Starting debate...' : 'Preparing debate...'}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhilosopherDebate;