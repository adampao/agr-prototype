import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../common/Button';
import { sendMessageToPhilosopher } from '../../services/claudeApi';
import { generateSpeech } from '../../services/elevenLabsApi';
import PhilosopherSwitch from './PhilosopherSwitchComponent';
import { analyzeConversation, shouldSuggestPhilosopherSwitch } from './TopicDetectionService';
import AudioPlayer from '../common/AudioPlayer';
import SequentialAudioPlayer from '../common/SequentialAudioPlayer';
import { useAuth } from '../../services/AuthContext';
import { trackFeatureUse } from '../../services/analyticsService';

const philosophers = [
  { 
    id: 'socrates', 
    name: 'Socrates', 
    specialty: 'Ethics & Questioning',
    timePeriod: '470-399 BCE',
    description: 'The wisest is he who knows he does not know. I will help you question your assumptions and beliefs.',
    imageSrc: '/images/philosophers/socrates.jpg',
    modernImageSrc: '/images/philosophers/socrates_modern.jpg',
    accent: 'bg-philosophicalPurple/20 border-philosophicalPurple/30 text-philosophicalPurple',
  },
  { 
    id: 'aristotle', 
    name: 'Aristotle', 
    specialty: 'Practical Wisdom',
    timePeriod: '384-322 BCE',
    description: 'Virtue lies in the golden mean. I will help you find balance and practical wisdom in your life.',
    imageSrc: '/images/philosophers/aristotle.jpg',
    modernImageSrc: '/images/philosophers/aristotle_modern.jpg',
    accent: 'bg-aegeanBlue/20 border-aegeanBlue/30 text-aegeanBlue',
  },
  { 
    id: 'plato', 
    name: 'Plato', 
    specialty: 'Forms & Ideals',
    timePeriod: '428-348 BCE',
    description: 'Reality is found beyond appearances. I will guide you to understand the eternal forms behind the material world.',
    imageSrc: '/images/philosophers/plato.jpg',
    modernImageSrc: '/images/philosophers/plato_modern.jpg',
    accent: 'bg-oliveGold/20 border-oliveGold/30 text-oliveGold/90',
  },
  { 
    id: 'heraclitus', 
    name: 'Heraclitus', 
    specialty: 'Flux & Change',
    timePeriod: '535-475 BCE',
    description: 'Everything flows, nothing stays. I will help you understand the constant change that pervades all existence.',
    imageSrc: '/images/philosophers/heraclitus.jpg',
    modernImageSrc: '/images/philosophers/heraclitus_modern.jpg',
    accent: 'bg-terracotta/20 border-terracotta/30 text-terracotta',
  },
  { 
    id: 'pythagoras', 
    name: 'Pythagoras', 
    specialty: 'Mathematics & Harmony',
    timePeriod: '570-495 BCE',
    description: 'All things are numbers. I will reveal how mathematical principles underlie the harmony of the cosmos.',
    imageSrc: '/images/philosophers/pythagoras.jpg',
    modernImageSrc: '/images/philosophers/pythagoras_modern.jpg',
    accent: 'bg-philosophicalPurple/20 border-philosophicalPurple/30 text-philosophicalPurple',
  },
  { 
    id: 'xenophon', 
    name: 'Xenophon', 
    specialty: 'Leadership & History',
    timePeriod: '430-354 BCE',
    description: 'True leadership comes from character. I will share practical wisdom from historical examples and lived experience.',
    imageSrc: '/images/philosophers/xenophon.jpg',
    modernImageSrc: '/images/philosophers/xenophon_modern.jpg',
    accent: 'bg-oracleGreen/20 border-oracleGreen/30 text-oracleGreen',
  },
];

