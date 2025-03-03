import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../common/Card';

const philosophicalSchools = [
  {
    id: 'stoic',
    name: 'Stoicism',
    description: 'Focused on personal ethics, rationality, and mindfulness. Values virtue as the highest good and seeks tranquility through acceptance of what cannot be changed.',
    keyFigures: ['Zeno of Citium', 'Seneca', 'Epictetus', 'Marcus Aurelius'],
    color: '#614B79', // PHILOSOPHICAL_PURPLE
    traits: ['rational', 'disciplined', 'resilient', 'mindful', 'ethical']
  },
  {
    id: 'peripatetic',
    name: 'Aristotelianism',
    description: 'Emphasizes practical wisdom, virtue ethics, and moderation. Seeks happiness through cultivating excellence in action and finding the "golden mean".',
    keyFigures: ['Aristotle', 'Theophrastus', 'Alexander of Aphrodisias'],
    color: '#1E4B8C', // AEGEAN_BLUE
    traits: ['analytical', 'practical', 'balanced', 'empirical', 'systematic']
  },
  {
    id: 'platonic',
    name: 'Platonism',
    description: 'Focuses on abstract forms, ideals, and the pursuit of absolute truth. Values wisdom and contemplation as paths to understanding reality beyond appearances.',
    keyFigures: ['Plato', 'Plotinus', 'Proclus', 'St. Augustine'],
    color: '#C5A572', // OLIVE_GOLD
    traits: ['idealistic', 'contemplative', 'abstract', 'transcendent', 'perfectionist']
  },
  {
    id: 'skeptic',
    name: 'Skepticism',
    description: 'Questions assumptions, avoids dogmatism, and suspends judgment. Seeks tranquility through recognizing the limits of knowledge and avoiding rigid beliefs.',
    keyFigures: ['Pyrrho', 'Sextus Empiricus', 'Carneades'],
    color: '#39725E', // ORACLE_GREEN
    traits: ['questioning', 'open-minded', 'cautious', 'analytical', 'flexible']
  },
  {
    id: 'cynic',
    name: 'Cynicism',
    description: 'Rejects social conventions, material possessions, and reputation in favor of living virtuously in accordance with nature. Values authenticity and simplicity.',
    keyFigures: ['Diogenes of Sinope', 'Crates', 'Hipparchia'],
    color: '#C24D2C', // TERRACOTTA
    traits: ['unconventional', 'minimalist', 'authentic', 'provocative', 'naturalistic']
  }
];

// Map philosopher to their primary school
const philosopherSchoolMap = {
  'socrates': ['skeptic', 'platonic'],
  'plato': ['platonic'],
  'aristotle': ['peripatetic'],
  'heraclitus': ['cynic', 'skeptic'],
  'pythagoras': ['platonic'],
  'xenophon': ['stoic', 'peripatetic'],
  'diogenes': ['cynic'],
  'zeno': ['stoic'],
  'epicurus': ['epicurean', 'skeptic']
};

const PhilosophicalCompass = ({ userProfile, onSave }) => {
  const [compassData, setCompassData] = useState(userProfile?.philosophicalCompass || {
    primarySchool: null,
    secondarySchool: null,
    affinities: {
      'stoic': 0,
      'peripatetic': 0,
      'platonic': 0,
      'skeptic': 0,
      'cynic': 0
    },
    lastUpdated: null
  });
  
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Calculate compass data based on user interactions - only when component mounts
  useEffect(() => {
    if (!userProfile || isUpdating) return;
    
    // If we already have compass data with a lastUpdated timestamp
    // that's less than 1 hour old, don't recalculate
    if (userProfile.philosophicalCompass && 
        userProfile.philosophicalCompass.lastUpdated) {
      const lastUpdate = new Date(userProfile.philosophicalCompass.lastUpdated);
      const oneHourAgo = new Date();
      oneHourAgo.setHours(oneHourAgo.getHours() - 1);
      
      if (lastUpdate > oneHourAgo) {
        setCompassData(userProfile.philosophicalCompass);
        return;
      }
    }
    
    // Start updating process
    setIsUpdating(true);
    
    // Analyze user data to determine philosophical tendencies
    const newAffinities = calculateAffinities(userProfile);
    
    // Sort schools by affinity
    const sortedSchools = Object.entries(newAffinities)
      .sort((a, b) => b[1] - a[1]);
    
    // Update compass data
    const newCompassData = {
      primarySchool: sortedSchools.length > 0 ? sortedSchools[0][0] : null,
      secondarySchool: sortedSchools.length > 1 ? sortedSchools[1][0] : null,
      affinities: newAffinities,
      lastUpdated: new Date().toISOString()
    };
    
    setCompassData(newCompassData);
    
    // Save updated compass data, but only once when mounting
    if (onSave) {
      onSave(newCompassData);
    }
    
    setIsUpdating(false);
    
  // Add userProfile as a dependency, but have logic to prevent continuous updates
  }, [userProfile?.philosophicalCompass?.lastUpdated]);
  
  const calculateAffinities = (user) => {
    const affinities = {
      'stoic': 0,
      'peripatetic': 0,
      'platonic': 0,
      'skeptic': 0,
      'cynic': 0
    };
    
    // Base affinity from interests
    if (user.preferences && user.preferences.interests) {
      if (user.preferences.interests.includes('ethics')) {
        affinities.stoic += 2;
        affinities.peripatetic += 1;
      }
      if (user.preferences.interests.includes('metaphysics')) {
        affinities.platonic += 2;
        affinities.peripatetic += 1;
      }
      if (user.preferences.interests.includes('politics')) {
        affinities.peripatetic += 2;
        affinities.stoic += 1;
      }
    }
    
    // Analyze journal entries, if available
    const journalEntries = JSON.parse(localStorage.getItem(`journalEntries_${user.email || 'default'}`)) || [];
    
    // Process journal entries for philosophical tendencies
    journalEntries.forEach(entry => {
      // Check which philosopher provided insights
      if (entry.philosopher) {
        const philosopher = entry.philosopher.toLowerCase();
        const schools = philosopherSchoolMap[philosopher] || [];
        
        // Increase affinity for schools associated with this philosopher
        schools.forEach(school => {
          if (affinities[school] !== undefined) {
            affinities[school] += 0.5;
          }
        });
      }
      
      // Check content for keywords associated with each school
      if (entry.content) {
        const content = entry.content.toLowerCase();
        
        // Check for stoic keywords
        if (/virtue|control|rational|discipline|acceptance/i.test(content)) {
          affinities.stoic += 0.5;
        }
        
        // Check for peripatetic keywords
        if (/moderation|balance|practical|excellence|empirical/i.test(content)) {
          affinities.peripatetic += 0.5;
        }
        
        // Check for platonic keywords
        if (/ideal|form|abstract|truth|reality|essence/i.test(content)) {
          affinities.platonic += 0.5;
        }
        
        // Check for skeptic keywords
        if (/doubt|question|uncertain|suspend|judgment/i.test(content)) {
          affinities.skeptic += 0.5;
        }
        
        // Check for cynic keywords
        if (/authentic|natural|convention|simple|material/i.test(content)) {
          affinities.cynic += 0.5;
        }
      }
    });
    
    // Debate participation affects affinities
    if (user.stats && user.stats.debatesCount > 0) {
      // Users who debate more tend toward dialectical approaches
      affinities.platonic += user.stats.debatesCount * 0.3;
      affinities.skeptic += user.stats.debatesCount * 0.2;
    }
    
    // Add small random variation to avoid ties
    Object.keys(affinities).forEach(key => {
      affinities[key] += Math.random() * 0.1;
    });
    
    return affinities;
  };
  
  // Find school object by ID
  const getSchoolById = (id) => {
    return philosophicalSchools.find(school => school.id === id) || null;
  };
  
  // Get primary and secondary schools as objects
  const primarySchool = getSchoolById(compassData.primarySchool);
  const secondarySchool = getSchoolById(compassData.secondarySchool);
  
  // Normalize affinities for visualization (convert to percentages)
  const normalizedAffinities = () => {
    const affinitiesData = compassData.affinities || {};
    const total = Object.values(affinitiesData).reduce((sum, val) => sum + val, 0);
    
    if (total === 0) return {};
    
    return Object.entries(affinitiesData).reduce((acc, [key, value]) => {
      acc[key] = Math.round((value / total) * 100);
      return acc;
    }, {});
  };
  
  const normalized = normalizedAffinities();
  
  return (
    <Card className="relative overflow-hidden">
      <h3 className="text-lg font-serif font-semibold text-aegeanBlue mb-4">
        Your Philosophical Compass
      </h3>
      
      {isUpdating ? (
        <div className="py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aegeanBlue mx-auto mb-4"></div>
          <p className="text-aegeanBlue/70">Analyzing your philosophical tendencies...</p>
        </div>
      ) : (
        <div>
          {!primarySchool ? (
            <div className="py-8 text-center">
              <p className="text-aegeanBlue/70 mb-4">
                Your philosophical compass is still forming.
              </p>
              <p className="text-aegeanBlue/70">
                Continue interacting with the platform to reveal your philosophical tendencies.
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                {/* Primary School */}
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
                    <div className="mt-3">
                      <span className="text-xs font-medium text-aegeanBlue/60">
                        Key Figures:
                      </span>
                      <p className="text-sm text-aegeanBlue/70">
                        {primarySchool.keyFigures.join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
                
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
                      <div className="mt-3">
                        <span className="text-xs font-medium text-aegeanBlue/60">
                          Key Figures:
                        </span>
                        <p className="text-sm text-aegeanBlue/70">
                          {secondarySchool.keyFigures.join(', ')}
                        </p>
                      </div>
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
              
              {/* Suggested Reading Based on Compass */}
              <div className="mt-8">
                <h4 className="text-md font-medium text-aegeanBlue mb-3">
                  Recommended Explorations
                </h4>
                
                <div className="rounded-lg border border-aegeanBlue/20 p-4">
                  <p className="text-sm text-aegeanBlue/70 mb-3">
                    Based on your philosophical tendencies, you might enjoy exploring:
                  </p>
                  
                  <ul className="list-disc pl-5 text-sm text-aegeanBlue/70 space-y-2">
                    {primarySchool && (
                      <li>
                        <span className="font-medium">{primarySchool.name}:</span> Read works by {primarySchool.keyFigures.slice(0, 2).join(' or ')}
                      </li>
                    )}
                    {secondarySchool && (
                      <li>
                        <span className="font-medium">{secondarySchool.name}:</span> Explore dialogues that compare {primarySchool.name} and {secondarySchool.name} perspectives
                      </li>
                    )}
                    <li>
                      <span className="font-medium">Expand your horizons:</span> Try a philosophical challenge from a different school of thought
                    </li>
                  </ul>
                </div>
              </div>
            </>
          )}
          
          {compassData.lastUpdated && (
            <p className="text-xs text-aegeanBlue/50 mt-4 text-right">
              Last updated: {new Date(compassData.lastUpdated).toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    </Card>
  );
};

export default PhilosophicalCompass;