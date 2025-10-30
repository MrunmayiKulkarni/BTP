import React, { useState, useEffect } from 'react';
import BackButton from '../common/BackButton';
import { useAuth } from '../../hooks/useAuth';

const ProfilePage = () => {
  const { user } = useAuth();
  const storageKey = user ? `userProfile_${user.id}` : null;

  const [profile, setProfile] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    gender: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (storageKey) {
      const savedProfile = localStorage.getItem(storageKey);
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    }
  }, [storageKey]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prevProfile => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (storageKey) {
        localStorage.setItem(storageKey, JSON.stringify(profile));
      }
      // Mock API call delay for user feedback
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Profile saved successfully!');
    } catch (error) {
      alert('Failed to save profile.');
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
          <BackButton to="/home" />
          <h1 className="text-2xl font-bold text-white">Your Profile</h1>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white font-semibold mb-2">Name</label>
              <input type="text" name="name" value={profile.name} onChange={handleChange} className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400" placeholder="Your Name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-semibold mb-2">Age</label>
                <input type="number" name="age" value={profile.age} onChange={handleChange} className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400" placeholder="Years" />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">Gender</label>
                <select name="gender" value={profile.gender} onChange={handleChange} className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400">
                  <option value="" disabled>Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-semibold mb-2">Weight (kg)</label>
                <input type="number" step="0.1" name="weight" value={profile.weight} onChange={handleChange} className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400" placeholder="kg" />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">Height (cm)</label>
                <input type="number" name="height" value={profile.height} onChange={handleChange} className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400" placeholder="cm" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-black font-bold py-3 px-6 rounded-lg transition-colors duration-300"
            >
              {isSubmitting ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;