// Sample messages for the demo, in a real app these would come from the AI
const sampleResponses = {
  socrates: [
    "Have you considered why you believe that to be true?",
    "That's an interesting perspective. What evidence supports it?",
    "Let's examine that claim together. What assumptions are we making?",
    "If that were true, what would the implications be?",
    "I'm curious about how you arrived at that conclusion. Can you walk me through your reasoning?"
  ],
  aristotle: [
    "In my view, the middle path is often wisest. Too much or too little can lead to vice.",
    "Consider the practical application of that idea. How might it serve your eudaimonia - your flourishing?",
    "There are multiple types of knowledge. We must balance theoretical wisdom with practical wisdom.",
    "Every virtue exists as a mean between two extremes. Where does your approach fall?",
    "A good life consists of good activity in accordance with virtue. Let's consider how this applies here."
  ],
  plato: [
    "Consider the eternal Form behind what we observe in the material world.",
    "The physical world is but a shadow of true reality. What is the ideal form of what you seek?",
    "Just as the sun illuminates the visible world, the Form of the Good gives truth to objects of knowledge.",
    "The soul recollects knowledge it possessed before birth. Let us draw it out through dialectic.",
    "The cave of ignorance can only be escaped by turning toward the light of knowledge."
  ],
  heraclitus: [
    "You cannot step into the same river twice, for it is not the same river and you are not the same person.",
    "Opposition brings concord. Out of discord comes the fairest harmony.",
    "The only constant in life is change itself. How can you embrace this flux?",
    "Hidden harmony is better than obvious harmony. Look for the unity beneath the conflict.",
    "The way up and the way down are one and the same. Apparent opposites are secretly connected."
  ],
  pythagoras: [
    "All is number. The cosmos is structured according to mathematical principles.",
    "Harmony arises when opposite forces are balanced in proper proportion.",
    "The soul is immortal and undergoes a series of reincarnations. What has your soul learned?",
    "True wisdom comes from understanding the numerical patterns that govern all things.",
    "Silence is the first step toward wisdom. Let us contemplate the mathematical order of the universe."
  ],
  xenophon: [
    "Leaders must first learn to govern themselves before they can govern others.",
    "History offers practical lessons for those who would lead wisely today.",
    "Proper education builds character, and character determines fate.",
    "A leader must set the example by living the values they espouse.",
    "Experience is the best teacher. Let me share what I've learned through my own journeys."
  ]
};

