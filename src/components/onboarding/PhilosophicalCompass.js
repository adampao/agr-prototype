import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../common/Card';
import Button from '../common/Button';

const PhilosophicalCompass = ({ onContinue }) => {
  const [learningStyle, setLearningStyle] = useState(null);
  const [interests, setInterests] = useState([]);
  const [lifeGoal, setLifeGoal] = useState(null);
  
  const handleInterestToggle = (interest) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };
  
  const handleContinue = () => {
    if (learningStyle && interests.length > 0 && lifeGoal) {
      onContinue({ learningStyle, interests, lifeGoal });
    }
  };
  
  const learningStyles = [
    { id: 'text', label: 'Reading and Writing', icon: '📝' },
    { id: 'audio', label: 'Listening and Discussion', icon: '🎧' },
    { id: 'visual', label: 'Visual and Diagrams', icon: '🖼️' },
    { id: 'interactive', label: 'Interactive and Hands-on', icon: '🤝' },
  ];
  
  const philosophicalInterests = [
    { id: 'ethics', label: 'Ethics & Morality' },
    { id: 'politics', label: 'Politics & Governance' },
    { id: 'metaphysics', label: 'Metaphysics & Reality' },
    { id: 'epistemology', label: 'Knowledge & Truth' },
    { id: 'aesthetics', label: 'Beauty & Art' },
    { id: 'logic', label: 'Logic & Reasoning' },
  ];
  
  const lifeGoals = [
    { id: 'knowledge', label: 'Pursuing Knowledge', description: 'Understanding the world and its workings' },
    { id: 'virtue', label: 'Cultivating Virtue', description: 'Developing excellence of character' },
    { id: 'happiness', label: 'Finding Happiness', description: 'Achieving fulfillment and well-being' },
    { id: 'purpose', label: 'Discovering Purpose', description: 'Finding meaning in your existence' },
  ];
  
  return (
    <motion.div 
      className="max-w-3xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif font-bold text-aegeanBlue mb-4">
          Your Philosophical Compass
        </h2>
        <p className="text-lg text-aegeanBlue/80">
          Let's personalize your journey through ancient wisdom.
        </p>
      </div>
      
      {/* Learning Style Section */}
      <div className="mb-12">
        <h3 className="text-xl font-serif font-semibold text-aegeanBlue mb-4">
          How do you prefer to learn?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {learningStyles.map((style, index) => (
            <motion.div
              key={style.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card 
                variant={learningStyle === style.id ? 'philosophical' : 'interactive'}
                className={`transition-all duration-200 ${learningStyle === style.id ? 'ring-2 ring-philosophicalPurple' : ''}`}
                onClick={() => setLearningStyle(style.id)}
              >
                <div className="flex items-center">
                  <span className="text-3xl mr-4">{style.icon}</span>
                  <span className="text-lg">{style.label}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Philosophical Interests Section */}
      <div className="mb-12">
        <h3 className="text-xl font-serif font-semibold text-aegeanBlue mb-4">
          Areas of philosophical interest (select at least one)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {philosophicalInterests.map((interest, index) => (
            <motion.div
              key={interest.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
            >
              <Card 
                variant={interests.includes(interest.id) ? 'philosophical' : 'interactive'}
                className={`transition-all duration-200 ${interests.includes(interest.id) ? 'ring-2 ring-philosophicalPurple' : ''}`}
                onClick={() => handleInterestToggle(interest.id)}
              >
                <div className="text-center py-2">
                  <span className="text-lg">{interest.label}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Life Goals Section */}
      <div className="mb-12">
        <h3 className="text-xl font-serif font-semibold text-aegeanBlue mb-4">
          What is your current life focus?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lifeGoals.map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
            >
              <Card 
                variant={lifeGoal === goal.id ? 'philosophical' : 'interactive'}
                className={`transition-all duration-200 ${lifeGoal === goal.id ? 'ring-2 ring-philosophicalPurple' : ''}`}
                onClick={() => setLifeGoal(goal.id)}
              >
             <div className="p-2">
  <span className="text-lg block mb-1">{goal.label}</span>
  <p className="text-sm text-aegeanBlue/70">{goal.description}</p>
</div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="mt-12 text-center">
        <Button 
          onClick={handleContinue} 
          disabled={!learningStyle || interests.length === 0 || !lifeGoal}
          size="lg"
        >
          Continue to Personalization
        </Button>
      </div>
    </motion.div>
  );
};

export default PhilosophicalCompass;