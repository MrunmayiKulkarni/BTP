import React from 'react';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const WorkoutSummary = ({ workouts }) => {
  if (!workouts || workouts.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-400">No recent workouts</p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Workouts</h3>
      <div className="space-y-2">
        {workouts.map((workout, index) => (
          <div key={workout.id || index} className="flex justify-between items-center text-sm">
            <div className="text-white">
              <span className="font-medium">{workout.exercise}</span>
              <span className="text-blue-200 ml-2">({workout.day})</span>
            </div>
            <div className="text-blue-200">
              {workout.sets}×{workout.reps} @ {workout.weight}kg
            </div>
            <div className="text-yellow-400 text-xs">
              {formatDate(workout.date)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutSummary;