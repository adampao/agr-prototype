import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Welcome from '../components/onboarding/Welcome';
import OracleQuestion from '../components/onboarding/OracleQuestion';
import PhilosophicalCompass from '../components/onboarding/PhilosophicalCompass';
import Personalization from '../components/onboarding/Personalization';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userPreferences, setUserPreferences] = useState({});
  
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
    // In a real app, we would save the user preferences to the backend here
    // For the prototype, we'll just redirect to the journal page
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
          </div>
          <div className="text-sm">
          <Link to="/privacy" className="text-aegeanBlue hover:text-aegeanBlue/80">Privacy Policy</Link>
            <span className="mx-2 text-aegeanBlue/40">|</span>
            <Link to="/terms" className="text-aegeanBlue hover:text-aegeanBlue/80">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OnboardingPage;