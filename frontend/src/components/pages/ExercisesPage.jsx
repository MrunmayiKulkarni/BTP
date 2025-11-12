import React from 'react'; // Removed useState
import { Plus } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { getDayExercises } from '../../data/trainingDays';
import BackButton from '../common/BackButton';
// Removed useAuth, no longer needed here

const ExercisesPage = () => {
  const [searchParams] = useSearchParams();
  const selectedDay = searchParams.get('day');
  const exercises = getDayExercises(selectedDay);
  
  // Removed all state and handlers for file upload

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1975&auto-format&fit=crop')" }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="relative z-10 text-white min-h-screen p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <BackButton />
          <h1 className="text-3xl font-bold mb-2 text-yellow-400 capitalize">
            {selectedDay ? `${selectedDay}` : 'Exercises'}
          </h1>
          <p className="text-blue-200 mb-6">Select an exercise to log your workout or check your form.</p>

          <div className="space-y-4">
            {exercises.map((exercise) => (
              <div key={exercise} className="bg-white/10 p-4 rounded-lg shadow-lg">
                {/* Exercise Info & Log Link */}
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold capitalize text-white">{exercise.replace(/_/g, ' ')}</h2>
                    <Link
                      to={`/workout?day=${selectedDay}&exercise=${exercise}`}
                      className="text-blue-200 hover:underline text-sm"
                    >
                      Click to log workout & check form
                    </Link>
                  </div>
                  <Link
                    to={`/workout?day=${selectedDay}&exercise=${exercise}`}
                    className="p-2 rounded-full hover:bg-white/20"
                  >
                    <Plus className="text-yellow-400" size={20} />
                  </Link>
                </div>

                {/* File Upload Section has been REMOVED */}
                
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExercisesPage;