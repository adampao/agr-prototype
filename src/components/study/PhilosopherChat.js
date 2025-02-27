import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../common/Button';

const philosophers = [
  { 
    id: 'socrates', 
    name: 'Socrates', 
    specialty: 'Ethics & Questioning',
    description: 'The wisest is he who knows he does not know. I will help you question your assumptions and beliefs.',
    imageSrc: '/images/philosophers/socrates.jpg',
    modernImageSrc: '/images/philosophers/socrates_modern.jpg',
    accent: 'bg-philosophicalPurple/20 border-philosophicalPurple/30 text-philosophicalPurple',
  },
  { 
    id: 'aristotle', 
    name: 'Aristotle', 
    specialty: 'Practical Wisdom',
    description: 'Virtue lies in the golden mean. I will help you find balance and practical wisdom in your life.',
    imageSrc: '/images/philosophers/aristotle.jpg',
    modernImageSrc: '/images/philosophers/aristotle_modern.jpg',
    accent: 'bg-aegeanBlue/20 border-aegeanBlue/30 text-aegeanBlue',
  },
  { 
    id: 'plato', 
    name: 'Plato', 
    specialty: 'Forms & Ideals',
    description: 'Reality is found beyond appearances. I will guide you to understand the eternal forms behind the material world.',
    imageSrc: '/images/philosophers/plato.jpg',
    modernImageSrc: '/images/philosophers/plato_modern.jpg',
    accent: 'bg-oliveGold/20 border-oliveGold/30 text-oliveGold/90',
  },
  { 
    id: 'heraclitus', 
    name: 'Heraclitus', 
    specialty: 'Flux & Change',
    description: 'Everything flows, nothing stays. I will help you understand the constant change that pervades all existence.',
    imageSrc: '/images/philosophers/heraclitus.jpg',
    modernImageSrc: '/images/philosophers/heraclitus_modern.jpg',
    accent: 'bg-terracotta/20 border-terracotta/30 text-terracotta',
  },
  { 
    id: 'pythagoras', 
    name: 'Pythagoras', 
    specialty: 'Mathematics & Harmony',
    description: 'All things are numbers. I will reveal how mathematical principles underlie the harmony of the cosmos.',
    imageSrc: '/images/philosophers/pythagoras.jpg',
    modernImageSrc: '/images/philosophers/pythagoras_modern.jpg',
    accent: 'bg-philosophicalPurple/20 border-philosophicalPurple/30 text-philosophicalPurple',
  },
  { 
    id: 'xenophon', 
    name: 'Xenophon', 
    specialty: 'Leadership & History',
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
  const [selectedPhilosopher, setSelectedPhilosopher] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [hoveredPhilosopher, setHoveredPhilosopher] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = () => {
    if (inputValue.trim() && selectedPhilosopher) {
      // Add user message
      setMessages([...messages, { sender: 'user', text: inputValue.trim() }]);
      setInputValue('');
      setIsProcessing(true);
      
      // Simulate AI response with a delay
      setTimeout(() => {
        const responses = sampleResponses[selectedPhilosopher.id];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        setMessages(prevMessages => [
          ...prevMessages, 
          { sender: 'philosopher', philosopherId: selectedPhilosopher.id, text: randomResponse }
        ]);
        setIsProcessing(false);
      }, 1500);
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      {!selectedPhilosopher ? (
        <div className="flex-grow flex items-center justify-center">
          <div className="max-w-2xl w-full p-6">
            <h2 className="text-3xl font-serif font-bold text-aegeanBlue mb-6 text-center">
              Choose Your Philosophical Guide
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto p-2">
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
              }}
              className="p-1 rounded-full hover:bg-white/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img 
                  src={selectedPhilosopher.modernImageSrc} 
                  alt={selectedPhilosopher.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">{selectedPhilosopher.name}</h3>
                <p className="text-xs">{selectedPhilosopher.specialty}</p>
              </div>
            </div>
          </div>
          
          {/* Chat messages */}
          <div 
            ref={messagesContainerRef}
            className="flex-grow overflow-y-auto p-4 space-y-4 bg-marbleWhite/50 h-[calc(100vh-16rem)]"
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
                    <div 
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === 'user' 
                          ? 'bg-aegeanBlue text-white rounded-tr-none' 
                          : `${selectedPhilosopher.accent} rounded-tl-none`
                      }`}
                    >
                      {message.text}
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
            <div ref={messagesEndRef} />
          </div>
          
          {/* Chat input */}
          <div className="p-4 border-t bg-white">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={`Ask ${selectedPhilosopher.name} something...`}
                className="flex-grow py-2 px-4 border border-aegeanBlue/20 rounded-md focus:outline-none focus:ring-2 focus:ring-aegeanBlue/50 bg-marbleWhite"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isProcessing}
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