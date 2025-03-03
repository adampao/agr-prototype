import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const HomePage = () => {
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
              <Link to="/onboarding">
                <Button size="lg">Begin Your Journey</Button>
              </Link>
              <Button variant="outline" size="lg" onClick={() => {
                if (typeof window.HTMLDialogElement === 'function') {
                  document.getElementById('waitlist-modal').showModal();
                } else {
                  // Fallback for browsers that don't support <dialog>
                  document.getElementById('waitlist-modal').style.display = 'block';
                }
              }}>Join the Waitlist</Button>
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
              Our platform connects you with ancient Greek philosophy through cutting-edge AI technology.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-philosophicalPurple/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-philosophicalPurple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-serif font-semibold text-aegeanBlue mb-2">
                  AI-Powered Philosophical Guidance
                </h3>
                <p className="text-aegeanBlue/80">
                  Engage in meaningful conversations with AI versions of ancient Greek philosophers, tailored to your questions and challenges.
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
                  Personal Growth Journey
                </h3>
                <p className="text-aegeanBlue/80">
                  Track your development through daily challenges, reflective journaling, and customized philosophical exercises.
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
                  Philosophical Community
                </h3>
                <p className="text-aegeanBlue/80">
                  Join symposiums and debates to engage with like-minded seekers of wisdom in our modern digital Agora.
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
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
      
      {/* Testimonials Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-aegeanBlue mb-4">
              What Our Users Say
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <div className="mb-4">
                <div className="flex text-oliveGold">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-aegeanBlue/80 mb-4 italic">
                "If it's interactive and I can apply it practically, I'd probably use it, especially if it offered daily insights or challenges."
              </p>
              <div className="flex items-center">
                <div className="font-medium text-aegeanBlue">Ben Hamnett, 38</div>
                <div className="mx-2 text-aegeanBlue/40">|</div>
                <div className="text-aegeanBlue/60">IT Project Manager</div>
              </div>
            </Card>
            
            <Card>
              <div className="mb-4">
                <div className="flex text-oliveGold">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-aegeanBlue/80 mb-4 italic">
                "As a therapist, when I feel stuck with a client, I could see myself using it from the helper's perspective for guidance."
              </p>
              <div className="flex items-center">
                <div className="font-medium text-aegeanBlue">Vanessa Hodgson, 40</div>
                <div className="mx-2 text-aegeanBlue/40">|</div>
                <div className="text-aegeanBlue/60">Psychotherapist</div>
              </div>
            </Card>
            
            <Card>
              <div className="mb-4">
                <div className="flex text-oliveGold">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-aegeanBlue/80 mb-4 italic">
                "Using an ancient knowledge base to run current real world problems through to get an answer that you wouldn't get from the current life perspective."
              </p>
              <div className="flex items-center">
                <div className="font-medium text-aegeanBlue">Mate Kovacs, 42</div>
                <div className="mx-2 text-aegeanBlue/40">|</div>
                <div className="text-aegeanBlue/60">Business Owner</div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-16 bg-philosophicalPurple/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold text-aegeanBlue mb-4">
            Ready to Begin Your Philosophical Journey?
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-aegeanBlue/80 mb-8">
            Join thousands of seekers exploring ancient wisdom with modern technology.
          </p>
          <Link to="/onboarding">
            <Button size="lg">Start Now</Button>
          </Link>
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
    </div>
  );
};

export default HomePage;