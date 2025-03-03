import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/tailwind.css';
import { AuthProvider } from './services/AuthContext';

// Import pages
import HomePage from './pages/HomePage';
import OnboardingPage from './pages/OnboardingPage';
import JournalPage from './pages/JournalPage';
import StudyPage from './pages/StudyPage';
import AgoraPage from './pages/AgoraPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/study" element={<StudyPage />} />
          <Route path="/agora" element={<AgoraPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;