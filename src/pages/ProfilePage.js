import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useAuth } from '../services/AuthContext';
import AuthModal from '../components/auth/AuthModal';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { currentUser, updateUserProfile } = useAuth();
  const [user, setUser] = useState(null);
  
  // Set up default achievements for new users
  const defaultAchievements = [
    { id: 'ach1', name: 'Journey Begun', description: 'Created your account and started your philosophical journey', icon: '🏆', date: new Date().toISOString() },
  ];
  
  useEffect(() => {
    if (currentUser) {
      // If the user doesn't have any achievements yet, add the default one
      if (!currentUser.achievements || currentUser.achievements.length === 0) {
        const updatedUser = {
          ...currentUser,
          achievements: defaultAchievements
        };
        updateUserProfile(updatedUser);
      }
      
      setUser(currentUser);
    }
  }, [currentUser, updateUserProfile]);
  
  const handleUpdateUser = (field, value) => {
    const updatedUser = { ...user };
    
    if (field.includes('.')) {
      // Handle nested fields like 'preferences.notifications.dailyChallenge'
      const fields = field.split('.');
      let current = updatedUser;
      
      for (let i = 0; i < fields.length - 1; i++) {
        current = current[fields[i]];
      }
      
      current[fields[fields.length - 1]] = value;
    } else {
      updatedUser[field] = value;
    }
    
    setUser(updatedUser);
  };
  
  const handleSavePreferences = () => {
    updateUserProfile(user);
    alert('Preferences saved successfully!');
  };
  
  // Redirect to home if not logged in
  if (!currentUser && !authModalOpen) {
    // Show auth modal first
    setTimeout(() => setAuthModalOpen(true), 0);
    
    // If still not logged in, redirect
    if (!currentUser) {
      return (
        <Layout>
          <div className="max-w-6xl mx-auto px-4 py-16">
            <Card>
              <div className="text-center py-8">
                <h2 className="text-2xl font-serif font-bold text-aegeanBlue mb-4">
                  Sign In Required
                </h2>
                <p className="mb-6 text-aegeanBlue/70">
                  Please sign in or create an account to view your profile.
                </p>
                <div className="flex justify-center space-x-4">
                  <Button onClick={() => setAuthModalOpen(true)}>
                    Sign In
                  </Button>
                </div>
              </div>
            </Card>
            
            {/* Auth Modal */}
            <AuthModal
              isOpen={authModalOpen}
              onClose={() => setAuthModalOpen(false)}
              initialMode="signin"
            />
          </div>
        </Layout>
      );
    }
  }
  
  // Don't render until user data is loaded
  if (!user) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-aegeanBlue"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-aegeanBlue">
            Your Profile
          </h1>
          <div className="flex space-x-2">
            <Button 
              variant={activeTab === 'profile' ? 'primary' : 'outline'} 
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </Button>
            <Button 
              variant={activeTab === 'achievements' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('achievements')}
            >
              Achievements
            </Button>
            <Button 
              variant={activeTab === 'settings' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </Button>
          </div>
        </div>
        
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <Card>
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-aegeanBlue/20">
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="text-xl font-serif font-semibold text-aegeanBlue mb-1">
                    {user.name}
                  </h2>
                  <p className="text-aegeanBlue/60 mb-4">
                    Joined {new Date(user.joinDate).toLocaleDateString()}
                  </p>
                  <div className="bg-philosophicalPurple/10 px-4 py-2 rounded-full text-philosophicalPurple font-medium">
                    {user.stats.sophiaPoints} Sophia Points
                  </div>
                </div>
              </Card>
              
              <Card className="mt-6">
                <h3 className="text-lg font-serif font-semibold text-aegeanBlue mb-4">
                  Philosophical Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {user.preferences.interests.map((interest) => (
                    <span 
                      key={interest}
                      className="px-3 py-1 bg-aegeanBlue/10 text-aegeanBlue rounded-full"
                    >
                      {interest === 'ethics' ? 'Ethics & Morality' :
                       interest === 'metaphysics' ? 'Metaphysics & Reality' :
                       interest === 'politics' ? 'Politics & Governance' :
                       interest}
                    </span>
                  ))}
                </div>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              <Card>
                <h3 className="text-lg font-serif font-semibold text-aegeanBlue mb-4">
                  Your Philosophical Journey
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-aegeanBlue/10 rounded-lg">
                    <div className="text-2xl font-bold text-aegeanBlue mb-1">
                      {user.stats.entriesCount}
                    </div>
                    <div className="text-sm text-aegeanBlue/70">
                      Journal Entries
                    </div>
                  </div>
                  <div className="text-center p-4 bg-oliveGold/10 rounded-lg">
                    <div className="text-2xl font-bold text-oliveGold mb-1">
                      {user.stats.challengesCompleted}
                    </div>
                    <div className="text-sm text-aegeanBlue/70">
                      Challenges
                    </div>
                  </div>
                  <div className="text-center p-4 bg-philosophicalPurple/10 rounded-lg">
                    <div className="text-2xl font-bold text-philosophicalPurple mb-1">
                      {user.stats.reflectionsCount}
                    </div>
                    <div className="text-sm text-aegeanBlue/70">
                      Reflections
                    </div>
                  </div>
                  <div className="text-center p-4 bg-oracleGreen/10 rounded-lg">
                    <div className="text-2xl font-bold text-oracleGreen mb-1">
                      {user.stats.debatesCount || 0}
                    </div>
                    <div className="text-sm text-aegeanBlue/70">
                      Debates
                    </div>
                  </div>
                </div>
                
                <h4 className="text-md font-medium text-aegeanBlue mb-2">
                  Recent Achievements
                </h4>
                <div className="space-y-3">
                  {user.achievements && user.achievements.slice(0, 3).map((achievement) => (
                    <div 
                      key={achievement.id}
                      className="flex items-center p-3 border border-aegeanBlue/10 rounded-lg"
                    >
                      <div className="text-2xl mr-3">{achievement.icon}</div>
                      <div>
                        <div className="font-medium text-aegeanBlue">
                          {achievement.name}
                        </div>
                        <div className="text-sm text-aegeanBlue/60">
                          {achievement.description}
                        </div>
                      </div>
                      <div className="ml-auto text-sm text-aegeanBlue/60">
                        {new Date(achievement.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 text-center">
                  <Button 
                    variant="outline"
                    onClick={() => setActiveTab('achievements')}
                  >
                    View All Achievements
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}
        
        {activeTab === 'achievements' && (
          <Card>
            <h3 className="text-lg font-serif font-semibold text-aegeanBlue mb-6">
              Your Achievements
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {user.achievements && user.achievements.map((achievement) => (
                <div 
                  key={achievement.id}
                  className="p-4 border border-aegeanBlue/10 rounded-lg text-center"
                >
                  <div className="text-4xl mb-3">{achievement.icon}</div>
                  <div className="font-medium text-aegeanBlue mb-1">
                    {achievement.name}
                  </div>
                  <div className="text-sm text-aegeanBlue/60 mb-3">
                    {achievement.description}
                  </div>
                  <div className="text-xs text-aegeanBlue/60">
                    Earned on {new Date(achievement.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
              
              {/* Placeholder for locked achievements */}
              {[1, 2, 3].map((i) => (
                <div 
                  key={`locked-${i}`}
                  className="p-4 border border-aegeanBlue/10 rounded-lg text-center bg-aegeanBlue/5"
                >
                  <div className="text-4xl mb-3 text-aegeanBlue/30">🔒</div>
                  <div className="font-medium text-aegeanBlue/60 mb-1">
                    Locked Achievement
                  </div>
                  <div className="text-sm text-aegeanBlue/40 mb-3">
                    Continue your philosophical journey to unlock
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
        
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <h3 className="text-lg font-serif font-semibold text-aegeanBlue mb-6">
                Account Settings
              </h3>
              
              <form>
                <Input 
                  label="Display Name"
                  id="name"
                  value={user.name}
                  onChange={(e) => handleUpdateUser('name', e.target.value)}
                  fullWidth
                />
                
                <Input 
                  label="Email Address"
                  id="email"
                  type="email"
                  value={user.email}
                  onChange={(e) => handleUpdateUser('email', e.target.value)}
                  fullWidth
                />
                
                <div className="mt-4">
                  <Button 
                    type="button"
                    onClick={handleSavePreferences}
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </Card>
            
            <Card>
              <h3 className="text-lg font-serif font-semibold text-aegeanBlue mb-6">
                Notification Preferences
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-aegeanBlue">Daily Challenge</div>
                    <div className="text-sm text-aegeanBlue/60">Receive notifications for new daily challenges</div>
                  </div>
                  <div className="relative">
                    <input 
                      type="checkbox"
                      className="sr-only"
                      id="daily-challenge"
                      checked={user.preferences.notifications.dailyChallenge}
                      onChange={() => handleUpdateUser(
                        'preferences.notifications.dailyChallenge', 
                        !user.preferences.notifications.dailyChallenge
                      )}
                    />
                    <label 
                      htmlFor="daily-challenge" 
                      className={`block w-14 h-8 rounded-full transition-colors duration-300 ease-in-out ${
                        user.preferences.notifications.dailyChallenge ? 'bg-oracleGreen' : 'bg-gray-300'
                      }`}
                    >
                      <span 
                        className={`block w-6 h-6 mt-1 ml-1 bg-white rounded-full transition-transform duration-300 ease-in-out ${
                          user.preferences.notifications.dailyChallenge ? 'transform translate-x-6' : ''
                        }`} 
                      />
                    </label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-aegeanBlue">Journal Reminder</div>
                    <div className="text-sm text-aegeanBlue/60">Get reminded to journal daily</div>
                  </div>
                  <div className="relative">
                    <input 
                      type="checkbox"
                      className="sr-only"
                      id="journal-reminder"
                      checked={user.preferences.notifications.journalReminder}
                      onChange={() => handleUpdateUser(
                        'preferences.notifications.journalReminder', 
                        !user.preferences.notifications.journalReminder
                      )}
                    />
                    <label 
                      htmlFor="journal-reminder" 
                      className={`block w-14 h-8 rounded-full transition-colors duration-300 ease-in-out ${
                        user.preferences.notifications.journalReminder ? 'bg-oracleGreen' : 'bg-gray-300'
                      }`}
                    >
                      <span 
                        className={`block w-6 h-6 mt-1 ml-1 bg-white rounded-full transition-transform duration-300 ease-in-out ${
                          user.preferences.notifications.journalReminder ? 'transform translate-x-6' : ''
                        }`} 
                      />
                    </label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-aegeanBlue">Community Updates</div>
                    <div className="text-sm text-aegeanBlue/60">Updates from symposiums and debates</div>
                  </div>
                  <div className="relative">
                    <input 
                      type="checkbox"
                      className="sr-only"
                      id="community-updates"
                      checked={user.preferences.notifications.communityUpdates}
                      onChange={() => handleUpdateUser(
                        'preferences.notifications.communityUpdates', 
                        !user.preferences.notifications.communityUpdates
                      )}
                    />
                    <label 
                      htmlFor="community-updates" 
                      className={`block w-14 h-8 rounded-full transition-colors duration-300 ease-in-out ${
                        user.preferences.notifications.communityUpdates ? 'bg-oracleGreen' : 'bg-gray-300'
                      }`}
                    >
                      <span 
                        className={`block w-6 h-6 mt-1 ml-1 bg-white rounded-full transition-transform duration-300 ease-in-out ${
                          user.preferences.notifications.communityUpdates ? 'transform translate-x-6' : ''
                        }`} 
                      />
                    </label>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button 
                    type="button"
                    onClick={handleSavePreferences}
                  >
                    Save Preferences
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode="signin"
      />
    </Layout>
  );
};

export default ProfilePage;