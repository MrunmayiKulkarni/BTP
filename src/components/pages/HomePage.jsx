import React from 'react';
import { Dumbbell, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import { trainingDays } from '../../data/trainingDays';
import Header from '../common/Header';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Header 
            title="Gym Tracker Pro" 
            subtitle="Track your fitness journey and visualize your progress" 
          />
          <div className="flex gap-4">
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition-colors duration-300"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-xl transition-colors duration-300"
            >
              Sign Up
            </Link>
          </div>
        </div>

        <div className="grid gap-4 mb-8">
          {Object.keys(trainingDays).map((day) => (
            <Link
              key={day}
              to={`/exercises?day=${day}`}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 cursor-pointer hover:bg-white/20 transition-all duration-300 border border-white/20 block"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{day}</h3>
                  <p className="text-blue-200">{trainingDays[day].length} exercises</p>
                </div>
                <div className="text-yellow-400">
                  <Dumbbell size={24} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex gap-4">
          <Link
            to="/history"
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2"
          >
            <History size={20} />
            View Progress
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;