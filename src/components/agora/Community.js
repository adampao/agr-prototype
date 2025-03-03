import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../common/Card';
import Button from '../common/Button';

// Sample symposiums (discussion groups) for the prototype
const sampleSymposiums = [
  {
    id: 'symposium1',
    title: 'The Nature of Virtuous Leadership',
    description: 'Exploring how ancient Greek concepts of virtue can inform modern leadership practices.',
    members: 42,
    topics: ['Ethics', 'Leadership', 'Politics'],
    recent: true
  },
  {
    id: 'symposium2',
    title: 'The Socratic Method in Daily Life',
    description: 'Applying Socratic questioning to overcome personal challenges and improve critical thinking.',
    members: 28,
    topics: ['Socrates', 'Critical Thinking', 'Self-Improvement'],
    recent: false
  },
  {
    id: 'symposium3',
    title: 'Stoicism for Modern Anxiety',
    description: 'How Stoic philosophy can help us navigate stress and uncertainty in contemporary life.',
    members: 56,
    topics: ['Stoicism', 'Mental Health', 'Practical Philosophy'],
    recent: true
  },
  {
    id: 'symposium4',
    title: 'The Ethics of AI through Aristotelian Lens',
    description: 'Examining modern AI ethics questions using Aristotles virtue ethics framework.',
    members: 19,
    topics: ['Ethics', 'Technology', 'Aristotle'],
    recent: false
  },
];

const Community = () => {
  const [activeTab, setActiveTab] = useState('explore');
  const [filter, setFilter] = useState('all');
  
  const filteredSymposiums = sampleSymposiums.filter(symposium => {
    if (filter === 'recent') return symposium.recent;
    return true;
  });
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-serif font-bold text-aegeanBlue">
          The Agora
        </h2>
        <Button onClick={() => alert('Create Symposium feature will be available in the full version')}>
          Create Symposium
        </Button>
      </div>
      
      {/* Tabs */}
     {/* Tabs */}
<div className="border-b border-aegeanBlue/10 mb-6">
  <div className="flex space-x-8">
    <button
      className={`pb-4 font-medium text-lg border-b-2 ${
        activeTab === 'explore'
          ? 'border-oliveGold text-aegeanBlue'
          : 'border-transparent text-aegeanBlue/60 hover:text-aegeanBlue hover:border-aegeanBlue/30'
      }`}
      onClick={() => setActiveTab('explore')}
    >
      Explore Symposiums
    </button>
    <button
      className={`pb-4 font-medium text-lg border-b-2 ${
        activeTab === 'my'
          ? 'border-oliveGold text-aegeanBlue'
          : 'border-transparent text-aegeanBlue/60 hover:text-aegeanBlue hover:border-aegeanBlue/30'
      }`}
      onClick={() => setActiveTab('my')}
    >
      My Symposiums
    </button>
  </div>
</div>
      
      {activeTab === 'explore' ? (
        <>
          {/* Filter */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-4">
              <button
                className={`px-3 py-1 rounded-full text-sm ${
                  filter === 'all'
                    ? 'bg-aegeanBlue text-white'
                    : 'bg-aegeanBlue/10 text-aegeanBlue hover:bg-aegeanBlue/20'
                }`}
                onClick={() => setFilter('all')}
              >
                All Symposiums
              </button>
              <button
                className={`px-3 py-1 rounded-full text-sm ${
                  filter === 'recent'
                    ? 'bg-aegeanBlue text-white'
                    : 'bg-aegeanBlue/10 text-aegeanBlue hover:bg-aegeanBlue/20'
                }`}
                onClick={() => setFilter('recent')}
              >
                Recent Activity
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search symposiums..."
                className="py-2 px-4 pl-10 border border-aegeanBlue/20 rounded-md focus:outline-none focus:ring-2 focus:ring-aegeanBlue/50 bg-marbleWhite"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-2.5 text-aegeanBlue/50" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          {/* Symposium List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSymposiums.map((symposium, index) => (
              <motion.div
                key={symposium.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card variant="interactive" className="h-full" onClick={() => alert(`In the full version, this would open the ${symposium.title} symposium.`)}>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-serif font-semibold text-aegeanBlue">
                      {symposium.title}
                    </h3>
                    {symposium.recent && (
                      <span className="bg-terracotta/20 text-terracotta text-xs px-2 py-1 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-aegeanBlue/80 mb-4">
                    {symposium.description}
                  </p>
                  <div className="flex justify-between items-center mt-auto">
                    <div className="flex flex-wrap gap-2">
                      {symposium.topics.map(topic => (
                        <span
                          key={topic}
                          className="px-2 py-1 text-xs bg-philosophicalPurple/20 text-philosophicalPurple rounded-full"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-aegeanBlue/60">
                      {symposium.members} members
                    </span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏛️</div>
          <h3 className="text-xl font-serif font-semibold text-aegeanBlue mb-2">
            Join Your First Symposium
          </h3>
          <p className="text-aegeanBlue/80 mb-6 max-w-md mx-auto">
            Symposiums are discussion groups where you can engage with others on philosophical topics.
          </p>
          <Button onClick={() => setActiveTab('explore')}>
            Explore Symposiums
          </Button>
        </div>
      )}
    </div>
  );
};

export default Community;