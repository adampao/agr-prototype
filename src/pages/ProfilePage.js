import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  
  // Sample user data for the prototype
  const [user, setUser] = useState({
    name: 'Philosophical Seeker',
    email: 'seeker@example.com',
    avatar: 'https://via.placeholder.com/150',
    joinDate: '2025-01-15T00:00:00.000Z',
    preferences: {
      learningStyle: 'interactive',
      interests: ['ethics', 'metaphysics', 'politics'],
      notifications: {
        dailyChallenge: true,
        journalReminder: true,
        communityUpdates: false
      }
    },
    stats: {
      entriesCount: 12,
      challengesCompleted: 8,
      reflectionsCount: 7,
      sophiaPoints: 256
    },
    achievements: [
      { id: 'ach1', name: 'Socratic Beginner', description: 'Completed 5 daily challenges', icon: '🏆', date: '2025-01-20T00:00:00.000Z' },
      { id: 'ach2', name: 'Reflective Mind', description: 'Added 5 reflections to your journal entries', icon: '🔍', date: '2025-02-05T00:00:00.000Z' },
      { id: 'ach3', name: 'Wisdom Seeker', description: 'Accumulated 250 Sophia Points', icon: '🦉', date: '2025-02-22T00:00:00.000Z' },
    ]
  });
  
  const handleSavePreferences = () => {
    // In a real app, we would save this to the backend
    alert('Preferences saved successfully!');
  };
  
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
                      0
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
                  {user.achievements.slice(0, 3).map((achievement) => (
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
              {user.achievements.map((achievement) => (
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
                  onChange={(e) => setUser({...user, name: e.target.value})}
                  fullWidth
                />
                
                <Input 
                  label="Email Address"
                  id="email"
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({...user, email: e.target.value})}
                  fullWidth
                />
                
                <div className="mt-4">
                  <Button type="button">
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
                      onChange={() => setUser({
                        ...user, 
                        preferences: {
                          ...user.preferences,
                          notifications: {
                            ...user.preferences.notifications,
                            dailyChallenge: !user.preferences.notifications.dailyChallenge
                          }
                        }
                      })}
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
                      onChange={() => setUser({
                        ...user, 
                        preferences: {
                          ...user.preferences,
                          notifications: {
                            ...user.preferences.notifications,
                            journalReminder: !user.preferences.notifications.journalReminder
                          }
                        }
                      })}
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
                      onChange={() => setUser({
                        ...user, 
                        preferences: {
                          ...user.preferences,
                          notifications: {
                            ...user.preferences.notifications,
                            communityUpdates: !user.preferences.notifications.communityUpdates
                          }
                        }
                      })}
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
    </Layout>
  );
};

export default ProfilePage;