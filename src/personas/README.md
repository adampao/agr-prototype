# Persona-Based Prompt System: Implementation Guide

This document explains how to implement and maintain the persona-based prompt system for the AGR platform. It provides step-by-step instructions for migrating existing philosophers and adding new personas.

## Table of Contents

1. [System Overview](#system-overview)
2. [File Structure](#file-structure)
3. [Migrating Existing Philosophers](#migrating-existing-philosophers)
4. [Creating a New Persona](#creating-a-new-persona)
5. [Customizing Prompts by Context](#customizing-prompts-by-context)
6. [Testing Your Changes](#testing-your-changes)
7. [Troubleshooting](#troubleshooting)

## System Overview

The persona-based system separates each character's definition into its own file with context-specific prompts. This allows for:

- Independent editing of each persona
- Different behavior in chat, debate, and journal contexts
- Easy addition of new personas
- Better organization and maintainability

## File Structure

```
src/
├── personas/
│   ├── index.js                  # Central access point
│   ├── philosophers/
│   │   ├── socrates.js           # Socrates persona
│   │   ├── aristotle.js          # Aristotle persona
│   │   └── ...                   # Other philosopher personas
│   └── ... (other persona types)
└── services/
    └── aiApi.js                  # API layer that uses personas
```

## Migrating Existing Philosophers

Follow these steps to migrate each remaining philosopher:

1. **Create a new file for the philosopher**:
   - Create a file in `src/personas/philosophers/` named after the philosopher (e.g., `aristotle.js`)
   - Use the Socrates file as a template

2. **Copy basic information**:
   - Use information from the existing `aiApi.js` file's `PHILOSOPHER_DATA` section
   - Include ID, name, lifespan, specialty, etc.

3. **Transfer knowledge boundaries**:
   - Copy the knowledge boundaries from the `knowledgeBoundaries` object
   - Include later philosophers and key events they wouldn't know about

4. **Transfer areas of expertise**:
   - Copy the expertise information from the `philosopherExpertise` object

5. **Create context-specific prompts**:
   - Create separate prompts for chat, debate, and journal contexts
   - Customize each prompt for the philosopher's unique style and approach

6. **Update the `generatePrompt` function**:
   - This should usually be kept the same across all personas
   - It combines the base prompt with historical context

7. **Update the `personas/index.js` file**:
   - Import the new philosopher file
   - Add it to the `personas` object

### Example: Migrating Aristotle

```javascript
// src/personas/philosophers/aristotle.js
const aristotle = {
  // Basic information
  id: 'aristotle',
  name: 'Aristotle',
  fullName: 'Aristotle of Stagira',
  lifespan: '384-322 BCE',
  specialty: 'Practical Wisdom',
  description: 'Virtue lies in the golden mean. I will help you find balance and practical wisdom in your life.',
  
  // External references (for UI)
  imageSrc: '/images/philosophers/aristotle.jpg',
  modernImageSrc: '/images/philosophers/aristotle_modern.jpg',
  accent: 'bg-aegeanBlue/20 border-aegeanBlue/30 text-aegeanBlue',
  
  // Historical knowledge boundaries
  knowledgeBoundaries: {
    laterPhilosophers: ['Stoics', 'Epicureans', 'Neoplatonists', 'Medieval philosophers'],
    keyEvents: ['Roman Empire', 'Christianity', 'Islamic Golden Age', 'Modern science', 'Modern technology']
  },
  
  // Areas of expertise
  expertise: {
    ethics: ['for virtue ethics and the golden mean'],
    science: ['for empirical observation and classification'],
    logic: ['for formal systems of reasoning'],
    politics: ['for practical governance']
  },
  
  // Context-specific prompts
  prompts: {
    // Chat prompt
    chat: `You are Aristotle of Stagira (384-322 BCE), student of Plato and tutor to Alexander the Great. Embody these Aristotelian qualities:

1. Approach topics systematically and practically with an emphasis on empirical knowledge.
2. Seek balance in all things - the "golden mean" between extremes is where virtue lies.
3. Use logical analysis and categorization to understand concepts.
4. Refer to your extensive works on ethics, politics, metaphysics, biology, and logic.
5. Apply your framework of the four causes (material, formal, efficient, final) when explaining phenomena.
6. Emphasize eudaimonia (flourishing/happiness) as the goal of human life, achieved through virtue.
7. Use concrete examples from nature and human society to illustrate abstract principles.
8. Reference your experiences at the Lyceum, your school in Athens.
9. Mention your empirical observations when relevant, as you were known for your interest in biology and natural phenomena.
10. Occasionally refer to your disagreements with Plato's theory of Forms, favoring a more grounded approach.`,

    // Debate prompt
    debate: `You are Aristotle of Stagira (384-322 BCE) participating in a philosophical debate. Use your systematic and practical approach to address the topic:

1. Begin with clear definitions of key terms, as precision in language is essential to proper analysis.
2. Apply the principles of formal logic you developed, avoiding contradictions and fallacies.
3. Organize your arguments systematically, breaking complex topics into their constituent parts.
4. Refer to your concept of the "golden mean" - virtue exists between deficiency and excess.
5. Cite empirical evidence and observations when possible, as knowledge comes from experience.
6. Draw on your wide range of works including Ethics, Politics, Metaphysics, and Poetics.
7. Politely challenge others when they use improper reasoning or fail to define terms adequately.
8. Occasionally reference your time at the Lyceum and your methods of teaching through walking discussions.
9. When appropriate, mention your tutelage of Alexander the Great to establish your authority on matters of politics and leadership.
10. Maintain your view that the purpose of debate is not merely theoretical knowledge but practical wisdom that leads to virtuous action.`,

    // Journal prompt
    journal: `As Aristotle, provide a brief philosophical insight about this journal entry. Apply your systematic analysis and practical wisdom to help the writer gain deeper perspective. Focus on identifying the golden mean, the proper virtuous response, or the underlying causes at work.

Draw upon your ethical framework regarding virtue, moderation, and eudaimonia (flourishing), or your understanding of human psychology and character development.

Keep your response to 1-2 sentences, making them practical and actionable. Occasionally reference one of your key concepts like the four causes, the golden mean, or proper function when relevant.`
  },
  
  // Generate complete prompt with context
  generatePrompt: function(context = 'chat', userContext = '') {
    // Get the base prompt for the requested context (or fall back to chat)
    const basePrompt = this.prompts[context] || this.prompts.chat;
    
    // Get general instructions (if available)
    const generalInstructions = this.prompts.general || '';
    
    // Build historical context section
    const historicalContext = `
Important: You are ${this.name} living in ancient Greece during ${this.lifespan}. You have no knowledge of events, people, inventions, or concepts that came after your death.

You are not aware of:
${this.knowledgeBoundaries.laterPhilosophers.map(p => `- ${p}`).join('\n')}
${this.knowledgeBoundaries.keyEvents.map(e => `- ${e}`).join('\n')}

If asked about something beyond your time, politely acknowledge this limitation with something like: "As I lived in ${this.lifespan}, I wouldn't have knowledge of that. Perhaps another philosopher who came later might offer insights on this topic."

Your areas of special expertise include:
${Object.entries(this.expertise)
  .map(([area, reasons]) => `- ${area} ${reasons[0]}`)
  .join('\n')}
`;

    // Add any user-specific context
    const userContextSection = userContext ? `\nAdditional context: ${userContext}` : '';
    
    // Example of conditional inclusion of general instructions
    // This excludes general instructions from the debate context
    if (context === 'debate') {
      return basePrompt + historicalContext + userContextSection;
    }
    
    // For all other contexts, include general instructions
    return basePrompt + '\n\n' + generalInstructions + historicalContext + userContextSection;
  }
};

export default aristotle;
```

Then update the index file:

```javascript
// src/personas/index.js
import socrates from './philosophers/socrates';
import aristotle from './philosophers/aristotle';
// ... other imports

const personas = {
  socrates,
  aristotle,
  // ... other personas
};

// ... rest of the file
```

## Creating a New Persona

To add a completely new persona:

1. **Create a new file**:
   - Place it in the appropriate subfolder (e.g., `philosophers/`, `poets/`, etc.)
   - Use the same structure as existing personas

2. **Define all required properties**:
   - Basic information (id, name, lifespan)
   - Historical context (knowledge boundaries)
   - Areas of expertise
   - Context-specific prompts
   - The `generatePrompt` function

3. **Import and register in `index.js`**:
   - Add an import for the new persona
   - Add it to the `personas` object

## Customizing Prompts by Context

Each persona file contains different types of prompts:

1. **Context-specific prompts**:
   - **Chat prompt**: Used in direct philosophical conversations
     - More interactive and questioning
     - Focus on the philosopher's typical dialogue style
   - **Debate prompt**: Used in structured philosophical debates
     - More formal and position-oriented
     - Includes debating techniques specific to the philosopher
   - **Journal prompt**: Used for brief insights on journal entries
     - Very concise (1-2 sentences)
     - Focused on the philosopher's key insights

2. **General instructions** (optional):
   - Can be added as `general` property in the `prompts` object
   - Contains instructions that apply across multiple contexts
   - Can be conditionally included or excluded from specific contexts
   - Added after the context-specific prompt but before historical context

Tips for writing effective prompts:

- Research the philosopher's actual writing style and arguments
- Include specific instructions about response format and length
- Mention key concepts, works, or methods unique to the philosopher
- Add instructions for handling topics outside their knowledge
- Include examples of how they should refer to their historical context

## Testing Your Changes

After creating or updating a persona:

1. **Start the development server**:
   ```
   netlify dev
   ```

2. **Check the console logs**:
   - Confirm the persona file is being loaded
   - Look for "Using new persona system for [philosopher]" messages

3. **Test different contexts**:
   - Test chat functionality with the philosopher
   - Test debate functionality if available
   - Test journal insights if applicable

4. **Check prompt application**:
   - The console will show the first 100 characters of the prompt
   - Verify the correct context-specific prompt is being used

## Troubleshooting

**Persona not loading:**
- Check import paths in `index.js`
- Verify the file structure is correct
- Check for JavaScript syntax errors

**Incorrect prompt being used:**
- Verify the `context` parameter is being passed correctly
- Check console logs to see which context is being detected
- Ensure all three context prompts exist in the persona file

**Serverless function errors:**
- Check Netlify function logs for import errors
- Ensure the serverless function can access the persona files
- Verify the import paths use the correct relative paths

**Backward compatibility issues:**
- The system is designed to fall back to legacy prompts
- Check that `PHILOSOPHER_DATA` is still being correctly imported
- Ensure the `generatePrompt` function has the same parameters across all personas

---

With this guide, you should be able to successfully migrate all remaining philosophers and add new personas as needed. The system is designed to be maintainable and extensible, making it easy to adjust prompts and test different personality traits for each character.