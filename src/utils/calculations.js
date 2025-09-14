export const calculateTotalVolume = (sets, reps, weight) => {
  return parseInt(sets) * parseInt(reps) * parseFloat(weight);
};

export const getProgressData = (workoutHistory, exercise) => {
  const exerciseHistory = workoutHistory
    .filter(entry => entry.exercise === exercise)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-10); // Last 10 workouts

  return exerciseHistory.map(entry => ({
    date: entry.date,
    weight: entry.weight,
    volume: entry.totalVolume,
    reps: entry.reps,
    sets: entry.sets
  }));
};

export const getTotalVolumeByDay = (workoutHistory) => {
  const volumeByDay = {};
  
  workoutHistory.forEach(entry => {
    if (!volumeByDay[entry.day]) {
      volumeByDay[entry.day] = 0;
    }
    volumeByDay[entry.day] += entry.totalVolume;
  });

  return Object.entries(volumeByDay).map(([day, volume]) => ({
    day: day.replace(' Day', ''),
    volume
  }));
};

export const getPersonalRecord = (workoutHistory, exercise) => {
  const exerciseWorkouts = workoutHistory.filter(entry => entry.exercise === exercise);
  if (exerciseWorkouts.length === 0) return null;
  
  return Math.max(...exerciseWorkouts.map(workout => workout.weight));
};

export const calculateOneRepMax = (weight, reps) => {
  // Using Brzycki formula: 1RM = weight / (1.0278 - 0.0278 × reps)
  if (reps === 1) return weight;
  return weight / (1.0278 - 0.0278 * reps);
};

export const getVolumeProgression = (workoutHistory, exercise) => {
  const exerciseHistory = workoutHistory
    .filter(entry => entry.exercise === exercise)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  
  return exerciseHistory.map(entry => ({
    date: entry.date,
    volume: entry.totalVolume
  }));
};