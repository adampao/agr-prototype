import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';

const AboutModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <motion.div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-4 md:p-6 relative overflow-y-auto max-h-[90vh]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-1"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-aegeanBlue mb-4 sm:mb-6">
          About Ancient Greece Revisited
        </h2>
        
        <div className="prose prose-aegeanBlue max-w-none text-base sm:text-lg">
          <h3 className="text-lg sm:text-xl text-philosophicalPurple font-serif">Our Vision</h3>
          <p>
            Ancient Greece Revisited (AGR) is transforming timeless wisdom into an immersive experience for self-growth 
            and critical thinking in today's digital world. Our mission is to "Make Ancient Greece Sexy Again" by revealing 
            its wild, nuanced aspects and making them relevant for modern users.
          </p>
          
          <h3 className="text-lg sm:text-xl text-philosophicalPurple font-serif mt-4 sm:mt-6">The Team</h3>
          
          <div className="flex flex-col md:flex-row gap-6 mt-4">
            <div className="flex-1">
              <h4 className="font-medium text-lg">Adam Petritsis</h4>
              <p className="text-sm text-aegeanBlue/70 mb-2">Founder & CEO</p>
              <p>
                Adam combines deep expertise in ancient Greek philosophy with a background in filmmaking and technology.
                His passion for making ancient wisdom accessible and relevant drives AGR's vision and direction.
              </p>
            </div>
            
            <div className="flex-1">
              <h4 className="font-medium text-lg">Michael Michailidis</h4>
              <p className="text-sm text-aegeanBlue/70 mb-2">Founder & CTO</p>
              <p>
                Michael brings extensive technical expertise and a passion for innovative AI applications.
                His background in software development and digital experience design shapes AGR's technical approach.
              </p>
            </div>
          </div>
          
          <h3 className="text-lg sm:text-xl text-philosophicalPurple font-serif mt-4 sm:mt-6">Our Approach</h3>
          <p>
            Born from a deep understanding of ancient Greek philosophy and modern technology, AGR addresses the digital 
            distress of endless content consumption without meaningful self-growth. We're creating a digital renaissance 
            of wisdom at a time when humanity craves deeper, more meaningful experiences.
          </p>
          
          <h3 className="text-lg sm:text-xl text-philosophicalPurple font-serif mt-4 sm:mt-6">The Oikosystem</h3>
          <p>
            Our platform is structured as a personal digital "Oikos" (Greek household) with three main components:
          </p>
          <ul>
            <li><strong>The Journal:</strong> Personal philosophical journaling with AI insights</li>
            <li><strong>The Study:</strong> Direct engagement with Ancient Greek knowledge</li>
            <li><strong>The Agora:</strong> Community interaction and philosophical discourse</li>
          </ul>
          
          <h3 className="text-lg sm:text-xl text-philosophicalPurple font-serif mt-4 sm:mt-6">Contact Us</h3>
          <p>
            We'd love to hear from you! For inquiries, partnership opportunities, or feedback:
            <br />
            <a href="mailto:hello@agr-series.com" className="text-aegeanBlue hover:underline">hello@agr-series.com</a>
          </p>
        </div>
        
        <div className="mt-8 text-center">
          <Button onClick={onClose}>Close</Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AboutModal;