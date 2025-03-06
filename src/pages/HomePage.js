import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import PhilosophicalCompassPreview from '../components/common/PhilosophicalCompassPreview';
import AuthModal from '../components/auth/AuthModal';
import { useAuth } from '../services/AuthContext';

const HomePage = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const { currentUser } = useAuth();
  
  const openSignIn = () => {
    setAuthMode('signin');
    setAuthModalOpen(true);
  };

  const openSignUp = () => {
    setAuthMode('signup');
    setAuthModalOpen(true);
  };
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-marbleWhite py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-serif font-bold text-aegeanBlue mb-6 tracking-tight"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Ancient Wisdom Meets <br />
              <span className="text-philosophicalPurple">Modern Intelligence</span>
            </motion.h1>
            
            <motion.p 
              className="max-w-2xl mx-auto text-xl text-aegeanBlue/80 mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Transform timeless Greek philosophy into a personalized journey of growth and critical thinking for today's challenges.
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {currentUser ? (
                <Link to="/journal">
                  <Button size="lg">Continue Your Journey</Button>
                </Link>
              ) : (
                <Link to="/onboarding">
                  <Button size="lg">Try the Demo</Button>
                </Link>
              )}
              <Button variant="outline" size="lg" onClick={() => {
                if (typeof window.HTMLDialogElement === 'function') {
                  document.getElementById('waitlist-modal').showModal();
                } else {
                  // Fallback for browsers that don't support <dialog>
                  document.getElementById('waitlist-modal').style.display = 'block';
                }
              }}>Join the Waitlist</Button>
            </motion.div>
            
            <motion.div
              className="mt-6 flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              {!currentUser ? (
                <>
                  <Button variant="text" size="md" onClick={openSignIn}>Sign In</Button>
                  <Button variant="text" size="md" onClick={openSignUp}>Create Account</Button>
                </>
              ) : (
                <p className="text-sm text-aegeanBlue/80">Welcome back, {currentUser.name}</p>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-aegeanBlue mb-4">
              The Path to Wisdom
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-aegeanBlue/80">
              Our platform connects you with ancient Greek philosophy, history and mythology through cutting-edge AI technology.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <Card>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-philosophicalPurple/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-philosophicalPurple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-serif font-semibold text-aegeanBlue mb-2">
                  The Journal <br/>AI-Powered Philosophical Guidance 
                  
                </h3>
                <p className="text-aegeanBlue/80">
                Your personal space for reflection and growth, enhanced by AI-guided insights and daily challenges.
                </p>
              </div>
            </Card>
            
            <Card>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-oracleGreen/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-oracleGreen" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-serif font-semibold text-aegeanBlue mb-2">
                  The Study <br/>Personal Growth Journey
                </h3>
                <p className="text-aegeanBlue/80">
                Dive deep into ancient Greek knowledge through interactive learning experiences and personalized pathways.
                </p>
              </div>
            </Card>
            
            <Card>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-terracotta/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-serif font-semibold text-aegeanBlue mb-2">
                  The Agora  <br/>Philosophical Community
                </h3>
                <p className="text-aegeanBlue/80">
                  Join symposiums and debates and connect with a community of fellow knowledge seekers.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
      
      {/* How It Works Section */}
      <div className="py-16 bg-marbleWhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-aegeanBlue mb-4">
              How It Works
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-aegeanBlue/80">
              Your journey through ancient wisdom is as unique as you are.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-oliveGold text-white flex items-center justify-center font-bold text-xl">
                1
              </div>
              <h3 className="text-lg font-medium text-aegeanBlue mb-2">
                Personalization
              </h3>
              <p className="text-aegeanBlue/80">
                Answer a few questions about your interests and goals to customize your experience.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-oliveGold text-white flex items-center justify-center font-bold text-xl">
                2
              </div>
              <h3 className="text-lg font-medium text-aegeanBlue mb-2">
                Daily Practice
              </h3>
              <p className="text-aegeanBlue/80">
                Engage with philosophical challenges and micro-journaling prompts tailored to your needs.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-oliveGold text-white flex items-center justify-center font-bold text-xl">
                3
              </div>
              <h3 className="text-lg font-medium text-aegeanBlue mb-2">
                Deep Learning
              </h3>
              <p className="text-aegeanBlue/80">
                Explore the knowledge base and engage with AI philosophers to deepen your understanding.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-oliveGold text-white flex items-center justify-center font-bold text-xl">
                4
              </div>
              <h3 className="text-lg font-medium text-aegeanBlue mb-2">
                Community Growth
              </h3>
              <p className="text-aegeanBlue/80">
                Join discussions and debates with other philosophical minds in the Agora.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Philosophical Compass Preview Section */}
      <PhilosophicalCompassPreview />
      
      {/* CTA Section */}
      <div className="py-16 bg-philosophicalPurple/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold text-aegeanBlue mb-4">
            Ready to Begin Your Philosophical Journey?
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-aegeanBlue/80 mb-8">
            Join thousands of seekers exploring ancient wisdom with modern technology.
          </p>
          {currentUser ? (
            <Link to="/journal">
              <Button size="lg">Continue Your Journey</Button>
            </Link>
          ) : (
            <Link to="/onboarding">
              <Button size="lg">Start Now</Button>
            </Link>
          )}
        </div>
      </div>

      {/* Waitlist Modal */}
      <dialog id="waitlist-modal" className="modal p-0 rounded-lg shadow-elegant max-w-md w-full bg-white">
        <div className="p-6">
          <h3 className="text-2xl font-serif font-bold text-aegeanBlue mb-4">Join Our Waitlist</h3>
          <p className="text-aegeanBlue/80 mb-6">
            Be the first to know when The Oikosystem launches. We'll notify you as soon as it's ready.
          </p>
          
          <form name="waitlist" method="POST" netlify className="space-y-4">
            <input type="hidden" name="form-name" value="waitlist" />
            
            <p>
              <label className="block text-sm font-medium text-aegeanBlue/70 mb-1">
                Email
                <input 
                  type="email" 
                  name="email" 
                  required
                  className="w-full mt-1 px-4 py-2 border border-aegeanBlue/20 rounded-md focus:ring-2 focus:ring-oliveGold/50 focus:border-oliveGold outline-none"
                  placeholder="you@example.com"
                />
              </label>
            </p>
            
            <p>
              <label className="block text-sm font-medium text-aegeanBlue/70 mb-1">
                Name (Optional)
                <input 
                  type="text" 
                  name="name"
                  className="w-full mt-1 px-4 py-2 border border-aegeanBlue/20 rounded-md focus:ring-2 focus:ring-oliveGold/50 focus:border-oliveGold outline-none"
                  placeholder="Your name"
                />
              </label>
            </p>
            
            <p className="flex items-start">
              <label className="flex items-start">
                <input
                  name="interest"
                  type="checkbox"
                  className="h-4 w-4 mt-1 text-oliveGold border-aegeanBlue/20 rounded focus:ring-oliveGold/50"
                />
                <span className="ml-3 text-sm text-aegeanBlue/70">
                  I'd like to participate in beta testing
                </span>
              </label>
            </p>
            
            <div className="flex gap-3 justify-end">
              <Button 
                variant="ghost" 
                onClick={() => document.getElementById('waitlist-modal').close()}
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </div>
      </dialog>
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
};

export default HomePage;