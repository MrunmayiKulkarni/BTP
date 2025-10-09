import React, { useState } from 'react';
import { Flame, Footprints } from 'lucide-react';
import BackButton from '../common/BackButton';
import { useAuth } from '../../hooks/useAuth'; // <-- IMPORT useAuth

const VALIDATION = {
  maxCalories: 10000,
  maxSteps: 100000
};

const ActivityPage = () => {
  const [calories, setCalories] = useState('');
  const [steps, setSteps] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useAuth(); // <-- GET the auth token

  const validateInput = () => {
    const caloriesNum = parseInt(calories);
    const stepsNum = parseInt(steps);
    const caloriesValid = !isNaN(caloriesNum) && caloriesNum > 0 && caloriesNum <= VALIDATION.maxCalories;
    const stepsValid = !isNaN(stepsNum) && stepsNum >= 0 && stepsNum <= VALIDATION.maxSteps; // Allow 0 steps
    return caloriesValid && stepsValid;
  };

  const handleSubmit = async () => {
    if (!validateInput()) {
      alert('Please enter valid values for calories and steps.');
      return;
    }

    setIsSubmitting(true);
    const activityData = {
      date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
      calories: parseInt(calories),
      steps: parseInt(steps)
    };

    try {
      // --- API CALL ---
      const response = await fetch('http://localhost:3001/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Attach the user's auth token
        },
        body: JSON.stringify(activityData),
      });

      if (!response.ok) {
        throw new Error('Server responded with an error');
      }

      alert('Daily activity logged successfully!');
      // Reset form
      setCalories('');
      setSteps('');

    } catch (error) {
      console.error('Failed to log activity:', error);
      alert('Failed to log activity. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="relative min-h-screen text-white bg-cover bg-center p-6"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1975&auto-format&fit=crop')" }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      <div className="relative z-10 max-w-lg mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <BackButton to="/home" />
          <h1 className="text-3xl font-bold text-white">Log Daily Activity</h1>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
          <p className="text-blue-200 mb-6 text-center">
            Enter your total calories consumed and steps taken for today.
          </p>
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-white font-semibold mb-2">
                <Flame className="text-yellow-400" /> Calories
              </label>
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Total calories consumed"
                min="0"
                max={VALIDATION.maxCalories}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-white font-semibold mb-2">
                <Footprints className="text-yellow-400" /> Steps
              </label>
              <input
                type="number"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Total steps taken"
                min="0"
                max={VALIDATION.maxSteps}
                disabled={isSubmitting}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !validateInput()}
              className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-black font-bold py-3 px-6 rounded-lg transition-colors duration-300"
            >
              {isSubmitting ? 'Logging...' : 'Log Activity'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;