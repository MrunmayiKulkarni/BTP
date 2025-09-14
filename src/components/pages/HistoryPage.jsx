import React, { useState } from 'react';
import { TrendingUp, BarChart3 } from 'lucide-react';
import BackButton from '../common/BackButton';
import VolumeChart from '../charts/VolumeChart';
import ProgressChart from '../charts/ProgressChart';
import WorkoutSummary from '../charts/WorkoutSummary';
import { useWorkoutData } from '../../hooks/useWorkoutData';

const HistoryPage = ({ setCurrentPage }) => {
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

  const handleBackClick = () => {
    setCurrentPage('home');
  };

  if (workoutHistory.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <BackButton onClick={handleBackClick} />
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
          <BackButton onClick={handleBackClick} />
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

        <div className="mt-6">
          <WorkoutSummary workouts={recentWorkouts} />
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;