const PhilosopherChat = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const [selectedPhilosopher, setSelectedPhilosopher] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [userGreeted, setUserGreeted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hoveredPhilosopher, setHoveredPhilosopher] = useState(null);
  const [useClaudeApi, setUseClaudeApi] = useState(true); // Toggle between sample responses and Claude API
  const [apiError, setApiError] = useState(null);
  const [switchSuggestion, setSwitchSuggestion] = useState(null);
  const [recentlySuggested, setRecentlySuggested] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [audioUrls, setAudioUrls] = useState({});
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
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
  
  // Generate audio for a specific message
  const generateAudioForMessage = async (messageText, philosopherId, messageIndex) => {
    console.log(`Generating audio for message index ${messageIndex}, philosopher: ${philosopherId}`);
    setIsGeneratingAudio(true);
    
    try {
      // Limit text length to avoid large requests
      const speechText = messageText.length > 500 
        ? messageText.substring(0, 500) + "..." 
        : messageText;
      
      const audioUrl = await generateSpeech(speechText, philosopherId);
      console.log(`Successfully generated audio for message ${messageIndex}:`, audioUrl ? "SUCCESS" : "FAILED");
      
      if (audioUrl) {
        // Test the audio URL with a temporary Audio object
        const testAudio = new Audio(audioUrl);
        testAudio.volume = 0;
        
        try {
          // Load metadata before setting in state
          await new Promise((resolve, reject) => {
            testAudio.addEventListener('loadedmetadata', resolve);
            testAudio.addEventListener('error', (e) => reject(new Error(`Audio test failed: ${e}`)));
            
            // Set a timeout in case loading hangs
            const timeout = setTimeout(() => {
              reject(new Error('Audio metadata loading timed out'));
            }, 3000);
            
            testAudio.addEventListener('loadedmetadata', () => {
              clearTimeout(timeout);
              resolve();
            });
          });
          
          console.log("Audio test successful, duration:", testAudio.duration);
          
          // Only set the URL after we've validated it works
          setAudioUrls(prev => {
            console.log("Setting audio URL for message index:", messageIndex);
            return {
              ...prev,
              [messageIndex]: audioUrl
            };
          });
          
          return audioUrl;
        } catch (testError) {
          console.error("Audio test failed:", testError);
          return null;
        }
      }
    } catch (error) {
      console.error(`Error generating audio for message ${messageIndex}:`, error);
      return null;
    } finally {
      setIsGeneratingAudio(false);
    }
  };
  

  const formatMessageWithActions = (text) => {
    // Find all action texts (text between asterisks)
    const parts = [];
    let lastIndex = 0;
    const actionRegex = /\*([^*]+)\*/g;
    let match;
    
    while ((match = actionRegex.exec(text)) !== null) {
      // Add text before the action
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`}>{text.substring(lastIndex, match.index)}</span>
        );
      }
      
      // Add the action text with special styling
      parts.push(
        <span 
          key={`action-${match.index}`}
          className="italic text-gray-500"
        >
          {match[1]}
        </span>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add any remaining text
    if (lastIndex < text.length) {
      parts.push(
        <span key={`text-${lastIndex}`}>{text.substring(lastIndex)}</span>
      );
    }
    
    return parts.length > 0 ? parts : text;
  };

  // Debug function to show audio URL status
  const debugAudioUrls = () => {
    console.log("Current audio URLs:", audioUrls);
    console.log("Messages count:", messages.length);
    
    // Find any mismatches
    const messagesWithMissingAudio = messages
      .map((msg, idx) => ({ msg, idx }))
      .filter(({ msg, idx }) => 
        msg.sender === 'philosopher' && !audioUrls[idx]
      );
      
    console.log(
      "Philosopher messages without audio:", 
      messagesWithMissingAudio.length, 
      messagesWithMissingAudio
    );
    
    // Test playing the latest audio
    if (messages.length > 0 && messages[messages.length-1].sender === 'philosopher') {
      const latestAudioUrl = audioUrls[messages.length-1];
      if (latestAudioUrl) {
        console.log("Trying to play latest audio:", latestAudioUrl);
        const audio = new Audio(latestAudioUrl);
        audio.volume = 0.7;
        audio.play()
          .then(() => console.log("Playing audio successfully"))
          .catch(err => console.error("Error playing audio:", err));
      } else {
        console.log("No audio URL for the latest message");
      }
    }
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Effect to greet the user with their name when a philosopher is selected
  useEffect(() => {
    if (selectedPhilosopher && currentUser && !userGreeted && messages.length === 0) {
      const userName = currentUser.name || "seeker of wisdom";
      const greetingText = `Greetings, ${userName}. I am ${selectedPhilosopher.name}. How may I assist you on your philosophical journey today?`;
      
      setMessages([{ 
        sender: 'philosopher', 
        philosopherId: selectedPhilosopher.id, 
        text: greetingText 
      }]);
      
      setUserGreeted(true);
      
      // Generate audio for greeting if voice is enabled
      if (voiceEnabled) {
        setTimeout(async () => {
          try {
            const audioUrlArray = await generateSpeech(greetingText, selectedPhilosopher.id);
            if (audioUrlArray && audioUrlArray.length > 0) {
              setAudioUrls(prev => ({ ...prev, [0]: audioUrlArray }));
            }
          } catch (error) {
            console.error('Error generating greeting audio:', error);
          }
        }, 100);
      }
    }
  }, [selectedPhilosopher, currentUser, userGreeted, messages.length, voiceEnabled]);

  
  const handleSendMessage = async () => {
    if (inputValue.trim() && selectedPhilosopher) {
      // Track this interaction for analytics
      trackFeatureUse(`philosopher_chat_${selectedPhilosopher.id}`);
      
      // Add user message
      const userMessage = { sender: 'user', text: inputValue.trim() };
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setInputValue('');
      setIsProcessing(true);
      setApiError(null);
      
      // Award Sophia points for interacting with philosophers (once per session)
      if (!pointsAwarded && currentUser) {
        awardSophiaPoints(1);
      }
      
      try {
        let philosopherResponse = "";
        
        if (useClaudeApi) {
          // Format previous messages for Claude API
          const previousMessages = messages.map(msg => {
            // For all message types, create the appropriate format
            if (msg.sender === 'user') {
              return { role: 'user', content: msg.text };
            } else if (msg.sender === 'system') {
              // Include system messages as assistant messages with a prefix
              return { role: 'assistant', content: `[System: ${msg.text}]` };
            } else {
              // Regular philosopher messages
              return { role: 'assistant', content: msg.text };
            }
          });
          
          // Include user info in system message for Claude
          let userContext = "";
          if (currentUser) {
            userContext = `You are speaking to ${currentUser.name || "a seeker of wisdom"}. `;
            if (currentUser.preferences && currentUser.preferences.interests && currentUser.preferences.interests.length > 0) {
              userContext += `Their philosophical interests include: ${currentUser.preferences.interests.join(", ")}. `;
            }
          }
        
          // Send to Claude API via our Netlify function
          const response = await sendMessageToPhilosopher(
            selectedPhilosopher.id, 
            inputValue.trim(),
            previousMessages,
            userContext
          );
          
          philosopherResponse = response.response;
          
          // IMPORTANT: First add the philosopher message to the messages array
          // This ensures the message is added before we try to generate audio
          setMessages(prevMessages => {
            const updatedMessages = [
              ...prevMessages, 
              { 
                sender: 'philosopher', 
                philosopherId: selectedPhilosopher.id, 
                text: philosopherResponse 
              }
            ];
            
            // Then generate audio after a small delay to ensure state is updated
            if (voiceEnabled) {
              const newMessageIndex = updatedMessages.length - 1;
              
              // Use setTimeout to ensure state update completes first
              setTimeout(async () => {
                try {
                  setIsGeneratingAudio(true);
                  console.log("Generating speech for:", philosopherResponse.substring(0, 50) + "...");
                  
                  // The updated generateSpeech now returns an array of audio URLs
                  const audioUrlArray = await generateSpeech(philosopherResponse, selectedPhilosopher.id);
                  console.log("Generated audio URLs:", audioUrlArray.length);
                  
                  if (audioUrlArray && audioUrlArray.length > 0) {
                    // Store the array of URLs in state
                    setAudioUrls(prev => {
                      console.log("Setting audio URLs for message index:", newMessageIndex);
                      return {
                        ...prev,
                        [newMessageIndex]: audioUrlArray
                      };
                    });
                  }
                } catch (error) {
                  console.error('Error generating audio:', error);
                } finally {
                  setIsGeneratingAudio(false);
                }
              }, 100);
            }
            
            return updatedMessages;
          });
          
        } else {
          // Fallback to sample responses with a delay
          const responses = sampleResponses[selectedPhilosopher.id];
          philosopherResponse = responses[Math.floor(Math.random() * responses.length)];
          
          setTimeout(() => {
            setMessages(prevMessages => [
              ...prevMessages, 
              { sender: 'philosopher', philosopherId: selectedPhilosopher.id, text: philosopherResponse }
            ]);
          }, 1500);
        }
        
        // Only check for philosopher suggestions if we're using Claude API and not recently suggested
        if (useClaudeApi && !recentlySuggested) {
          // Look for mentions of other philosophers in the response
          const mentionedPhilosophers = [];
          
          philosophers.forEach(philosopher => {
            // Skip the current philosopher
            if (philosopher.id !== selectedPhilosopher.id) {
              // Check if this philosopher is mentioned in the response
              if (philosopherResponse.includes(philosopher.name)) {
                mentionedPhilosophers.push(philosopher);
              }
            }
          });
          
          console.log("Mentioned philosophers:", mentionedPhilosophers);
          
          // If any philosophers were mentioned
          if (mentionedPhilosophers.length > 0) {
            // Use the first mentioned philosopher
            const suggestedPhilosopher = mentionedPhilosophers[0];
            
            // Extract a reason from the response
            let reason = "They may have more relevant insights on this topic.";
            
            // Look for sentences mentioning the philosopher
            const sentences = philosopherResponse.split(/[.!?]+/);
            for (const sentence of sentences) {
              if (sentence.includes(suggestedPhilosopher.name)) {
                reason = sentence.trim();
                break;
              }
            }
            
            // Set the switch suggestion
            console.log("Setting switch suggestion:", {
              suggestedPhilosopher: suggestedPhilosopher.name,
              currentPhilosopher: selectedPhilosopher.name,
              reason: reason
            });
            
            // Wait a moment for the UI to update with the philosopher's response
            setTimeout(() => {
              setSwitchSuggestion({
                suggestedPhilosopher: suggestedPhilosopher.name,
                currentPhilosopher: selectedPhilosopher.name,
                reason: reason,
                topic: "historical context"
              });
              setRecentlySuggested(true);
              
              // Reset the recently suggested flag after 5 minutes
              setTimeout(() => {
                setRecentlySuggested(false);
              }, 1 * 10 * 1000);
            }, 1500);

            // Scroll to make sure the suggestion is visible
            setTimeout(() => {
              messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 1600);
          }
        }
        
      } catch (error) {
        console.error('Error getting philosopher response:', error);
        setApiError('There was an error communicating with the philosopher. Please try again.');
        
        // Add more descriptive error message in chat
        setMessages(prevMessages => [
          ...prevMessages, 
          { 
            sender: 'system', 
            text: `I apologize, but I'm having trouble connecting with the philosophical realm at the moment. ${error.response?.data?.hint || error.message || "Please try again shortly."}` 
          }
        ]);
      } finally {
        setIsProcessing(false);
        
        // Focus back on input after response using a small delay to ensure the DOM is ready
        setTimeout(() => {
          const inputElement = document.getElementById('chat-input');
          if (inputElement) {
            inputElement.focus();
          }
        }, 50);
      }
    }
  };

  const handleAcceptSwitch = () => {
    if (!switchSuggestion) return;
    
    // Find the suggested philosopher object
    const newPhilosopher = philosophers.find(p => 
      p.name === switchSuggestion.suggestedPhilosopher
    );
    
    if (newPhilosopher) {
      // Create a summary of the last few messages for context
      const recentUserMessages = messages
        .filter(msg => msg.sender === 'user')
        .slice(-2)
        .map(msg => msg.text);
      
      const recentPhilosopherMessages = messages
        .filter(msg => msg.sender === 'philosopher')
        .slice(-1)
        .map(msg => msg.text);
      
      // Add system message about the switch
      setMessages(prevMessages => [
        ...prevMessages,
        { 
          sender: 'system', 
          text: `${selectedPhilosopher.name} has suggested continuing this discussion with ${newPhilosopher.name}, who has greater expertise in this area.`
        }
      ]);
      
      // Switch to the new philosopher
      setSelectedPhilosopher(newPhilosopher);
      
      // Clear the suggestion
      setSwitchSuggestion(null);
      
      // Get the most recent user message to potentially answer
      const mostRecentUserMessage = recentUserMessages.length > 0 ? recentUserMessages[recentUserMessages.length - 1] : '';
      
      // Create a contextual introduction from the new philosopher 
      // and potentially answer the user's question in the same message
      setTimeout(async () => {
        // Create array of greeting templates
        const greetingTemplates = [
          `Greetings, I am ${newPhilosopher.name}. I notice you've been exploring ideas with my colleague. I'd be delighted to offer my perspective, particularly drawing on my knowledge of ${newPhilosopher.specialty}.`,
          
          `I see you seek wisdom from different angles. As ${newPhilosopher.name}, I bring my own unique approach to these questions, shaped by my focus on ${newPhilosopher.specialty}.`,
          
          `Ah, an inquiring mind! I've been summoned to continue this philosophical journey. As ${newPhilosopher.name}, I may illuminate different aspects with my expertise in ${newPhilosopher.specialty}.`,
          
          `I have been called to join this dialogue. ${newPhilosopher.name} at your service, ready to explore these ideas through the lens of ${newPhilosopher.specialty}.`,
          
          `The path of wisdom often requires many guides. I am ${newPhilosopher.name}, and I'm pleased to join this conversation with my insights on ${newPhilosopher.specialty}.`
        ];
        
        // Select a random greeting template
        const randomIndex = Math.floor(Math.random() * greetingTemplates.length);
        let introMessage = greetingTemplates[randomIndex];
        
        // If there's a recent user message to address and we're using the Claude API
        if (mostRecentUserMessage && useClaudeApi) {
          try {
            setIsProcessing(true);
            
            // Format previous messages excluding the most recent philosopher switch messages
            const previousMessages = messages
              .filter(msg => !(msg.sender === 'system' && msg.text.includes('continuing this discussion with')))
              .slice(0, -1) // Remove the system message about the switch
              .map(msg => {
                if (msg.sender === 'user') {
                  return { role: 'user', content: msg.text };
                } else if (msg.sender === 'system') {
                  return { role: 'assistant', content: `[System: ${msg.text}]` };
                } else {
                  return { role: 'assistant', content: msg.text };
                }
              });
            
            // Generate a direct answer to the user's question
            const response = await sendMessageToPhilosopher(
              newPhilosopher.id,
              mostRecentUserMessage,
              previousMessages
            );
            
            // Combine the introduction with the answer
            introMessage = `${introMessage}\n\nRegarding your question: ${response.response}`;
            
          } catch (error) {
            console.error('Error getting philosopher response for intro:', error);
            // Just use the intro message if there's an error
          } finally {
            setIsProcessing(false);
          }
        }
        
        // Add the message to the chat
        setMessages(prevMessages => {
          const updatedMessages = [
            ...prevMessages,
            { 
              sender: 'philosopher', 
              philosopherId: newPhilosopher.id, 
              text: introMessage
            }
          ];
          
          // Generate audio for the introduction message
          if (voiceEnabled) {
            const newMessageIndex = updatedMessages.length - 1;
            setTimeout(async () => {
              try {
                setIsGeneratingAudio(true);
                
                // The updated generateSpeech now returns an array of audio URLs
                const audioUrlArray = await generateSpeech(introMessage, newPhilosopher.id);
                
                if (audioUrlArray && audioUrlArray.length > 0) {
                  // Store the array of URLs in state
                  setAudioUrls(prev => {
                    return {
                      ...prev,
                      [newMessageIndex]: audioUrlArray
                    };
                  });
                }
              } catch (error) {
                console.error('Error generating audio:', error);
              } finally {
                setIsGeneratingAudio(false);
              }
            }, 100);
          }
          
          return updatedMessages;
        });
      }, 500);
    }
  };

  const handleDeclineSwitch = () => {
    // Add a message acknowledging the user's preference
    setMessages(prevMessages => [
      ...prevMessages,
      { 
        sender: 'system', 
        text: `Continuing the conversation with ${selectedPhilosopher.name}.`
      }
    ]);
    
    // Clear the suggestion
    setSwitchSuggestion(null);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
    // Shift+Enter will create a new line without submitting (default textarea behavior)
  };
  
  return (
    <div className="h-full flex flex-col">
      {!selectedPhilosopher ? (
        <div className="flex-grow flex items-center justify-center">
          <div className="max-w-2xl w-full p-6">
            <h2 className="text-3xl font-serif font-bold text-aegeanBlue mb-6 text-center">
              Choose Your Philosophical Guide
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto p-2">
              {philosophers.map((philosopher) => (
                <motion.div
                  key={philosopher.id}
                  whileHover={{ scale: 1.03 }}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${philosopher.accent}`}
                  onClick={() => setSelectedPhilosopher(philosopher)}
                  onMouseEnter={() => setHoveredPhilosopher(philosopher.id)}
                  onMouseLeave={() => setHoveredPhilosopher(null)}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden mb-3 transition-all duration-300">
                      <img 
                        src={hoveredPhilosopher === philosopher.id ? philosopher.modernImageSrc : philosopher.imageSrc} 
                        alt={philosopher.name} 
                        className="w-full h-full object-cover transition-opacity duration-300"
                      />
                    </div>
                    <h3 className="text-xl font-medium mb-1">{philosopher.name}</h3>
                    <p className="text-sm font-medium mb-3">{philosopher.specialty}</p>
                    <p className="text-sm">{philosopher.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-grow flex flex-col h-full">
          {/* Chat header */}
          <div className={`p-4 flex items-center space-x-4 border-b ${selectedPhilosopher.accent}`}>
            <button 
              onClick={() => {
                setSelectedPhilosopher(null);
                setMessages([]);
                setAudioUrls({});
              }}
              className="p-1 rounded-full hover:bg-white/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 rounded-full overflow-hidden shadow-md">
                <img 
                  src={selectedPhilosopher.modernImageSrc} 
                  alt={selectedPhilosopher.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-grow">
                <h3 className="font-medium">{selectedPhilosopher.name}</h3>
                <p className="text-xs">{selectedPhilosopher.specialty}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setUseClaudeApi(!useClaudeApi)}
                  className={`text-xs p-1 rounded-md transition-colors ${
                    useClaudeApi ? 'bg-oracleGreen/20 text-oracleGreen' : 'bg-aegeanBlue/20 text-aegeanBlue'
                  }`}
                  title={useClaudeApi ? "Using Claude AI" : "Using sample responses"}
                >
                  {useClaudeApi ? "AI Mode" : "Demo Mode"}
                </button>
                <button 
                  onClick={() => {
                    if (!voiceEnabled) {
                      // Track attempt to use voice feature
                      trackFeatureUse('voice_feature_attempt');
                      
                      // Prompt for password when trying to turn voice on
                      const password = prompt("Enter password to enable voice feature:");
                      if (password === "agr-voice-on") {
                        setVoiceEnabled(true);
                        trackFeatureUse('voice_feature_enabled');
                      } else {
                        alert("Incorrect password. Voice feature remains disabled.");
                      }
                    } else {
                      // No password required to turn voice off
                      setVoiceEnabled(false);
                    }
                  }}
                  className={`text-xs p-1 rounded-md transition-colors ${
                    voiceEnabled ? 'bg-philosophicalPurple/20 text-philosophicalPurple' : 'bg-gray-200 text-gray-600'
                  }`}
                  title={voiceEnabled ? "Voice enabled" : "Voice disabled (password required)"}
                >
                  {voiceEnabled ? "Voice On" : "Voice Off 🔒"}
                </button>
              </div>
            </div>
          </div>
          
          {/* Chat messages */}
          <div 
            ref={messagesContainerRef}
            className="flex-grow overflow-y-auto p-4 space-y-4 bg-marbleWhite/50 h-[calc(60vh-8rem)]"
          >
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-aegeanBlue/60 max-w-md">
                  <p className="mb-3 text-lg">
                    Begin your dialogue with {selectedPhilosopher.name}.
                  </p>
                  <p className="text-sm">
                    Ask a question about ethics, knowledge, purpose, 
                    or any philosophical matter on your mind.
                  </p>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <AnimatePresence key={index} mode="popLayout">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.sender === 'philosopher' && (
                      <div className="mr-2 flex-shrink-0">
                        <div className="w-12 h-12 rounded-full overflow-hidden shadow-md">
                          <img 
                            src={messages[index].philosopherId ? philosophers.find(p => p.id === messages[index].philosopherId).modernImageSrc : selectedPhilosopher.modernImageSrc}
                            alt={messages[index].philosopherId ? philosophers.find(p => p.id === messages[index].philosopherId).name : selectedPhilosopher.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                    <div 
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === 'user' 
                          ? 'bg-aegeanBlue text-white rounded-tr-none' 
                          : message.sender === 'system'
                            ? 'bg-terracotta/80 text-white rounded-tl-none'
                            : `${selectedPhilosopher.accent} rounded-tl-none`
                      }`}
                    >
                      {message.text.split('\n').map((text, i) => (
  <React.Fragment key={i}>
    {formatMessageWithActions(text)}
    {i !== message.text.split('\n').length - 1 && <br />}
  </React.Fragment>
))}
                      
                      {/* Add audio player for philosopher messages */}
                      {message.sender === 'philosopher' && audioUrls[index] && (
  <div className="mt-2 pt-2 border-t border-aegeanBlue/20">
    {Array.isArray(audioUrls[index]) ? (
      <SequentialAudioPlayer 
        audioUrls={audioUrls[index]} 
        autoPlay={index === messages.length - 1}
        key={`audio-${index}-${audioUrls[index].length}`}
      />
    ) : (
      <AudioPlayer 
        audioUrl={audioUrls[index]} 
        autoPlay={index === messages.length - 1}
        key={`audio-${index}-${typeof audioUrls[index] === 'string' ? audioUrls[index].substr(-10) : 0}`}
      />
    )}
  </div>
)}
                      
                    </div>
                  </motion.div>
                </AnimatePresence>
              ))
            )}
            {isProcessing && (
              <div className="flex justify-start">
                <div className={`max-w-[80%] rounded-lg p-3 ${selectedPhilosopher.accent} rounded-tl-none`}>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            {/* Philosopher switch suggestion component */}
            <PhilosopherSwitch
              isVisible={!!switchSuggestion}
              suggestedPhilosopher={switchSuggestion?.suggestedPhilosopher}
              currentPhilosopher={selectedPhilosopher?.name}
              reason={switchSuggestion?.reason}
              onAccept={handleAcceptSwitch}
              onDecline={handleDeclineSwitch}
            />
            
            {/* Points awarded notification - more subtle positioning */}
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
                    <p className="font-medium text-sm">+1 Sophia Point</p>
                    <p className="text-xs">For philosophical dialogue with {selectedPhilosopher?.name}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Achievement unlocked notification - more subtle */}
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
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Chat input */}
          <div className="p-4 border-t bg-white">
            <div className="flex space-x-2">
              <textarea
                id="chat-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={`Ask ${selectedPhilosopher.name} something... (Shift+Enter for new line)`}
                className="flex-grow py-2 px-4 border border-aegeanBlue/20 rounded-md focus:outline-none focus:ring-2 focus:ring-aegeanBlue/50 bg-marbleWhite min-h-[2.5rem] max-h-32 resize-y"
                onKeyDown={handleKeyPress}
                disabled={isProcessing}
                rows={1}
                autoFocus
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isProcessing}
                variant="secondary"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhilosopherChat;