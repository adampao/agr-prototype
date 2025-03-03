// philosopherExpertise.js

const philosopherExpertise = {
  Socrates: {
    primaryTopics: ['ethics', 'virtue', 'self-knowledge', 'questioning', 'dialogue', 'wisdom', 'ignorance', 'examination'],
    description: 'Socrates specializes in ethical inquiry, self-examination, and the Socratic method of questioning.',
    suggestionsMap: {
      metaphysics: { 
        philosopher: 'Plato', 
        reason: 'Plato developed comprehensive theories on forms, reality, and the nature of being.'
      },
      politics: { 
        philosopher: 'Aristotle', 
        reason: 'Aristotle wrote extensively on political theory, constitutions, and governance.'
      },
      mathematics: { 
        philosopher: 'Pythagoras', 
        reason: 'Pythagoras founded a school dedicated to mathematics, geometry, and numerical harmony.'
      },
      'practical wisdom': { 
        philosopher: 'Xenophon', 
        reason: 'Xenophon documented practical leadership and household management principles.'
      },
      'change and flux': { 
        philosopher: 'Heraclitus', 
        reason: 'Heraclitus focused on the nature of change, flux, and cosmic order.'
      }
    }
  },
  
  Plato: {
    primaryTopics: ['forms', 'reality', 'knowledge', 'metaphysics', 'justice', 'ideal state', 'immortality', 'love'],
    description: 'Plato specializes in metaphysics, theory of forms, and ideal political structures.',
    suggestionsMap: {
      'questioning method': { 
        philosopher: 'Socrates', 
        reason: 'Socrates pioneered the dialectical method of inquiry through questioning.'
      },
      'practical ethics': { 
        philosopher: 'Aristotle', 
        reason: 'Aristotle developed virtue ethics with a practical, rather than idealistic, approach.'
      },
      mathematics: { 
        philosopher: 'Pythagoras', 
        reason: 'Pythagoras established foundational mathematical principles that influenced Plato.'
      },
      'leadership': { 
        philosopher: 'Xenophon', 
        reason: 'Xenophon wrote practical accounts of leadership and historical events.'
      },
      'cosmic flux': { 
        philosopher: 'Heraclitus', 
        reason: 'Heraclitus explored the constant nature of change and opposites in the universe.'
      }
    }
  },
  
  Aristotle: {
    primaryTopics: ['ethics', 'virtue', 'happiness', 'biology', 'logic', 'categories', 'causality', 'politics', 'moderation'],
    description: 'Aristotle specializes in ethics, logic, biology, politics, and practical philosophy.',
    suggestionsMap: {
      'self-examination': { 
        philosopher: 'Socrates', 
        reason: 'Socrates focused on self-knowledge and examining one\'s beliefs.'
      },
      'metaphysical forms': { 
        philosopher: 'Plato', 
        reason: 'Plato developed the theory of forms and metaphysical reality beyond the physical.'
      },
      'mathematical harmony': { 
        philosopher: 'Pythagoras', 
        reason: 'Pythagoras discovered mathematical ratios in nature and music.'
      },
      'practical leadership': { 
        philosopher: 'Xenophon', 
        reason: 'Xenophon recorded historical accounts of leadership and management.'
      },
      'unity of opposites': { 
        philosopher: 'Heraclitus', 
        reason: 'Heraclitus explored how opposing forces create harmony and continuous change.'
      }
    }
  },
  
  Pythagoras: {
    primaryTopics: ['mathematics', 'numbers', 'harmony', 'geometry', 'music', 'astronomy', 'reincarnation', 'mysticism'],
    description: 'Pythagoras specializes in mathematics, numerical harmony, and cosmic order.',
    suggestionsMap: {
      'ethical inquiry': { 
        philosopher: 'Socrates', 
        reason: 'Socrates developed methods for examining ethical questions and moral beliefs.'
      },
      'metaphysics': { 
        philosopher: 'Plato', 
        reason: 'Plato expanded philosophical inquiry into the nature of reality beyond the physical.'
      },
      'practical ethics': { 
        philosopher: 'Aristotle', 
        reason: 'Aristotle created systematic approaches to ethics, virtue, and human flourishing.'
      },
      'historical accounts': { 
        philosopher: 'Xenophon', 
        reason: 'Xenophon documented historical events and practical leadership principles.'
      },
      'cosmic flux': { 
        philosopher: 'Heraclitus', 
        reason: 'Heraclitus examined the ever-changing nature of reality and existence.'
      }
    }
  },
  
  Xenophon: {
    primaryTopics: ['leadership', 'history', 'practical wisdom', 'household management', 'military strategy', 'socratic conversations', 'memoirs'],
    description: 'Xenophon specializes in practical wisdom, leadership, and historical accounts.',
    suggestionsMap: {
      'self-knowledge': { 
        philosopher: 'Socrates', 
        reason: 'Socrates pioneered methods for gaining self-knowledge and examining one\'s beliefs.'
      },
      'ideal government': { 
        philosopher: 'Plato', 
        reason: 'Plato developed comprehensive theories of justice and ideal governance.'
      },
      'systematic ethics': { 
        philosopher: 'Aristotle', 
        reason: 'Aristotle created frameworks for understanding ethics, politics, and human excellence.'
      },
      'mathematical principles': { 
        philosopher: 'Pythagoras', 
        reason: 'Pythagoras discovered mathematical principles governing nature and music.'
      },
      'nature of change': { 
        philosopher: 'Heraclitus', 
        reason: 'Heraclitus explored how change and opposing forces shape reality.'
      }
    }
  },
  
  Heraclitus: {
    primaryTopics: ['change', 'flux', 'fire', 'opposites', 'unity', 'logos', 'cosmic order', 'paradox'],
    description: 'Heraclitus specializes in the philosophy of change, unity of opposites, and cosmic order.',
    suggestionsMap: {
      'dialectic method': { 
        philosopher: 'Socrates', 
        reason: 'Socrates developed methods of questioning to uncover truth and wisdom.'
      },
      'eternal forms': { 
        philosopher: 'Plato', 
        reason: 'Plato contrasted the changing world with eternal, unchanging forms.'
      },
      'empirical observation': { 
        philosopher: 'Aristotle', 
        reason: 'Aristotle used systematic observation to understand the natural world.'
      },
      'mathematical harmony': { 
        philosopher: 'Pythagoras', 
        reason: 'Pythagoras discovered mathematical harmony underlying natural phenomena.'
      },
      'practical affairs': { 
        philosopher: 'Xenophon', 
        reason: 'Xenophon focused on practical matters of leadership and household management.'
      }
    }
  }
};

export default philosopherExpertise;