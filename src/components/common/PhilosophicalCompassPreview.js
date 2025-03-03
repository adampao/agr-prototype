import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Card from './Card';
import Button from './Button';

const philosophicalSchools = [
  {
    id: 'stoic',
    name: 'Stoicism',
    description: 'Focused on personal ethics, rationality, and mindfulness.',
    color: '#614B79', // PHILOSOPHICAL_PURPLE
  },
  {
    id: 'peripatetic',
    name: 'Aristotelianism',
    description: 'Emphasizes practical wisdom, virtue ethics, and moderation.',
    color: '#1E4B8C', // AEGEAN_BLUE
  },
  {
    id: 'platonic',
    name: 'Platonism',
    description: 'Focuses on abstract forms, ideals, and the pursuit of absolute truth.',
    color: '#C5A572', // OLIVE_GOLD
  },
  {
    id: 'skeptic',
    name: 'Skepticism',
    description: 'Questions assumptions, avoids dogmatism, and suspends judgment.',
    color: '#39725E', // ORACLE_GREEN
  },
  {
    id: 'cynic',
    name: 'Cynicism',
    description: 'Rejects social conventions in favor of living virtuously in accordance with nature.',
    color: '#C24D2C', // TERRACOTTA
  }
];

const PhilosophicalCompassPreview = () => {
  const [selectedValue, setSelectedValue] = useState(null);
  const [showResults, setShowResults] = useState(false);
  
  // Predefined results based on the selection
  const resultMapping = {
    'knowledge': { primary: 'platonic', secondary: 'skeptic' },
    'virtue': { primary: 'stoic', secondary: 'peripatetic' },
    'happiness': { primary: 'peripatetic', secondary: 'stoic' },
    'purpose': { primary: 'skeptic', secondary: 'cynic' }
  };
  
  const handleValueSelect = (value) => {
    setSelectedValue(value);
  };
  
  const handleViewResults = () => {
    setShowResults(true);
  };
  
  // Get primary and secondary schools based on selection
  const getResults = () => {
    if (!selectedValue) return { primary: null, secondary: null };
    return resultMapping[selectedValue] || { primary: null, secondary: null };
  };
  
  const { primary, secondary } = getResults();
  const primarySchool = primary ? philosophicalSchools.find(s => s.id === primary) : null;
  const secondarySchool = secondary ? philosophicalSchools.find(s => s.id === secondary) : null;
  
  // Sample affinity data for visualization
  const normalizedAffinities = () => {
    if (!primarySchool) return {};
    
    const result = {};
    philosophicalSchools.forEach(school => {
      if (school.id === primary) {
        result[school.id] = 70;
      } else if (school.id === secondary) {
        result[school.id] = 50;
      } else {
        result[school.id] = Math.floor(Math.random() * 30) + 10; // Random value between 10-40
      }
    });
    
    return result;
  };
  
  const normalized = normalizedAffinities();
  
  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-aegeanBlue mb-4">
            Discover Your Philosophical Compass
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-aegeanBlue/80">
            Uncover which ancient Greek philosophical school resonates most with your worldview.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {!showResults ? (
            <Card className="mb-8">
              <div className="mb-6">
                <h3 className="text-xl font-serif font-semibold text-aegeanBlue mb-4">
                  Quick Question: What matters most to you right now?
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {[
                    { id: 'knowledge', label: 'Pursuing Knowledge', description: 'Understanding the world and its workings' },
                    { id: 'virtue', label: 'Cultivating Virtue', description: 'Developing excellence of character' },
                    { id: 'happiness', label: 'Finding Happiness', description: 'Achieving fulfillment and well-being' },
                    { id: 'purpose', label: 'Discovering Purpose', description: 'Finding meaning in your existence' },
                  ].map((value, index) => (
                    <motion.div
                      key={value.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                      <Card 
                        variant={selectedValue === value.id ? 'philosophical' : 'interactive'}
                        className={`transition-all duration-200 ${selectedValue === value.id ? 'ring-2 ring-philosophicalPurple' : ''}`}
                        onClick={() => handleValueSelect(value.id)}
                      >
                        <div className="p-2">
                          <span className="text-lg block mb-1">{value.label}</span>
                          <p className="text-sm text-aegeanBlue/70">{value.description}</p>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <Button 
                  onClick={handleViewResults} 
                  disabled={!selectedValue}
                  size="lg"
                >
                  View Your Compass
                </Button>
              </div>
            </Card>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="relative overflow-hidden mb-8">
                <h3 className="text-lg font-serif font-semibold text-aegeanBlue mb-4">
                  Your Philosophical Compass Preview
                </h3>
                
                <div className="flex flex-col md:flex-row gap-6 mb-6">
                  {/* Primary School */}
                  {primarySchool && (
                    <div className="flex-1">
                      <div 
                        className="rounded-lg p-4 mb-2" 
                        style={{ backgroundColor: `${primarySchool.color}15` }}
                      >
                        <h4 className="font-medium text-aegeanBlue flex items-center">
                          <span className="mr-2 w-3 h-3 rounded-full" style={{ backgroundColor: primarySchool.color }}></span>
                          Primary Tendency: {primarySchool.name}
                        </h4>
                        <p className="text-sm text-aegeanBlue/70 mt-1">
                          {primarySchool.description}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Secondary School */}
                  {secondarySchool && (
                    <div className="flex-1">
                      <div 
                        className="rounded-lg p-4 mb-2" 
                        style={{ backgroundColor: `${secondarySchool.color}15` }}
                      >
                        <h4 className="font-medium text-aegeanBlue flex items-center">
                          <span className="mr-2 w-3 h-3 rounded-full" style={{ backgroundColor: secondarySchool.color }}></span>
                          Secondary Tendency: {secondarySchool.name}
                        </h4>
                        <p className="text-sm text-aegeanBlue/70 mt-1">
                          {secondarySchool.description}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Philosophical Spectrum Visualization */}
                <div className="mt-6">
                  <h4 className="text-md font-medium text-aegeanBlue mb-3">
                    Your Philosophical Spectrum
                  </h4>
                  
                  <div className="space-y-3">
                    {philosophicalSchools.map(school => (
                      <div key={school.id} className="relative">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-aegeanBlue">{school.name}</span>
                          <span className="text-aegeanBlue/70">{normalized[school.id] || 0}%</span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${normalized[school.id] || 0}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: school.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <p className="text-aegeanBlue/80 mb-4">
                    This is just a preview. Complete the onboarding process to discover your full philosophical profile.
                  </p>
                  <Link to="/onboarding">
                    <Button size="lg">Continue to Full Assessment</Button>
                  </Link>
                </div>
              </Card>
              
              <div className="text-center">
                <Button 
                  variant="ghost"
                  onClick={() => {
                    setShowResults(false);
                    setSelectedValue(null);
                  }}
                >
                  Try Again
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhilosophicalCompassPreview;