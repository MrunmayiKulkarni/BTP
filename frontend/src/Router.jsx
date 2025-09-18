import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import ExercisesPage from './components/pages/ExercisesPage';
import WorkoutPage from './components/pages/WorkoutPage';
import HistoryPage from './components/pages/HistoryPage';
import LoginPage from './components/pages/LoginPage';
import SignupPage from './components/pages/SignupPage';

const AppRouter = () => {
  return (
    <BrowserRouter>
      {/* NavBar has been removed from here */}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/exercises" element={<ExercisesPage />} />
        <Route path="/workout" element={<WorkoutPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;