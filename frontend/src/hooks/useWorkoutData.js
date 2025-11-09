import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

export const useWorkoutData = () => {
  const { token } = useAuth();
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [activityHistory, setActivityHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const [workoutsRes, activitiesRes] = await Promise.all([
        fetch('http://localhost:3001/api/workouts', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:3001/api/activities', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);
      
      const workouts = await workoutsRes.json();
      const activities = await activitiesRes.json();

      setWorkoutHistory(Array.isArray(workouts) ? workouts : []);
      setActivityHistory(Array.isArray(activities) ? activities : []);

    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Function to add a new workout and then refresh all data
  const addWorkout = async (workoutData) => {
    if (!token) return;
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
        fetchData(); // Refresh all data after a successful post
      }
    } catch (error) {
      console.error('Failed to add workout:', error);
    }
  };

  const getCombinedHistory = () => {
    const combined = {};
    workoutHistory.forEach(workout => {
        const date = workout.workout_date.split('T')[0];
        if (!combined[date]) {
            combined[date] = { date, workouts: [], calories: null, steps: null, energy: null };
        }
        const totalVolume = workout.sets.reduce((sum, set) => sum + set.reps * set.weight, 0);
        combined[date].workouts.push({ ...workout, totalVolume });
    });
    activityHistory.forEach(activity => {
        const date = activity.activity_date.split('T')[0];
        if (!combined[date]) {
            combined[date] = { date, workouts: [], calories: null, steps: null, energy: null };
        }
        combined[date].calories = activity.calories;
        combined[date].steps = activity.steps;
        combined[date].energy = activity.energy;
    });
    return Object.values(combined).sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const getUniqueExercises = () => {
    return [...new Set(workoutHistory.map(w => w.exercise_name))].sort();
  };

  const getExerciseHistoryForChart = (exerciseName) => {
    const exerciseWorkouts = workoutHistory
      .filter(w => w.exercise_name === exerciseName)
      .sort((a, b) => new Date(a.workout_date) - new Date(b.workout_date));

    let maxSets = 0;
    exerciseWorkouts.forEach(w => {
      if (w.sets.length > maxSets) {
        maxSets = w.sets.length;
      }
    });

    const repKeys = Array.from({ length: maxSets }, (_, i) => `Set ${i + 1} Reps`);
    const weightKeys = Array.from({ length: maxSets }, (_, i) => `Set ${i + 1} Weight`);

    const chartData = exerciseWorkouts.map(workout => {
      const dataPoint = {
        date: workout.workout_date.split('T')[0],
      };
      workout.sets.forEach(set => {
        dataPoint[`Set ${set.set_number} Reps`] = set.reps;
        dataPoint[`Set ${set.set_number} Weight`] = set.weight;
      });
      return dataPoint;
    });

    return { chartData, repKeys, weightKeys };
  };
  
  // --- THIS FUNCTION IS NOW ADDED BACK ---
  const getExerciseProgress = (exerciseName) => {
    return workoutHistory.filter(w => w.exercise_name === exerciseName);
  };

  return { 
    isLoading, 
    addWorkout, // <-- Make sure addWorkout is exported for WorkoutPage
    getCombinedHistory,
    getUniqueExercises,
    getExerciseHistoryForChart,
    getExerciseProgress // <-- Add the missing function to the export list
  };
};