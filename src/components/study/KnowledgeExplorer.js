import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../common/Card';
import Button from '../common/Button';

const knowledgeDomains = [
  { 
    id: 'philosophy', 
    name: 'Philosophy', 
    icon: '🧠',
    topics: [
      { id: 'ethics', name: 'Ethics & Morality' },
      { id: 'metaphysics', name: 'Metaphysics & Reality' },
      { id: 'epistemology', name: 'Epistemology & Knowledge' },
      { id: 'logic', name: 'Logic & Reasoning' },
      { id: 'aesthetics', name: 'Aesthetics & Beauty' },
    ] 
  },
  { 
    id: 'history', 
    name: 'History', 
    icon: '📜',
    topics: [
      { id: 'archaic', name: 'Archaic Period' },
      { id: 'classical', name: 'Classical Period' },
      { id: 'hellenistic', name: 'Hellenistic Period' },
      { id: 'figures', name: 'Historical Figures' },
      { id: 'events', name: 'Major Events' },
    ] 
  },
  { 
    id: 'mythology', 
    name: 'Mythology', 
    icon: '⚡',
    topics: [
      { id: 'gods', name: 'Olympian Gods' },
      { id: 'heroes', name: 'Heroes & Legends' },
      { id: 'creatures', name: 'Mythical Creatures' },
      { id: 'stories', name: 'Myths & Stories' },
      { id: 'symbols', name: 'Symbols & Meanings' },
    ] 
  },
];

// For the prototype, we'll include one sample article
const sampleArticle = {
  id: 'virtue-ethics',
  title: 'Virtue Ethics in Ancient Greece',
  domain: 'philosophy',
  topic: 'ethics',
  content: `
# Virtue Ethics in Ancient Greece

Virtue ethics is one of the oldest moral traditions in Western philosophy, with its roots deeply embedded in ancient Greek thought, particularly in the works of Aristotle, though it draws on the ideas of earlier thinkers like Socrates and Plato.

## The Concept of Virtue (Aretē)

The ancient Greek concept of 'aretē' (often translated as 'virtue' or 'excellence') refers to the qualities that enable something to perform its function well. For humans, aretē means the qualities that enable a person to live a good, flourishing life (eudaimonia).

## Aristotle's Approach

Aristotle developed the most comprehensive virtue ethics framework in his work "Nicomachean Ethics." His approach centers on:

1. **The Golden Mean**: Virtues are a mean between two extremes (vices) - excess and deficiency. For example, courage is the mean between rashness (excess) and cowardice (deficiency).

2. **Character Development**: Virtues are not innate but developed through practice and habit. We become virtuous by performing virtuous acts.

3. **Practical Wisdom (Phronesis)**: The intellectual virtue that allows us to determine the right action in any situation.

## Key Virtues in Ancient Greek Ethics

- **Courage (Andreia)**: Facing fear appropriately
- **Temperance (Sophrosyne)**: Moderation in desires and pleasures
- **Justice (Dikaiosyne)**: Fair treatment and proportional equality
- **Wisdom (Sophia)**: Understanding of universal truths
- **Magnanimity (Megalopsychia)**: Appropriate pride and self-worth

## Modern Relevance

Virtue ethics offers an alternative to rule-based ethical systems by focusing on character development rather than specific actions or outcomes. Many modern philosophers and psychologists have renewed interest in virtue ethics as a foundation for personal development and ethical living.
  `,
  relatedTopics: ['virtue', 'aristotle', 'ethics', 'eudaimonia', 'character']
};

