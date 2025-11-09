import React, { useState, useEffect } from 'react';
import { Dumbbell, History, LogOut, Flame, User } from 'lucide-react'; // Removed unused 'Footprints'
import { Link, useNavigate } from 'react-router-dom';
import { trainingDays } from '../../data/trainingDays';
import Header from '../common/Header';
import { useAuth } from '../../hooks/useAuth';

const HomePage = () => {
  const { user, token, isAuthenticated, logout } = useAuth();
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileName = async () => {
      if (user && token) {
        try {
          const response = await fetch('http://localhost:3001/api/profile', {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (response.ok) {
            const data = await response.json();
            setUserName(data.name);
          }
        } catch (error) {
          console.error('Failed to fetch user name:', error);
        }
      }
    };
    fetchProfileName();
  }, [user, token]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div 
      className="relative min-h-screen text-white bg-cover bg-center p-6"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1975&auto=format&fit=crop')" }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Header
            title={userName ? `Welcome, ${userName}!` : "Gym Tracker Pro"}
            subtitle={userName ? "Ready to crush your goals today?" : "Track your fitness journey and visualize your progress"}
          />
          <div className="flex gap-4">
            {isAuthenticated && (
              <>
                <Link
                  to="/activity"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 text-sm"
                >
                  <Flame size={16} />
                  Activity
                </Link>
                <Link
                  to="/history"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 text-sm"
                >
                  <History size={16} />
                  Progress
                </Link>
                <Link
                  to="/profile"
                  className="bg-gray-600 hover:bg-gray-700 text-white font-semibold p-3 rounded-xl transition-colors duration-300 flex items-center justify-center"
                  title="Profile"
                >
                  <User size={18} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-xl transition-colors duration-300 flex items-center gap-2"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            )}
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

      </div>
    </div>
  );
};

export default HomePage;