import React, { useState } from 'react';
import HomePage from './components/pages/HomePage';
import ExercisesPage from './components/pages/ExercisesPage';
import WorkoutPage from './components/pages/WorkoutPage';
import HistoryPage from './components/pages/HistoryPage';

const Router = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);

  const navigationProps = {
    setCurrentPage,
    selectedDay,
    setSelectedDay,
    selectedExercise,
    setSelectedExercise
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'exercises':
        return <ExercisesPage {...navigationProps} />;
      case 'workout':
        return <WorkoutPage {...navigationProps} />;
      case 'history':
        return <HistoryPage {...navigationProps} />;
      default:
        return <HomePage {...navigationProps} />;
    }
  };

  return renderPage();
};

export default Router;