const KnowledgeExplorer = () => {
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleDomainSelect = (domain) => {
    setSelectedDomain(domain);
    setSelectedTopic(null);
    setCurrentArticle(null);
  };
  
  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    // In a real app, we would fetch the appropriate content
    // For the prototype, we'll just show our sample article
    setCurrentArticle(sampleArticle);
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // In a real app, we would search the knowledge base
      // For the prototype, we'll just show our sample article if the query matches
      if (searchQuery.toLowerCase().includes('virtue') || 
          searchQuery.toLowerCase().includes('ethics') ||
          searchQuery.toLowerCase().includes('aristotle')) {
        setCurrentArticle(sampleArticle);
        setSelectedDomain(knowledgeDomains[0]);
        setSelectedTopic(knowledgeDomains[0].topics[0]);
      }
    }
  };
  
  const renderMarkdown = (text) => {
    // A very simple markdown renderer for the prototype
    const lines = text.split('\n');
    
    return lines.map((line, index) => {
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-2xl font-serif font-bold mb-4">{line.substring(2)}</h1>;
      } else if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-serif font-semibold mt-6 mb-3">{line.substring(3)}</h2>;
      } else if (line.startsWith('- **')) {
        const parts = line.split('**');
        return (
          <li key={index} className="mb-2">
            <strong>{parts[1]}</strong>{parts[2]}
          </li>
        );
      } else if (line.startsWith('1. **')) {
        const parts = line.split('**');
        return (
          <div key={index} className="flex mb-2">
            <span className="mr-2">{line.charAt(0)}.</span>
            <div>
              <strong>{parts[1]}</strong>{parts[2]}
            </div>
          </div>
        );
      } else if (line.trim() === '') {
        return <div key={index} className="my-2"></div>;
      } else {
        return <p key={index} className="mb-3">{line}</p>;
      }
    });
  };
  
  return (
    <div className="h-full flex flex-col">
      {/* Search Bar */}
      <div className="p-4 border-b bg-marbleWhite">
        <form onSubmit={handleSearch} className="flex space-x-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search the knowledge base..."
            className="flex-grow py-2 px-4 border border-aegeanBlue/20 rounded-md focus:outline-none focus:ring-2 focus:ring-aegeanBlue/50 bg-white"
          />
          <Button type="submit" disabled={!searchQuery.trim()}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </Button>
        </form>
      </div>
      
      <div className="flex-grow grid grid-cols-1 md:grid-cols-4 h-full">
        {/* Knowledge Domains Sidebar */}
        <div className="md:col-span-1 border-r overflow-y-auto bg-marbleWhite/70">
          <div className="p-4">
            <h3 className="text-lg font-serif font-semibold text-aegeanBlue mb-3">
              Knowledge Domains
            </h3>
            <div className="space-y-2">
              {knowledgeDomains.map((domain) => (
                <motion.div
                  key={domain.id}
                  whileHover={{ x: 3 }}
                  className={`flex items-center p-2 rounded-md cursor-pointer ${
                    selectedDomain?.id === domain.id 
                      ? 'bg-aegeanBlue text-marbleWhite' 
                      : 'hover:bg-aegeanBlue/10'
                  }`}
                  onClick={() => handleDomainSelect(domain)}
                >
                  <span className="text-xl mr-3">{domain.icon}</span>
                  <span>{domain.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Topics */}
          {selectedDomain && (
            <div className="p-4 border-t">
              <h3 className="text-lg font-serif font-semibold text-aegeanBlue mb-3">
                Topics in {selectedDomain.name}
              </h3>
              <div className="space-y-1">
                {selectedDomain.topics.map((topic) => (
                  <motion.div
                    key={topic.id}
                    whileHover={{ x: 3 }}
                    className={`p-2 rounded-md cursor-pointer ${
                      selectedTopic?.id === topic.id 
                        ? 'bg-philosophicalPurple/20 text-philosophicalPurple font-medium' 
                        : 'hover:bg-aegeanBlue/10'
                    }`}
                    onClick={() => handleTopicSelect(topic)}
                  >
                    {topic.name}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Content Area */}
        <div className="md:col-span-3 overflow-y-auto p-6">
          {currentArticle ? (
            <div>
              <div className="mb-6">
                <h1 className="text-3xl font-serif font-bold text-aegeanBlue mb-2">
                  {currentArticle.title}
                </h1>
                <div className="flex flex-wrap gap-2">
                  {currentArticle.relatedTopics.map((topic) => (
                    <span 
                      key={topic} 
                      className="px-2 py-1 text-xs font-medium bg-philosophicalPurple/20 text-philosophicalPurple rounded-full"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="prose prose-aegeanBlue max-w-none">
                {renderMarkdown(currentArticle.content)}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-aegeanBlue/60 max-w-md">
                {selectedDomain ? (
                  <>
                    <h3 className="text-xl font-serif mb-2">
                      Select a topic in {selectedDomain.name}
                    </h3>
                    <p>
                      Choose a topic from the sidebar to explore the knowledge base.
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-serif mb-2">
                      Welcome to the Knowledge Explorer
                    </h3>
                    <p className="mb-4">
                      Browse domains and topics, or search the knowledge base to explore ancient Greek wisdom.
                    </p>
                    <div className="grid grid-cols-3 gap-4 mt-8">
                      {knowledgeDomains.map((domain) => (
                        <Card 
                          key={domain.id}
                          variant="interactive"
                          onClick={() => handleDomainSelect(domain)}
                        >
                          <div className="text-center py-3">
                            <div className="text-3xl mb-2">{domain.icon}</div>
                            <div>{domain.name}</div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeExplorer;