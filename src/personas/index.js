/**
 * Personas Index
 * 
 * This file imports and exports all persona definitions from various categories.
 * It provides a central access point for retrieving persona data.
 */

// Import philosophers
import socrates from './philosophers/socrates';
import xenophon from './philosophers/xenophon';
import heraclitus from './philosophers/heraclitus';
import aristotle from './philosophers/aristotle';
import plato from './philosophers/plato';
import pythagoras from './philosophers/pythagoras';
// Other philosophers will be added here as they're created

// Create a lookup object by ID for easy access
const personas = {
  // Philosophers
  socrates, xenophon, heraclitus, aristotle, plato, pythagoras
  // Additional personas will be added here
};

/**
 * Get a persona by ID
 * @param {string} id - The persona ID
 * @return {Object|null} The persona object or null if not found
 */
export const getPersona = (id) => {
  return personas[id] || null;
};

/**
 * Get a prompt for a specific persona and context
 * @param {string} id - The persona ID
 * @param {string} context - The interaction context ('chat', 'debate', 'journal')
 * @param {string} userContext - Optional user-specific context
 * @return {string|null} The generated prompt or null if persona not found
 */
export const getPrompt = (id, context = 'chat', userContext = '') => {
  const persona = getPersona(id);
  if (!persona) return null;
  
  return persona.generatePrompt(context, userContext);
};

/**
 * Get all available personas
 * @return {Object} All persona objects
 */
export const getAllPersonas = () => {
  return personas;
};

export default personas;