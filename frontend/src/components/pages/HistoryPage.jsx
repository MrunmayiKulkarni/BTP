import React, { useState } from 'react';
import { TrendingUp, BarChart3 } from 'lucide-react';
import BackButton from '../common/BackButton';
import VolumeChart from '../charts/VolumeChart';
import ProgressChart from '../charts/ProgressChart';
import { useWorkoutData } from '../../hooks/useWorkoutData';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const HistoryPage = () => {
  const [viewMode, setViewMode] = useState('volume');
  
  const { 
    workoutHistory, 
    getVolumeData, 
    getExerciseProgress, 
    getRecentWorkouts 
  } = useWorkoutData();
  
  const uniqueExercises = [...new Set(workoutHistory.map(entry => entry.exercise))];
  const volumeData = getVolumeData();
  const recentWorkouts = getRecentWorkouts();

  if (workoutHistory.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <BackButton to="/" />
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <TrendingUp className="text-yellow-400" />
              Progress Tracker
            </h1>
          </div>
          
          <div className="text-center py-12">
            <BarChart3 className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-300 text-lg">No workout data yet</p>
            <p className="text-gray-400">Start logging your workouts to see progress!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <BackButton to="/" />
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <TrendingUp className="text-yellow-400" />
            Progress Tracker
          </h1>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setViewMode('volume')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              viewMode === 'volume' 
                ? 'bg-yellow-500 text-black' 
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Total Volume
          </button>
          <button
            onClick={() => setViewMode('exercises')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              viewMode === 'exercises' 
                ? 'bg-yellow-500 text-black' 
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Exercise Progress
          </button>
        </div>

        {viewMode === 'volume' && (
          <VolumeChart data={volumeData} />
        )}

        {viewMode === 'exercises' && (
          <div className="space-y-6">
            {uniqueExercises.slice(0, 3).map((exercise) => {
              const progressData = getExerciseProgress(exercise);
              return (
                <ProgressChart 
                  key={exercise}
                  data={progressData}
                  exercise={exercise}
                />
              );
            })}
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">Recent Workouts</h2>
          <div className="space-y-4">
            {recentWorkouts.map((workout) => (
              <div key={workout.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h4 className="font-bold text-white">{workout.exercise}</h4>
                    <p className="text-xs text-blue-200">{formatDate(workout.date)} - {workout.day}</p>
                  </div>
                  <span className="text-xs bg-yellow-500 text-black font-bold px-2 py-1 rounded">
                    Vol: {workout.totalVolume?.toFixed(1)}kg
                  </span>
                </div>
                <div className="pl-4 text-sm space-y-1 text-blue-100 border-l-2 border-blue-500/50">
                  {/* Check for the 'sets' array from the backend */}
                  {workout.sets && Array.isArray(workout.sets) && workout.sets.length > 0 ? (
                    workout.sets.map((set) => (
                      <div key={set.set_number} className="grid grid-cols-3 gap-2 items-center">
                        <span className="text-gray-400">Set {set.set_number}</span>
                        <span className="col-span-2 font-mono">{set.weight} kg × {set.reps} reps</span>
                      </div>
                    ))
                  ) : (
                    <p className="font-mono">Set details not available.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;