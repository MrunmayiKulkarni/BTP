export const exerciseCategories = {
  'Bench Press': { category: 'Chest', difficulty: 'Intermediate', equipment: 'Barbell' },
  'Squats': { category: 'Legs', difficulty: 'Beginner', equipment: 'Barbell' },
  'Deadlifts': { category: 'Back', difficulty: 'Advanced', equipment: 'Barbell' },
  'Overhead Press': { category: 'Shoulders', difficulty: 'Intermediate', equipment: 'Barbell' },
  'Bicep Curls': { category: 'Arms', difficulty: 'Beginner', equipment: 'Dumbbell' },
  // Add more exercises as needed
};

export const getExerciseInfo = (exerciseName) => {
  return exerciseCategories[exerciseName] || { 
    category: 'General', 
    difficulty: 'Beginner', 
    equipment: 'Bodyweight' 
  };
};