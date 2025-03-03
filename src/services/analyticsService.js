/**
 * Analytics Service
 * 
 * A lightweight, privacy-friendly analytics service that:
 * - Tracks anonymous usage data
 * - Stores information in localStorage
 * - Provides functions to record user engagement
 * - Can optionally send data to a backend
 */

// Generate a random session ID that persists for this browser session
const generateSessionId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Check if we already have a session ID in localStorage, or create one
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('agr_session_id');
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem('agr_session_id', sessionId);
  }
  return sessionId;
};

// Initialize tracking data if it doesn't exist
const initializeTrackingData = () => {
  if (!localStorage.getItem('agr_analytics')) {
    const initialData = {
      firstVisit: new Date().toISOString(),
      lastVisit: new Date().toISOString(),
      visitCount: 1,
      pageViews: {},
      features: {},
      feedbackGiven: false,
      sessionIds: [getSessionId()]
    };
    localStorage.setItem('agr_analytics', JSON.stringify(initialData));
    return initialData;
  }
  
  // If data exists, update it for a new visit
  const data = JSON.parse(localStorage.getItem('agr_analytics'));
  const sessionId = getSessionId();
  
  // Only count as a new visit if it's a new session
  if (!data.sessionIds.includes(sessionId)) {
    data.lastVisit = new Date().toISOString();
    data.visitCount += 1;
    data.sessionIds.push(sessionId);
    localStorage.setItem('agr_analytics', JSON.stringify(data));
  }
  
  return data;
};

// Record a page view
export const trackPageView = (pageName) => {
  const data = JSON.parse(localStorage.getItem('agr_analytics') || '{}');
  
  if (!data.pageViews) {
    data.pageViews = {};
  }
  
  if (!data.pageViews[pageName]) {
    data.pageViews[pageName] = 1;
  } else {
    data.pageViews[pageName] += 1;
  }
  
  localStorage.setItem('agr_analytics', JSON.stringify(data));
  
  // Option to send this data to your backend
  // sendAnalyticsToBackend({ type: 'pageView', page: pageName });
};

// Record a feature use
export const trackFeatureUse = (featureName) => {
  const data = JSON.parse(localStorage.getItem('agr_analytics') || '{}');
  
  if (!data.features) {
    data.features = {};
  }
  
  if (!data.features[featureName]) {
    data.features[featureName] = 1;
  } else {
    data.features[featureName] += 1;
  }
  
  localStorage.setItem('agr_analytics', JSON.stringify(data));
  
  // Option to send this data to your backend
  // sendAnalyticsToBackend({ type: 'featureUse', feature: featureName });
};

// Record user feedback
export const recordFeedback = (feedbackData) => {
  const data = JSON.parse(localStorage.getItem('agr_analytics') || '{}');
  
  data.feedbackGiven = true;
  data.feedback = {
    ...feedbackData,
    timestamp: new Date().toISOString()
  };
  
  localStorage.setItem('agr_analytics', JSON.stringify(data));
  
  // Send feedback to backend
  return sendFeedbackToBackend(feedbackData);
};

// Get all analytics data
export const getAnalyticsData = () => {
  return JSON.parse(localStorage.getItem('agr_analytics') || '{}');
};

// Check if user has provided feedback
export const hasFeedback = () => {
  const data = JSON.parse(localStorage.getItem('agr_analytics') || '{}');
  return data.feedbackGiven || false;
};

// Send analytics to backend
const sendAnalyticsToBackend = async (data) => {
  // This is a placeholder - in a real implementation, you would send the data to your backend
  console.log("Analytics data would be sent to backend:", data);
};

// Send feedback to backend via Netlify function
const sendFeedbackToBackend = async (feedbackData) => {
  try {
    const response = await fetch('/.netlify/functions/record-feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...feedbackData,
        sessionId: getSessionId(),
        timestamp: new Date().toISOString()
      })
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error sending feedback:', error);
    return false;
  }
};

// Initialize on import
initializeTrackingData();

export default {
  trackPageView,
  trackFeatureUse,
  recordFeedback,
  getAnalyticsData,
  hasFeedback
};