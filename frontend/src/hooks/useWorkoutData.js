import React, { createContext, useContext, useState } from 'react';
import { getTotalVolumeByDay } from '../utils/calculations';

const WorkoutContext = createContext();

export const AppProvider = ({ children }) => {
  const [workoutHistory, setWorkoutHistory] = useState([]);

  const addWorkout = (exercise, setDetails, day) => {
    const parsedDetails = setDetails.map(s => ({
      reps: parseInt(s.reps),
      weight: parseFloat(s.weight)
    }));

    const totalVolume = parsedDetails.reduce((sum, set) => sum + (set.reps * set.weight), 0);

    // Find the set with the highest weight for summary display compatibility
    const bestSet = parsedDetails.reduce(
        (best, current) => (current.weight > best.weight ? current : best),
        parsedDetails[0] || { reps: 0, weight: 0 }
    );

    const workoutEntry = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      day,
      exercise,
      sets: parsedDetails.length,
      reps: bestSet.reps, // For display compatibility
      weight: bestSet.weight, // For display compatibility
      details: parsedDetails, // The full data
      totalVolume
    };

    setWorkoutHistory(prev => [...prev, workoutEntry]);
    return workoutEntry;
  };

  const getExerciseProgress = (exercise) => {
    const exerciseHistory = workoutHistory
      .filter(entry => entry.exercise === exercise)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    return exerciseHistory.map(entry => ({
      id: entry.id,
      date: entry.date,
      weight: entry.weight, // best set weight
      volume: entry.totalVolume,
      reps: entry.reps, // best set reps
      sets: entry.sets,
      details: entry.details, // Pass through the detailed set info
    }));
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