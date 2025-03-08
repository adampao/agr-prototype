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
      featureHistory: [], // New array to store feature usage with timestamps
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
  
  // Ensure featureHistory exists in older stored data
  if (!data.featureHistory) {
    data.featureHistory = [];
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
  
  // Send this data to the backend
  sendAnalyticsToBackend({ type: 'pageView', page: pageName });
};

// Record a feature use
export const trackFeatureUse = (featureName, additionalData = {}) => {
  const data = JSON.parse(localStorage.getItem('agr_analytics') || '{}');
  const timestamp = new Date().toISOString();
  
  // Ensure the features object exists
  if (!data.features) {
    data.features = {};
  }
  
  // Update count in features object
  if (!data.features[featureName]) {
    data.features[featureName] = 1;
  } else {
    data.features[featureName] += 1;
  }
  
  // Ensure the featureHistory array exists
  if (!data.featureHistory) {
    data.featureHistory = [];
  }
  
  // Add entry to featureHistory with timestamp and details
  data.featureHistory.push({
    feature: featureName,
    timestamp: timestamp,
    sessionId: getSessionId(),
    ...additionalData
  });
  
  localStorage.setItem('agr_analytics', JSON.stringify(data));
  
  // Send this data to the backend in a more structured format
  sendAnalyticsToBackend({ 
    type: 'featureUse', 
    feature: featureName,
    timestamp: timestamp,
    details: additionalData
  });
};

// Get feature usage summary for reporting
export const getFeatureUsageSummary = () => {
  const data = JSON.parse(localStorage.getItem('agr_analytics') || '{}');
  
  if (!data.featureHistory) {
    return [];
  }
  
  // Create a formatted array of feature usage for reporting
  return data.featureHistory.map(entry => ({
    featureName: entry.feature,
    usageTime: entry.timestamp,
    sessionId: entry.sessionId,
    additionalDetails: Object.keys(entry)
      .filter(key => !['feature', 'timestamp', 'sessionId'].includes(key))
      .reduce((obj, key) => {
        obj[key] = entry[key];
        return obj;
      }, {})
  }));
};

// Record user feedback
export const recordFeedback = (feedbackData) => {
  const data = JSON.parse(localStorage.getItem('agr_analytics') || '{}');
  const timestamp = new Date().toISOString();
  
  data.feedbackGiven = true;
  data.feedback = {
    ...feedbackData,
    timestamp: timestamp
  };
  
  // Format feature usage for better readability in spreadsheets
  const formattedFeatures = getFeatureUsageSummary();
  const featuresList = Object.entries(data.features || {}).map(([name, count]) => 
    `${name} (${count} times)`
  ).join(", ");
  
  localStorage.setItem('agr_analytics', JSON.stringify(data));
  
  // Send feedback to backend with improved feature data format
  return sendFeedbackToBackend({
    ...feedbackData,
    featureUsage: {
      summary: featuresList,
      details: formattedFeatures.slice(-10) // Send the 10 most recent feature usages
    },
    timestamp: timestamp
  });
};

// Get all analytics data
export const getAnalyticsData = () => {
  return JSON.parse(localStorage.getItem('agr_analytics') || '{}');
};

// Check if user has provided feedback
export const hasFeedback = () => {
  const data = JSON.parse(localStorage.getItem('agr_analytics') || '{}');
  return data.feedbackGiven === true;
};

// Send analytics to backend
const sendAnalyticsToBackend = async (data) => {
  // This sends analytics data to the backend via the same endpoint as feedback
  try {
    const analyticsData = getAnalyticsData();
    
    // Format the feature data for better readability in Google Sheets
    let formattedData = {
      ...data,
      sessionId: getSessionId()
    };
    
    // If this is a feature use event, add extra formatting
    if (data.type === 'featureUse') {
      // Create a single string of feature usage for easier spreadsheet viewing
      const featureCount = analyticsData.features[data.feature] || 1;
      formattedData.featureFormatted = `${data.feature} (${featureCount} times)`;
      
      // Add total feature usage summary
      formattedData.allFeaturesUsed = Object.entries(analyticsData.features || {})
        .map(([name, count]) => `${name}: ${count}`)
        .join("; ");
    }
    
    const response = await fetch('/.netlify/functions/record-feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'analytics',
        timestamp: new Date().toISOString(),
        data: formattedData
      })
    });
    return response.ok;
  } catch (error) {
    console.error('Error sending analytics:', error);
    return false;
  }
};

// Send feedback to backend via Netlify function
const sendFeedbackToBackend = async (feedbackData) => {
  try {
    const analyticsData = getAnalyticsData();
    
    // Format page views as a readable string
    const pageViewsSummary = Object.entries(analyticsData.pageViews || {})
      .map(([page, count]) => `${page}: ${count} views`)
      .join("; ");
    
    // Format features as a readable string
    const featuresSummary = Object.entries(analyticsData.features || {})
      .map(([feature, count]) => `${feature}: ${count} times`)
      .join("; ");
    
    const response = await fetch('/.netlify/functions/record-feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...feedbackData,
        sessionId: getSessionId(),
        timestamp: new Date().toISOString(),
        usageSummary: {
          visitCount: analyticsData.visitCount || 1,
          firstVisit: analyticsData.firstVisit,
          lastVisit: analyticsData.lastVisit,
          pageViews: pageViewsSummary,
          featureUsage: featuresSummary
        }
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
  getFeatureUsageSummary,
  hasFeedback
};