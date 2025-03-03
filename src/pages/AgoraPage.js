import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import Community from '../components/agora/Community';
import DebateArena from '../components/agora/DebateArena';
import Button from '../components/common/Button';

const AgoraPage = () => {
  const [activeTab, setActiveTab] = useState('community');
  
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-aegeanBlue">
            The Agora
          </h1>
          <div className="flex space-x-2">
            <Button 
              variant={activeTab === 'debates' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('debates')}
            >
              Debates
            </Button>
            <Button 
              variant={activeTab === 'community' ? 'primary' : 'outline'} 
              onClick={() => setActiveTab('community')}
            >
              Symposiums
            </Button>
          </div>
        </div>
        
        {activeTab === 'community' ? (
          <Community />
        ) : (
          <DebateArena />
        )}
      </div>
    </Layout>
  );
};

export default AgoraPage;
