import React, { useState } from 'react';
import BackButton from '../common/BackButton';
import { useWorkoutData } from '../../hooks/useWorkoutData';

// Inline date helper function to avoid import error
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Inline validation constants
const VALIDATION = {
  maxSets: 20,
  maxReps: 50,
  maxWeight: 500,
  minSets: 1,
  minReps: 1,
  minWeight: 0
};

const WorkoutPage = ({ setCurrentPage, selectedDay, selectedExercise }) => {
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addWorkout, getExerciseProgress } = useWorkoutData();
  const progressData = getExerciseProgress(selectedExercise);

  const validateInput = () => {
    const setsNum = parseInt(sets);
    const repsNum = parseInt(reps);
    const weightNum = parseFloat(weight);

    return (
      setsNum >= VALIDATION.minSets && setsNum <= VALIDATION.maxSets &&
      repsNum >= VALIDATION.minReps && repsNum <= VALIDATION.maxReps &&
      weightNum >= VALIDATION.minWeight && weightNum <= VALIDATION.maxWeight
    );
  };

  const handleSubmit = async () => {
    if (!sets || !reps || !weight || !validateInput()) {
      alert('Please enter valid values for all fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await addWorkout(selectedExercise, sets, reps, weight, selectedDay);
      setSets('');
      setReps('');
      setWeight('');
      alert('Workout logged successfully!');
    } catch (error) {
      alert('Failed to log workout. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackClick = () => {
    setCurrentPage('exercises');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-6">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <BackButton onClick={handleBackClick} />
          <div>
            <h1 className="text-2xl font-bold text-white">{selectedExercise}</h1>
            <p className="text-blue-200">{selectedDay}</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="space-y-6">
            <div>
              <label className="block text-white font-semibold mb-2">Sets</label>
              <input
                type="number"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Number of sets"
                min={VALIDATION.minSets}
                max={VALIDATION.maxSets}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Reps</label>
              <input
                type="number"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Reps per set"
                min={VALIDATION.minReps}
                max={VALIDATION.maxReps}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Weight (kg)</label>
              <input
                type="number"
                step="0.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Weight used"
                min={VALIDATION.minWeight}
                max={VALIDATION.maxWeight}
                disabled={isSubmitting}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !validateInput()}
              className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-black font-bold py-3 px-6 rounded-lg transition-colors duration-300"
            >
              {isSubmitting ? 'Logging...' : 'Log Workout'}
            </button>
          </div>
        </div>

        {/* Previous Records */}
        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-white font-semibold mb-4">Previous Records</h3>
          {progressData && progressData.length > 0 ? (
            progressData.slice(-3).map((record, index) => (
              <div key={index} className="flex justify-between text-sm text-blue-200 mb-2">
                <span>{formatDate(record.date)}</span>
                <span>{record.weight}kg × {record.reps} reps</span>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No previous records</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutPage;