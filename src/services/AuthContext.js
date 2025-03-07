import React, { createContext, useState, useEffect, useContext } from 'react';

// Create an authentication context
const AuthContext = createContext(null);

// Mock user template
const defaultUser = {
  name: 'Philosophical Seeker',
  email: '',
  avatar: '/images/avatars/avatar.png',
  joinDate: new Date().toISOString(),
  preferences: {
    learningStyle: 'interactive',
    interests: ['ethics', 'metaphysics', 'politics'],
    notifications: {
      dailyChallenge: true,
      journalReminder: true,
      communityUpdates: false
    }
  },
  stats: {
    entriesCount: 0,
    challengesCompleted: 0,
    reflectionsCount: 0,
    sophiaPoints: 0,
    debatesCount: 0
  },
  philosophicalCompass: {
    primarySchool: null,
    secondarySchool: null,
    affinities: {
      'stoic': 0,
      'peripatetic': 0,
      'platonic': 0,
      'skeptic': 0,
      'cynic': 0
    },
    lastUpdated: null
  },
  achievements: [],
  // Custom context for AI personalization
  customContext: ''
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if a user is stored in localStorage
    const storedUser = localStorage.getItem('oikosystem_user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      
      // Token limit setting removed
      
      setCurrentUser(userData);
    }
    setLoading(false);
  }, []);

  // Sign up function
  const signup = (email, name, password) => {
    // Check if we have temporary preferences from onboarding
    let tempPreferences;
    try {
      const storedPrefs = localStorage.getItem('tempUserPreferences');
      if (storedPrefs) {
        tempPreferences = JSON.parse(storedPrefs);
        // Remove temp preferences after we've retrieved them
        localStorage.removeItem('tempUserPreferences');
      }
    } catch (e) {
      console.error("Error retrieving temporary preferences:", e);
    }
    
    const newUser = {
      ...defaultUser,
      email,
      name: name || defaultUser.name,
      joinDate: new Date().toISOString(),
      // If there are temporary preferences from onboarding, use those
      preferences: tempPreferences || defaultUser.preferences
    };
    
    // Store user in localStorage
    localStorage.setItem('oikosystem_user', JSON.stringify(newUser));
    setCurrentUser(newUser);
    return true;
  };

  // Sign in function
  const signin = (email, password) => {
    // In a real app, this would validate against a server
    // For this prototype, we'll just check if the email exists in localStorage
    const storedUser = localStorage.getItem('oikosystem_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.email === email) {
        setCurrentUser(user);
        return true;
      }
    }
    return false;
  };

  // Sign out function
  const signout = () => {
    // In a real app, we'd do more here
    setCurrentUser(null);
    // Note: we're not removing from localStorage to simulate persistence
  };

  // Update user profile
  const updateUserProfile = (updatedData) => {
    const updatedUser = {
      ...currentUser,
      ...updatedData
    };
    localStorage.setItem('oikosystem_user', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
  };

  
  // Function to update the user's custom context
  const updateCustomContext = (newContext) => {
    if (!currentUser) return;
    
    const updatedUser = {
      ...currentUser,
      customContext: newContext
    };
    
    localStorage.setItem('oikosystem_user', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
  };

  // Context value
  const value = {
    currentUser,
    signup,
    signin,
    signout,
    updateUserProfile,
    loading,
    updateCustomContext
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};