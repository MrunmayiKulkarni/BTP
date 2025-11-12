import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { getDayExercises } from '../../data/trainingDays';
import BackButton from '../common/BackButton';
import { useAuth } from '../../hooks/useAuth'; // <-- 1. Import useAuth

const ExercisesPage = () => {
  const [searchParams] = useSearchParams();
  const selectedDay = searchParams.get('day');
  const exercises = getDayExercises(selectedDay);
  const [accuracy, setAccuracy] = useState({});
  const [selectedFile, setSelectedFile] = useState({});
  const { token } = useAuth(); // <-- 2. Get the token from the hook

  const handleFileChange = (e, exercise) => {
    setSelectedFile(prev => ({ ...prev, [exercise]: e.target.files[0] }));
  };

  const handleUpload = async (exercise) => {
    const fileToUpload = selectedFile[exercise];
    if (!fileToUpload) {
      console.log('No file selected');
      return;
    }

    console.log('Uploading file:', fileToUpload);
    console.log('Exercise:', exercise);

    const formData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('exercise', exercise);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          // <-- 3. Add the Authorization header
          'Authorization': `Bearer ${token}`,
          // Note: Do NOT set 'Content-Type' here.
          // The browser sets it automatically to 'multipart/form-data'
          // with the correct boundary when you send FormData.
        },
        body: formData,
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data);
        setAccuracy(prev => ({ ...prev, [exercise]: data.accuracy }));
      } else {
        console.error('File upload failed');
        const errorData = await response.json();
        console.error('Error details:', errorData);
        setAccuracy(prev => ({ ...prev, [exercise]: 'Upload Failed' }));
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setAccuracy(prev => ({ ...prev, [exercise]: 'Error' }));
    }
  };

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
            {selectedDay ? `${selectedDay} Day` : 'Exercises'}
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
                      Click to log workout
                    </Link>
                  </div>
                  <Link
                    to={`/workout?day=${selectedDay}&exercise=${exercise}`}
                    className="p-2 rounded-full hover:bg-white/20"
                  >
                    <Plus className="text-yellow-400" size={20} />
                  </Link>
                </div>

                {/* File Upload Section */}
                <div className="mt-4">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => handleFileChange(e, exercise)}
                    className="text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-400 file:text-black hover:file:bg-yellow-500 cursor-pointer"
                  />
                  <button
                    onClick={() => handleUpload(exercise)}
                    disabled={!selectedFile[exercise]}
                    className="ml-4 px-4 py-2 bg-yellow-400 text-black rounded-full hover:bg-yellow-500 text-sm font-semibold disabled:bg-gray-500 disabled:cursor-not-allowed"
                  >
                    Submit
                  </button>
                  {accuracy[exercise] && (
                    <p 
                      className={`mt-2 font-semibold ${
                        typeof accuracy[exercise] === 'string' 
                          ? 'text-red-400' 
                          : 'text-green-400'
                      }`}
                    >
                      {typeof accuracy[exercise] === 'string' 
                        ? accuracy[exercise] 
                        : `Accuracy: ${accuracy[exercise]}%`}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExercisesPage;