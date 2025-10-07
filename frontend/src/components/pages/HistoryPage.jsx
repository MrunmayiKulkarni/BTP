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
      <div 
        className="relative min-h-screen text-white bg-cover bg-center p-6"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1975&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <BackButton to="/home" />
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <TrendingUp className="text-yellow-400" />
                Progress Tracker
              </h1>
            </div>
            
            <div className="text-center py-20 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
              <BarChart3 className="mx-auto text-gray-400 mb-4" size={48} />
              <h2 className="text-white text-2xl font-semibold mb-2">No Workout Data Yet</h2>
              <p className="text-gray-300">Start logging your workouts to see your progress here!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative min-h-screen text-white bg-cover bg-center p-6"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1975&auto=format&fit=crop')" }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <BackButton to="/home" />
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <TrendingUp className="text-yellow-400" />
              Progress Tracker
            </h1>
          </div>
  
          <div className="flex gap-2 mb-6 p-1 bg-black/20 rounded-xl w-min">
            <button
              onClick={() => setViewMode('volume')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                viewMode === 'volume' 
                  ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' 
                  : 'bg-transparent text-white hover:bg-white/10'
              }`}
            >
              Total Volume
            </button>
            <button
              onClick={() => setViewMode('exercises')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                viewMode === 'exercises' 
                  ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' 
                  : 'bg-transparent text-white hover:bg-white/10'
              }`}
            >
              Exercise Progress
            </button>
          </div>
  
          {viewMode === 'volume' && (
            <div className="space-y-6">
              {volumeData.map(([date, workouts]) => (
                <div key={date} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <h3 className="text-lg font-bold text-white mb-3 border-b border-white/20 pb-2">{formatDate(date)}</h3>
                  <div className="space-y-4">
                    {workouts.map(workout => (
                      <div key={workout.id}>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold text-yellow-400">{workout.exercise_name}</h4>
                          <div className="flex gap-2 text-xs">
                            <span className="bg-yellow-500/20 text-yellow-300 font-bold px-2 py-1 rounded">
                              Vol: {workout.totalVolume?.toFixed(1)}kg
                            </span>
                          </div>
                        </div>
                        <div className="pl-4 text-sm space-y-1 text-blue-100 border-l-2 border-blue-500/50">
                          {workout.sets?.map((set) => (
                            <div key={set.set_number} className="grid grid-cols-3 gap-2 items-center">
                              <span className="text-gray-400">Set {set.set_number}</span>
                              <span className="col-span-2 font-mono">{set.weight} kg × {set.reps} reps</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {volumeData.length === 0 && (
                 <p className="text-gray-400 text-center py-8">No workouts logged yet.</p>
              )}
            </div>
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
                <div key={workout.id} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 transition-all duration-300 hover:bg-white/20 hover:border-white/30 hover:scale-[1.02]">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h4 className="font-bold text-white">{workout.exercise_name}</h4>
                      <p className="text-xs text-blue-200">{formatDate(workout.workout_date)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 text-xs">
                      <span className="bg-yellow-500/20 text-yellow-300 font-bold px-2 py-1 rounded w-full text-center">
                        Vol: {workout.totalVolume?.toFixed(1)}kg
                      </span>
                      <span className="bg-green-500/20 text-green-300 font-bold px-2 py-1 rounded w-full text-center">
                        Cals: {workout.calories}
                      </span>
                      <span className="bg-blue-500/20 text-blue-300 font-bold px-2 py-1 rounded w-full text-center">
                        Steps: {workout.steps}
                      </span>
                    </div>
                  </div>
                  <div className="pl-4 mt-3 text-sm space-y-1 text-blue-100 border-l-2 border-blue-500/50">
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
    </div>
  );
};

export default HistoryPage;