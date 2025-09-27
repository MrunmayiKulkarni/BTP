import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './hooks/useWorkoutData';
import { AuthProvider, useAuth } from './hooks/useAuth';
import './styles/globals.css';
import HomePage from './components/pages/HomePage';
import ExercisesPage from './components/pages/ExercisesPage';
import WorkoutPage from './components/pages/WorkoutPage';
import HistoryPage from './components/pages/HistoryPage';
import LandingPage from './components/pages/LandingPage';
import LoginPage from './components/pages/LoginPage';
import SignupPage from './components/pages/SignupPage';
import ProtectedRoute from './components/common/ProtectedRoute';

const AppContent = () => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div 
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1975&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div className="relative z-10 animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <AppProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={
          user && isAuthenticated ? <Navigate to="/home" replace /> : <LandingPage />
        } />
        <Route path="/login" element={
          user && isAuthenticated ? <Navigate to="/home" replace /> : <LoginPage />
        } />
        <Route path="/signup" element={
          user && isAuthenticated ? <Navigate to="/home" replace /> : <SignupPage />
        } />

        {/* Protected routes */}
        <Route path="/home" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
        <Route path="/exercises" element={
          <ProtectedRoute>
            <ExercisesPage />
          </ProtectedRoute>
        } />
        <Route path="/workout" element={
          <ProtectedRoute>
            <WorkoutPage />
          </ProtectedRoute>
        } />
        <Route path="/history" element={
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        } />

        {/* Catch all other routes */}
        <Route path="*" element={
          user && isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/" replace />
        } />
      </Routes>
    </AppProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;