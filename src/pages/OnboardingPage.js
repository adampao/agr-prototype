import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Welcome from '../components/onboarding/Welcome';
import OracleQuestion from '../components/onboarding/OracleQuestion';
import PhilosophicalCompass from '../components/onboarding/PhilosophicalCompass';
import Personalization from '../components/onboarding/Personalization';
import Button from '../components/common/Button';
import AuthModal from '../components/auth/AuthModal';
import { useAuth } from '../services/AuthContext';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userPreferences, setUserPreferences] = useState({});
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signup');
  const { currentUser, updateUserProfile } = useAuth();
  
  // Check if user is already logged in when component mounts
  useEffect(() => {
    if (currentUser) {
      // If user has preferences already set, use them as a starting point
      if (currentUser.preferences) {
        setUserPreferences(prev => ({
          ...prev,
          ...currentUser.preferences
        }));
      }
    }
  }, [currentUser]);
  
  const handleContinueFromWelcome = () => {
    setStep(2);
  };
  
  const handleContinueFromOracle = (reason) => {
    setUserPreferences(prev => ({ ...prev, reason }));
    setStep(3);
  };
  
  const handleContinueFromCompass = (preferences) => {
    setUserPreferences(prev => ({ ...prev, ...preferences }));
    setStep(4);
  };
  
  const handleCompletionFromPersonalization = () => {
    // Save preferences to user profile if logged in
    if (currentUser) {
      updateUserProfile({
        preferences: userPreferences
      });
    } else {
      // If not logged in, prompt to create account to save preferences
      setAuthModalOpen(true);
      // Store preferences temporarily in localStorage
      localStorage.setItem('tempUserPreferences', JSON.stringify(userPreferences));
    }
    
    // Redirect to journal page regardless
    navigate('/journal');
  };
  
  const handleSkipOnboarding = () => {
    // Set default preferences for skipped users
    const defaultPreferences = {
      reason: 'general interest',
      learningStyle: 'text',
      interests: ['ethics'],
      lifeGoal: 'knowledge',
      skippedOnboarding: true
    };
    
    setUserPreferences(defaultPreferences);
    
    // Save to user profile if logged in
    if (currentUser) {
      updateUserProfile({
        preferences: defaultPreferences
      });
    }
    
    // Navigate directly to the journal
    navigate('/journal');
  };
  
  return (
    <div className="min-h-screen bg-marbleWhite flex flex-col">
      {/* Onboarding Header */}
      <header className="py-6 px-4 bg-white border-b border-aegeanBlue/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="font-serif text-2xl font-bold text-aegeanBlue">The Oikosystem</div>
          <div className="text-sm font-medium text-aegeanBlue/60">
            Step {step} of 4
          </div>
        </div>
      </header>
      
      {/* Onboarding Content */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {step === 1 && <Welcome onContinue={handleContinueFromWelcome} />}
          {step === 2 && <OracleQuestion onContinue={handleContinueFromOracle} />}
          {step === 3 && <PhilosophicalCompass onContinue={handleContinueFromCompass} />}
          {step === 4 && <Personalization userPreferences={userPreferences} onContinue={handleCompletionFromPersonalization} />}
        </div>
      </main>
      
      {/* Onboarding Footer */}
      <footer className="py-4 px-4 border-t border-aegeanBlue/10 bg-white">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-sm text-aegeanBlue/60">
            &copy; {new Date().getFullYear()} Ancient Greece Revisited
            <span className="ml-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSkipOnboarding} 
                className="text-aegeanBlue/60 hover:text-aegeanBlue"
              >
                Skip Onboarding
              </Button>
            </span>
          </div>
          <div className="text-sm">
          <Link to="/privacy" className="text-aegeanBlue hover:text-aegeanBlue/80">Privacy Policy</Link>
            <span className="mx-2 text-aegeanBlue/40">|</span>
            <Link to="/terms" className="text-aegeanBlue hover:text-aegeanBlue/80">Terms of Service</Link>
          </div>
        </div>
      </footer>
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
};

export default OnboardingPage;