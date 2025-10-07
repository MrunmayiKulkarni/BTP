import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth'; // Import useAuth to get the token

const WorkoutContext = createContext();

export const AppProvider = ({ children }) => {
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const { token } = useAuth(); // Get the auth token

  // Fetch workout history from the server when the component mounts or token changes
  useEffect(() => {
    const fetchHistory = async () => {
      if (token) {
        try {
          const response = await fetch('http://localhost:3001/api/workouts', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            // Add totalVolume to each workout for easier use in components
            const historyWithVolume = data.map(workout => ({
              ...workout,
              totalVolume: workout.sets.reduce((acc, set) => acc + (set.reps * set.weight), 0)
            })).sort((a, b) => new Date(b.workout_date) - new Date(a.workout_date));
            setWorkoutHistory(historyWithVolume);
          }
        } catch (error) {
          console.error('Failed to fetch workout history:', error);
        }
      }
    };

    fetchHistory();
  }, [token]);

  // Add a new workout by sending it to the server
  const addWorkout = useCallback(async (workoutData) => {
    if (token) {
      try {
        const response = await fetch('http://localhost:3001/api/workouts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(workoutData),
        });

        if (response.ok) {
          // Refetch history to include the new workout
          const newHistoryResponse = await fetch('http://localhost:3001/api/workouts', {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          const newHistory = await newHistoryResponse.json();
          setWorkoutHistory(newHistory);
        }
      } catch (error) {
        console.error('Failed to add workout:', error);
      }
    }
  }, [token]);

  // These functions now operate on the state managed from the server
  const getExerciseProgress = (exercise) => {
    // This logic would also ideally be moved to the backend for efficiency
    return workoutHistory.filter(w => w.exercise_name === exercise);
  };

  const getVolumeData = () => {
    const workoutsByDate = workoutHistory.reduce((acc, workout) => {
      const date = workout.workout_date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(workout);
      return acc;
    }, {});
    return Object.entries(workoutsByDate);
  };

  const getRecentWorkouts = (limit = 5) => {
    return workoutHistory.slice(0, limit);
  };

  const value = {
    workoutHistory,
    addWorkout,
    getExerciseProgress,
    getVolumeData,
    getRecentWorkouts,
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