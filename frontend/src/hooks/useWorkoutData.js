import React, { createContext, useContext, useState } from 'react';
import { calculateTotalVolume, getProgressData, getTotalVolumeByDay } from '../utils/calculations';

const WorkoutContext = createContext();

export const AppProvider = ({ children }) => {
  const [workoutHistory, setWorkoutHistory] = useState([]);

  const addWorkout = (exercise, sets, reps, weight, day) => {
    const workoutEntry = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      day,
      exercise,
      sets: parseInt(sets),
      reps: parseInt(reps),
      weight: parseFloat(weight),
      totalVolume: calculateTotalVolume(sets, reps, weight)
    };

    setWorkoutHistory(prev => [...prev, workoutEntry]);
    return workoutEntry;
  };

  const getExerciseProgress = (exercise) => {
    return getProgressData(workoutHistory, exercise);
  };

  const getVolumeData = () => {
    return getTotalVolumeByDay(workoutHistory);
  };

  const getRecentWorkouts = (limit = 5) => {
    return workoutHistory
      .slice(-limit)
      .reverse();
  };

  const value = {
    workoutHistory,
    addWorkout,
    getExerciseProgress,
    getVolumeData,
    getRecentWorkouts
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkoutData = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkoutData must be used within AppProvider');
  }
  return context;
};