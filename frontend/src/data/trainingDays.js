export const trainingDays = {
  'Chest Day': [
    'Bench Press', 
    'Incline Dumbbell Press', 
    'Chest Flyes', 
    'Push-ups', 
    'Dips'
  ],
  'Back Day': [
    'Deadlifts', 
    'Pull-ups', 
    'Bent Over Rows', 
    'Lat Pulldowns', 
    'Cable Rows'
  ],
  'Leg Day': [
    'Squats', 
    'Leg Press', 
    'Lunges', 
    'Leg Curls', 
    'Calf Raises'
  ],
  'Shoulder Day': [
    'Overhead Press', 
    'Lateral Raises', 
    'Front Raises', 
    'Rear Delt Flyes', 
    'Shrugs'
  ],
  'Arm Day': [
    'Bicep Curls', 
    'Tricep Dips', 
    'Hammer Curls', 
    'Tricep Extensions', 
    'Preacher Curls'
  ]
};

export const getDayExercises = (day) => {
  return trainingDays[day] || [];
};

export const getAllDays = () => {
  return Object.keys(trainingDays);
};