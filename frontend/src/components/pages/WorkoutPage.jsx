import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import BackButton from '../common/BackButton';
import { useWorkoutData } from '../../hooks/useWorkoutData';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const VALIDATION = {
  maxSets: 20,
  maxReps: 50,
  maxWeight: 500,
  minSets: 1,
  minReps: 1,
  minWeight: 0,
};

const WorkoutPage = () => {
  const [searchParams] = useSearchParams();
  const selectedDay = searchParams.get('day');
  const selectedExercise = searchParams.get('exercise');

  const [numSets, setNumSets] = useState('');
  const [setDetails, setSetDetails] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [workoutDate, setWorkoutDate] = useState(new Date().toISOString().split('T')[0]);

  const { addWorkout, getExerciseProgress } = useWorkoutData();
  const progressData = getExerciseProgress(selectedExercise);

  useEffect(() => {
    const sets = parseInt(numSets);
    if (sets > 0 && sets <= VALIDATION.maxSets) {
      setSetDetails(currentDetails => {
        const newDetails = Array.from({ length: sets }, (_, i) => {
          return currentDetails[i] || { reps: '', weight: '' };
        });
        return newDetails;
      });
    } else {
      setSetDetails([]);
    }
  }, [numSets]);

  const handleDetailChange = (index, field, value) => {
    const newDetails = [...setDetails];
    newDetails[index][field] = value;
    setSetDetails(newDetails);
  };

  const validateInput = () => {
    return setDetails.length > 0 && setDetails.every(detail => {
      const repsNum = parseInt(detail.reps);
      const weightNum = parseFloat(detail.weight);
      return (
        !isNaN(repsNum) && repsNum >= VALIDATION.minReps && repsNum <= VALIDATION.maxReps &&
        !isNaN(weightNum) && weightNum >= VALIDATION.minWeight && weightNum <= VALIDATION.maxWeight
      );
    });
  };

  const handleSubmit = async () => {
    if (!validateInput()) {
      alert('Please enter valid values for all sets');
      return;
    }

    setIsSubmitting(true);

    const workoutData = {
      exercise_name: selectedExercise,
      workout_date: workoutDate,
      sets: setDetails.map((detail, index) => ({
        set_number: index + 1,
        reps: parseInt(detail.reps),
        weight: parseFloat(detail.weight)
      })),
    };

    try {
      await addWorkout(workoutData);
      setNumSets('');
      alert('Workout logged successfully!');
    } catch (error) {
      alert('Failed to log workout. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="relative min-h-screen text-white bg-cover bg-center p-6"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1975&auto=format&fit=crop')" }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div className="relative z-10 max-w-md mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <BackButton to={`/exercises?day=${selectedDay}`} />
          <div>
            <h1 className="text-2xl font-bold text-white">{selectedExercise}</h1>
            <p className="text-blue-200">{selectedDay}</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="space-y-6">
            <div>
              <label className="block text-white font-semibold mb-2">Date</label>
              <input
                type="date"
                value={workoutDate}
                onChange={(e) => setWorkoutDate(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-white font-semibold mb-2">Sets</label>
              <input
                type="number"
                value={numSets}
                onChange={(e) => setNumSets(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Number of sets"
                min={VALIDATION.minSets}
                max={VALIDATION.maxSets}
                disabled={isSubmitting}
              />
            </div>

            {setDetails.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-white/20 mt-6">
                {setDetails.map((detail, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <span className="text-white font-medium md:text-right">Set {index + 1}</span>
                    <input
                      type="number"
                      placeholder="Reps"
                      value={detail.reps}
                      onChange={(e) => handleDetailChange(index, 'reps', e.target.value)}
                      className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      min={VALIDATION.minReps}
                      max={VALIDATION.maxReps}
                      disabled={isSubmitting}
                    />
                    <input
                      type="number"
                      step="0.5"
                      placeholder="Weight (kg)"
                      value={detail.weight}
                      onChange={(e) => handleDetailChange(index, 'weight', e.target.value)}
                      className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      min={VALIDATION.minWeight}
                      max={VALIDATION.maxWeight}
                      disabled={isSubmitting}
                    />
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !validateInput()}
              className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-black font-bold py-3 px-6 rounded-lg transition-colors duration-300"
            >
              {isSubmitting ? 'Logging...' : 'Log Workout'}
            </button>
          </div>
        </div>

        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-white font-semibold mb-4">Previous Records</h3>
          {progressData && progressData.length > 0 ? (
            <div className="space-y-4">
              {progressData.slice(-3).reverse().map((record) => {
                const totalVolume = record.sets.reduce((acc, set) => acc + (set.reps * set.weight), 0);
                return (
                  <div key={record.id} className="text-sm text-blue-200 border-b border-white/10 pb-3 last:border-b-0">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-white">{formatDate(record.workout_date)}</span>                        
                      <div className="flex gap-2 text-xs">
                        <span className="bg-white/20 px-2 py-1 rounded">
                          Vol: {totalVolume.toFixed(1)}kg
                        </span>
                      </div>
                    </div>
                    <div className="pl-4 text-xs space-y-1 text-blue-100">
                      {record.sets.map((set, setIndex) => (
                        <div key={setIndex} className="grid grid-cols-3 gap-2">
                          <span className="text-gray-400">Set {set.set_number}</span>
                          <span className="col-span-2">{set.weight} kg × {set.reps} reps</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No previous records</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutPage;