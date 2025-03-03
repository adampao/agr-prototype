import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './styles/tailwind.css';
import { AuthProvider } from './services/AuthContext';
import FeedbackCard from './components/common/FeedbackCard';
import { trackPageView } from './services/analyticsService';

// Import pages
import HomePage from './pages/HomePage';
import OnboardingPage from './pages/OnboardingPage';
import JournalPage from './pages/JournalPage';
import StudyPage from './pages/StudyPage';
import AgoraPage from './pages/AgoraPage';
import ProfilePage from './pages/ProfilePage';

// Analytics wrapper component to track page views
const AnalyticsWrapper = ({ children }) => {
  const location = useLocation();
  
  useEffect(() => {
    // Track page view when location changes
    const pageName = location.pathname === '/' ? 'home' : location.pathname.substring(1);
    trackPageView(pageName);
  }, [location]);
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AnalyticsWrapper>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/study" element={<StudyPage />} />
            <Route path="/agora" element={<AgoraPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <FeedbackCard />
        </AnalyticsWrapper>
      </Router>
    </AuthProvider>
  );
}

export default App;