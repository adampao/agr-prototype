import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import PhilosopherChat from '../components/study/PhilosopherChat';
import KnowledgeExplorer from '../components/study/KnowledgeExplorer';
import TimelineViewer from '../components/study/TimelineViewer';
import Button from '../components/common/Button';

const StudyPage = () => {
  const [activeTab, setActiveTab] = useState('philosophers');
  
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-aegeanBlue">
            The Study
          </h1>
          <div className="flex space-x-2">
            <Button 
              variant={activeTab === 'philosophers' ? 'primary' : 'outline'} 
              onClick={() => setActiveTab('philosophers')}
            >
              Philosopher Chat
            </Button>
            <Button 
              variant={activeTab === 'knowledge' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('knowledge')}
            >
              Knowledge Explorer
            </Button>
            <Button 
              variant={activeTab === 'timeline' ? 'primary' : 'outline'} 
              onClick={() => setActiveTab('timeline')}
            >
              Timeline
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md border border-aegeanBlue/10 min-h-[600px]">
          {activeTab === 'philosophers' ? (
            <PhilosopherChat />
          ) : activeTab === 'knowledge' ? (
            <KnowledgeExplorer />
          ) : (
            <TimelineViewer />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default StudyPage;