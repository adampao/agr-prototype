import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import QuickCapture from '../components/journal/QuickCapture';
import JournalEntry from '../components/journal/JournalEntry';
import DailyChallenge from '../components/journal/DailyChallenge';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

// Sample data for the prototype
const sampleEntries = [
  {
    id: 'entry1',
    title: 'Reflection on Patience',
    timestamp: '2025-02-25T09:30:00.000Z',
    content: 'Today I practiced the Stoic virtue of patience during a difficult meeting. When my colleague criticized my work, I paused before responding and considered his perspective without taking it personally.',
    type: 'philosophical',
    philosopher: 'Epictetus',
    aiInsight: 'Remember that it is not the things themselves that disturb people, but their judgments about these things. Focus on what you can control - your reactions.',
    tags: ['Stoicism', 'Patience', 'Work']
  },
  {
    id: 'entry2',
    title: 'Question on Purpose',
    timestamp: '2025-02-24T16:45:00.000Z',
    content: 'I have been thinking about Aristotles concept of telos (purpose) lately. How do I discover my purpose in life? Is it something innate that I need to uncover, or something I create through my choices and actions?',
    type: 'philosophical',
    philosopher: 'Aristotle',
    aiInsight: 'Purpose is found at the intersection of your talents, passions, and what the world needs. Eudaimonia (flourishing) comes from fulfilling your function excellently.',
    tags: ['Purpose', 'Aristotle', 'Life Questions'],
    reflection: 'After reflecting on this, I realize that my purpose isnt something I will discover in a single moment of clarity, but something that emerges through continual action and reflection.'
  },
  {
    id: 'entry3',
    title: 'Oracles Wisdom',
    timestamp: '2025-02-23T10:15:00.000Z',
    content: 'The Oracle challenged me to examine my assumptions about success today. I realize I have been measuring success by external validation rather than internal fulfillment.',
    type: 'oracle',
    aiInsight: 'Look within for the measure of your worth, not to the opinions of others. True success is harmony between your actions and your values.',
    tags: ['Success', 'Self-worth', 'Validation']
  },
];

const sampleChallenge = {
  id: 'challenge1',
  title: 'The Socratic Examination',
  description: 'Identify one belief you hold strongly. Now, question it thoroughly. What evidence supports it? What might challenge it? Can you see it from another perspective?',
  difficulty: 'Moderate',
  category: 'Critical Thinking',
  philosophy: 'Socrates believed that the unexamined life is not worth living. By questioning our beliefs, we can separate truth from mere opinion and achieve greater wisdom.'
};

const JournalPage = () => {
  const [entries, setEntries] = useState([]);
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [view, setView] = useState('all'); // 'all', 'entries', 'challenges'
  
  useEffect(() => {
    // In a real app, we would fetch this data from the backend
    // For the prototype, we'll use our sample data
    setEntries(sampleEntries);
    setDailyChallenge(sampleChallenge);
  }, []);
  
  const handleSaveCapture = (newCapture) => {
    const newEntry = {
      id: `entry${entries.length + 1}`,
      title: newCapture.type === 'victory' ? 'Victory Moment' :
             newCapture.type === 'question' ? 'Philosophical Question' :
             newCapture.type === 'insight' ? 'Philosophical Insight' :
             'Challenge Reflection',
      timestamp: newCapture.timestamp,
      content: newCapture.content,
      type: 'philosophical',
      tags: [newCapture.type === 'victory' ? 'Victory' :
             newCapture.type === 'question' ? 'Question' :
             newCapture.type === 'insight' ? 'Insight' :
             'Challenge']
    };
    
    setEntries([newEntry, ...entries]);
  };
  
  const handleSaveReflection = (entryId, reflection) => {
    setEntries(entries.map(entry => 
      entry.id === entryId ? { ...entry, reflection } : entry
    ));
  };
  
  const handleCompleteChallenge = (challengeId, response) => {
    setDailyChallenge({
      ...dailyChallenge,
      completed: true,
      response
    });
    
    // In a real app, we would save this to the backend and 
    // potentially generate a new challenge or insight
  };
  
  const filteredEntries = view === 'all' ? entries :
                          view === 'entries' ? entries :
                          [];
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-aegeanBlue">
            Your Philosophical Journal
          </h1>
          <div className="flex space-x-2">
            <Button 
              variant={view === 'all' ? 'primary' : 'outline'} 
              onClick={() => setView('all')}
            >
              All
            </Button>
            <Button 
              variant={view === 'entries' ? 'primary' : 'outline'}
              onClick={() => setView('entries')}
            >
              Entries
            </Button>
            <Button 
              variant={view === 'challenges' ? 'primary' : 'outline'}
              onClick={() => setView('challenges')}
            >
              Challenges
            </Button>
          </div>
        </div>
        
        <QuickCapture onSaveCapture={handleSaveCapture} />
        
        {view !== 'entries' && dailyChallenge && (
          <div className="mb-8">
            <h2 className="text-xl font-serif font-semibold text-aegeanBlue mb-4">
              Daily Challenge
            </h2>
            <DailyChallenge 
              challenge={dailyChallenge} 
              onCompleteChallenge={handleCompleteChallenge} 
            />
          </div>
        )}
        
        {view !== 'challenges' && (
          <div>
            <h2 className="text-xl font-serif font-semibold text-aegeanBlue mb-4">
              Journal Entries
            </h2>
            
            {filteredEntries.length > 0 ? (
              filteredEntries.map(entry => (
                <JournalEntry
                  key={entry.id}
                  entry={entry}
                  onSaveReflection={handleSaveReflection}
                />
              ))
            ) : (
              <Card>
                <div className="text-center py-8">
                  <p className="text-aegeanBlue/70 mb-4">
                    Your journal is empty. Start by capturing a thought or completing a challenge.
                  </p>
                  <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    Capture a Thought
                  </Button>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default JournalPage;
