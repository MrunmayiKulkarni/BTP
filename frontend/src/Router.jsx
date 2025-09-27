import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import ExercisesPage from './components/pages/ExercisesPage';
import WorkoutPage from './components/pages/WorkoutPage';
import HistoryPage from './components/pages/HistoryPage';

const AppRouter = () => {
  return (
    <Routes>
      {/* Default route - redirect to home */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      
      {/* Main app routes */}
      <Route path="/home" element={<HomePage />} />
      <Route path="/exercises" element={<ExercisesPage />} />
      <Route path="/workout" element={<WorkoutPage />} />
      <Route path="/history" element={<HistoryPage />} />
      
      {/* Catch all other routes and redirect to home */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

export default AppRouter;