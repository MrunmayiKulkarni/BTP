import React, { useState, useEffect } from 'react';
import BackButton from '../common/BackButton';
import { useAuth } from '../../hooks/useAuth';
import { User, Cake, Scale, Ruler, VenetianMask, Edit, X } from 'lucide-react';

const ProfilePage = () => {
  const { token } = useAuth();

  const [profile, setProfile] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    gender: '',
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3001/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          // Ensure no null values are set in state, which can cause warnings
          const sanitizedData = Object.keys(data).reduce((acc, key) => {
            acc[key] = data[key] === null ? '' : data[key];
            return acc;
          }, {});
          setProfile(sanitizedData);
          setIsEditing(!sanitizedData.name); // If no name, start in editing mode
        } else {
          console.error('Failed to fetch profile');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

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

    if (!token) {
      alert('You must be logged in to save your profile.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }
      alert((await response.json()).message);
      setIsEditing(false); // Switch back to display mode after saving
    } catch (error) {
      alert('Failed to save profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <p>Loading Profile...</p>
      </div>
    );
  }

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

        {isEditing ? (
          // --- EDITING VIEW (FORM) ---
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white font-semibold mb-2">Name</label>
                <input type="text" name="name" value={profile.name || ''} onChange={handleChange} className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400" placeholder="Your Name" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-semibold mb-2">Age</label>
                  <input type="number" name="age" value={profile.age || ''} onChange={handleChange} className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400" placeholder="Years" />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">Gender</label>
                  <select name="gender" value={profile.gender || ''} onChange={handleChange} className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400">
                    <option value="" disabled className="text-gray-400 bg-gray-900">Select...</option>
                    <option value="Male" className="text-white bg-gray-800">Male</option>
                    <option value="Female" className="text-white bg-gray-800">Female</option>
                    <option value="Other" className="text-white bg-gray-800">Other</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-semibold mb-2">Weight (kg)</label>
                  <input type="number" step="0.1" name="weight" value={profile.weight || ''} onChange={handleChange} className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400" placeholder="kg" />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">Height (cm)</label>
                  <input type="number" name="height" value={profile.height || ''} onChange={handleChange} className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400" placeholder="cm" />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-black font-bold py-3 px-6 rounded-lg transition-colors duration-300"
                >
                  {isSubmitting ? 'Saving...' : 'Save Profile'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="w-full bg-gray-500/50 hover:bg-gray-500/80 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          // --- DISPLAY VIEW ---
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <User size={28} className="text-yellow-400" />
                  {profile.name}
                </h2>
                <p className="text-blue-200">{profile.email}</p>
              </div>
              <button onClick={() => setIsEditing(true)} className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors">
                <Edit size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 text-lg">
              <div className="flex items-center gap-3">
                <Cake size={24} className="text-yellow-400" />
                <div>
                  <span className="text-sm text-blue-200">Age</span>
                  <p className="font-semibold">{profile.age || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <VenetianMask size={24} className="text-yellow-400" />
                <div>
                  <span className="text-sm text-blue-200">Gender</span>
                  <p className="font-semibold">{profile.gender || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Scale size={24} className="text-yellow-400" />
                <div>
                  <span className="text-sm text-blue-200">Weight</span>
                  <p className="font-semibold">{profile.weight ? `${profile.weight} kg` : 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Ruler size={24} className="text-yellow-400" />
                <div>
                  <span className="text-sm text-blue-200">Height</span>
                  <p className="font-semibold">{profile.height ? `${profile.height} cm` : 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;