import React from 'react';
import { Plus } from 'lucide-react';
import { getDayExercises } from '../../data/trainingDays';
import BackButton from '../common/BackButton';

const ExercisesPage = ({ setCurrentPage, selectedDay, setSelectedExercise }) => {
  const exercises = getDayExercises(selectedDay);

  const handleExerciseClick = (exercise) => {
    setSelectedExercise(exercise);
    setCurrentPage('workout');
  };

  const handleBackClick = () => {
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <BackButton onClick={handleBackClick} />
          <h1 className="text-3xl font-bold text-white">{selectedDay}</h1>
        </div>

        <div className="grid gap-4">
          {exercises.map((exercise) => (
            <div
              key={exercise}
              onClick={() => handleExerciseClick(exercise)}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 cursor-pointer hover:bg-white/20 transition-all duration-300 border border-white/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">{exercise}</h3>
                  <p className="text-blue-200">Click to log workout</p>
                </div>
                <Plus className="text-yellow-400" size={20} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExercisesPage;