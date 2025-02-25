import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../common/Card';
import Button from '../common/Button';

// Sample debate topics for the prototype
const sampleDebates = [
  {
    id: 'debate1',
    title: 'Is Virtue Knowledge?',
    description: 'Socrates argued that virtue is knowledge. If we truly know what is good, we will act accordingly. Is this a sound position?',
    participants: ['Socratic School', 'School of Cyrenaics'],
    status: 'active',
    votes: { for: 24, against: 18 }
  },
  {
    id: 'debate2',
    title: 'The Nature of Justice',
    description: 'Is justice merely what serves the strongest, as Thrasymachus argues, or is it an objective virtue, as Socrates contends?',
    participants: ['Platonic Academy', 'Sophist School'],
    status: 'scheduled',
    startTime: '2025-03-01T18:00:00.000Z'
  },
  {
    id: 'debate3',
    title: 'Fate vs. Free Will',
    description: 'The Stoics believed in fate but also in human responsibility. Is this reconcilable, or a contradiction?',
    participants: ['Stoic School', 'Epicurean Garden'],
    status: 'completed',
    winner: 'Stoic School',
    votes: { for: 42, against: 35 }
  },
];

const DebateArena = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  
  const filteredDebates = sampleDebates.filter(debate => {
    if (activeTab === 'upcoming') return debate.status === 'scheduled';
    if (activeTab === 'active') return debate.status === 'active';
    if (activeTab === 'past') return debate.status === 'completed';
    return true;
  });
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-serif font-bold text-aegeanBlue">
          Philosophical Debates
        </h2>
        <Button onClick={() => alert('Challenge feature will be available in the full version')}>
          Challenge to Debate
        </Button>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-aegeanBlue/10 mb-6">
        <div className="flex space-x-8">
          <button
            className={`pb-4 font-medium text-lg border-b-2 ${
              activeTab === 'upcoming'
                ? 'border-oliveGold text-aegeanBlue'
                : 'border-transparent text-aegeanBlue/60 hover:text-aegeanBlue hover:border-aegeanBlue/30'
            }`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming
          </button>
          <button
            className={`pb-4 font-medium text-lg border-b-2 ${
              activeTab === 'active'
                ? 'border-oliveGold text-aegeanBlue'
                : 'border-transparent text-aegeanBlue/60 hover:text-aegeanBlue hover:border-aegeanBlue/30'
            }`}
            onClick={() => setActiveTab('active')}
          >
            Live Now
          </button>
          <button
            className={`pb-4 font-medium text-lg border-b-2 ${
              activeTab === 'past'
                ? 'border-oliveGold text-aegeanBlue'
                : 'border-transparent text-aegeanBlue/60 hover:text-aegeanBlue hover:border-aegeanBlue/30'
            }`}
            onClick={() => setActiveTab('past')}
          >
            Past Debates
          </button>
        </div>
      </div>
      
      {filteredDebates.length > 0 ? (
        <div className="space-y-6">
          {filteredDebates.map((debate, index) => (
            <motion.div
              key={debate.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="relative overflow-hidden">
                {debate.status === 'active' && (
                  <div className="absolute top-0 right-0 bg-terracotta text-white text-xs px-3 py-1 font-medium">
                    LIVE NOW
                  </div>
                )}
                
                <div className="mb-4">
                  <h3 className="text-xl font-serif font-semibold text-aegeanBlue mb-1">
                    {debate.title}
                  </h3>
                  <p className="text-aegeanBlue/80">
                    {debate.description}
                  </p>
                </div>
                
                <div className="border-t border-b border-aegeanBlue/10 py-4 my-4">
                  <div className="flex justify-around">
                    <div className="text-center">
                      <div className="text-sm text-aegeanBlue/60 mb-1">Position For</div>
                      <div className="font-medium text-lg">{debate.participants[0]}</div>
                      {debate.votes && (
                        <div className="text-sm mt-1 bg-aegeanBlue/10 px-2 py-1 rounded-full">
                          {debate.votes.for} votes
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center">
                      <div className="text-3xl text-aegeanBlue/40">vs</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-aegeanBlue/60 mb-1">Position Against</div>
                      <div className="font-medium text-lg">{debate.participants[1]}</div>
                      {debate.votes && (
                        <div className="text-sm mt-1 bg-aegeanBlue/10 px-2 py-1 rounded-full">
                          {debate.votes.against} votes
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  {debate.status === 'scheduled' && (
                    <div className="text-sm text-aegeanBlue/60">
                      Starts {new Date(debate.startTime).toLocaleString()}
                    </div>
                  )}
                  {debate.status === 'active' && (
                    <div className="text-sm text-terracotta font-medium">
                      Debate in progress
                    </div>
                  )}
                  {debate.status === 'completed' && (
                    <div className="text-sm">
                      Winner: <span className="font-medium text-aegeanBlue">{debate.winner}</span>
                    </div>
                  )}
                  
                  <Button
                    variant={debate.status === 'active' ? 'primary' : 'outline'}
                    onClick={() => alert(`In the full version, this would ${debate.status === 'active' ? 'join' : 'view'} the debate.`)}
                  >
                    {debate.status === 'scheduled' ? 'Get Reminder' : 
                     debate.status === 'active' ? 'Join Debate' : 
                     'View Recording'}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎭</div>
          <h3 className="text-xl font-serif font-semibold text-aegeanBlue mb-2">
            No {activeTab === 'upcoming' ? 'upcoming' : activeTab === 'active' ? 'live' : 'past'} debates
          </h3>
          <p className="text-aegeanBlue/80 mb-6 max-w-md mx-auto">
            {activeTab === 'upcoming' 
              ? 'New debates are scheduled regularly. Check back soon!'
              : activeTab === 'active'
                ? 'There are no live debates at the moment. Why not schedule one?'
                : 'Past debates will appear here for you to review and learn from.'}
          </p>
          <Button 
            onClick={() => activeTab === 'active' ? setActiveTab('upcoming') : setActiveTab('active')}
          >
            {activeTab === 'active' ? 'View Upcoming Debates' : 'Check Live Debates'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default DebateArena;