import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../common/Card';
import Button from '../common/Button';
import ReactMarkdown from 'react-markdown';

// In a real app, this would come from an API or a state management system
import knowledgeBase from '../../data/knowledge-base.json';

const KnowledgeExplorer = () => {
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  useEffect(() => {
    // Load domains from the knowledge base
    setDomains(knowledgeBase.domains);
  }, []);
  
  const handleDomainSelect = (domain) => {
    setSelectedDomain(domain);
    setSelectedTopic(null);
    setCurrentArticle(null);
    setSearchResults([]);
    setIsSearching(false);
  };
  
  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    setCurrentArticle(null);
    
    // Find articles for this topic
    const topicArticles = knowledgeBase.articles.filter(
      article => article.topicId === topic.id && article.domainId === selectedDomain.id
    );
    
    // If there's only one article, show it directly
    if (topicArticles.length === 1) {
      setCurrentArticle(topicArticles[0]);
    } else {
      setSearchResults(topicArticles);
    }
  };
  
  const handleArticleSelect = (article) => {
    setCurrentArticle(article);
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setSelectedDomain(null);
    setSelectedTopic(null);
    setCurrentArticle(null);
    
    // Simple search implementation
    const query = searchQuery.toLowerCase();
    const results = knowledgeBase.articles.filter(article => {
      return (
        article.title.toLowerCase().includes(query) ||
        article.content.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query))
      );
    });
    
    setSearchResults(results);
  };
  
  const renderArticleContent = () => {
    return (
      <div className="prose prose-aegeanBlue max-w-none">
        <ReactMarkdown
          components={{
            h1: ({node, ...props}) => <h1 className="text-2xl font-serif font-bold mb-4" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-xl font-serif font-semibold mt-6 mb-3" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-lg font-serif font-semibold mt-5 mb-2" {...props} />,
            p: ({node, ...props}) => <p className="mb-3" {...props} />,
            li: ({node, ...props}) => <li className="mb-2 ml-4" {...props} />,
            strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
            em: ({node, ...props}) => <em className="italic" {...props} />,
            a: ({node, ...props}) => <a className="text-aegeanBlue hover:underline" {...props} />,
            blockquote: ({node, ...props}) => <blockquote className="pl-4 border-l-4 border-aegeanBlue/30 italic" {...props} />,
            code: ({node, inline, ...props}) => 
              inline 
                ? <code className="px-1 py-0.5 bg-aegeanBlue/10 rounded" {...props} />
                : <code className="block p-4 bg-aegeanBlue/10 rounded overflow-auto" {...props} />,
          }}
        >
          {currentArticle.content}
        </ReactMarkdown>
      </div>
    );
  };
  
  const renderArticlesList = (articles) => {
    return (
      <div className="space-y-4 my-4">
        {articles.map(article => (
          <Card 
            key={article.id} 
            variant="interactive"
            onClick={() => handleArticleSelect(article)}
          >
            <div className="p-4">
              <h3 className="font-serif font-bold text-aegeanBlue text-lg mb-1">
                {article.title}
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {article.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="px-2 py-1 text-xs font-medium bg-philosophicalPurple/10 text-philosophicalPurple rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };
  
  const renderSearchResults = () => {
    if (searchResults.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-aegeanBlue/60">No results found for "{searchQuery}"</p>
          <p className="text-sm mt-2">Try different keywords or browse by topic</p>
        </div>
      );
    }
    
    return (
      <div>
        <h3 className="text-xl font-serif text-aegeanBlue mb-4">
          Search Results for "{searchQuery}"
        </h3>
        {renderArticlesList(searchResults)}
      </div>
    );
  };
  
  const renderTopicArticles = () => {
    if (searchResults.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-aegeanBlue/60">No articles found for this topic</p>
          <p className="text-sm mt-2">Check back later as we continue to add content</p>
        </div>
      );
    }
    
    return (
      <div>
        <h3 className="text-xl font-serif text-aegeanBlue mb-4">
          Articles on {selectedTopic.name}
        </h3>
        {renderArticlesList(searchResults)}
      </div>
    );
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
              {domains.map((domain) => (
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
                    <p className="text-xs text-gray-600">{topic.description}</p>
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
                <div className="flex justify-between items-start">
                  <h1 className="text-3xl font-serif font-bold text-aegeanBlue mb-2">
                    {currentArticle.title}
                  </h1>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentArticle(null)}
                  >
                    Back
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentArticle.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="px-2 py-1 text-xs font-medium bg-philosophicalPurple/20 text-philosophicalPurple rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {renderArticleContent()}
            </div>
          ) : isSearching ? (
            renderSearchResults()
          ) : selectedTopic ? (
            renderTopicArticles()
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
                      {domains.map((domain) => (
                        <Card 
                          key={domain.id}
                          variant="interactive"
                          onClick={() => handleDomainSelect(domain)}
                        >
                          <div className="text-center py-3">
                            <div className="text-3xl mb-2">{domain.icon}</div>
                            <div className="font-medium">{domain.name}</div>
                            <div className="text-xs text-gray-600 mt-1">{domain.description}</div>
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