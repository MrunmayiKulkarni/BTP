import React from 'react';
import { Plus } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { getDayExercises } from '../../data/trainingDays';
import BackButton from '../common/BackButton';

const ExercisesPage = () => {
  const [searchParams] = useSearchParams();
  const selectedDay = searchParams.get('day');
  const exercises = getDayExercises(selectedDay);

  return (
    <div 
      className="relative min-h-screen text-white bg-cover bg-center p-6"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1975&auto=format&fit=crop')" }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <BackButton to="/home" />
            <h1 className="text-3xl font-bold text-white">{selectedDay}</h1>
          </div>
  
          <div className="grid gap-4">
            {exercises.map((exercise) => (
              <Link
                key={exercise}
                to={`/workout?day=${selectedDay}&exercise=${exercise}`}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 cursor-pointer hover:bg-white/20 transition-all duration-300 border border-white/20 block"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{exercise}</h3>
                    <p className="text-blue-200">Click to log workout</p>
                  </div>
                  <Plus className="text-yellow-400" size={20} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExercisesPage;