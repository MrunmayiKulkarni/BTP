import React from 'react';
import { Dumbbell, History } from 'lucide-react';
import { trainingDays } from '../../data/trainingDays';
import Header from '../common/Header';

const HomePage = ({ setCurrentPage, setSelectedDay }) => {
  const handleDayClick = (day) => {
    setSelectedDay(day);
    setCurrentPage('exercises');
  };

  const handleHistoryClick = () => {
    setCurrentPage('history');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-6">
      <div className="max-w-4xl mx-auto">
        <Header 
          title="Gym Tracker Pro" 
          subtitle="Track your fitness journey and visualize your progress" 
        />

        <div className="grid gap-4 mb-8">
          {Object.keys(trainingDays).map((day) => (
            <div
              key={day}
              onClick={() => handleDayClick(day)}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 cursor-pointer hover:bg-white/20 transition-all duration-300 border border-white/20"
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
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleHistoryClick}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2"
          >
            <History size={20} />
            View Progress
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;