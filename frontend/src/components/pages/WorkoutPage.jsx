import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import BackButton from '../common/BackButton';
import { useAuth } from '../../hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  Tooltip, 
  ResponsiveContainer,
  XAxis // <-- 1. Import XAxis
} from 'recharts';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  // Use timeZone: 'UTC' to prevent date from shifting
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC'
  });
};

const VALIDATION = {
  maxSets: 20,
  maxReps: 50,
  maxWeight: 500,
  minSets: 1,
  minReps: 1,
  minWeight: 0,
};

// --- Custom Tooltip for the Form Chart ---
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const formStatus = data.originalValue === 1 ? 'Good' : 'Improper';
    const color = formStatus === 'Good' ? 'text-green-400' : 'text-red-400';
    
    return (
      <div className="bg-black/80 p-2 rounded border border-white/20">
        <p className="text-xs text-blue-200">{`Time: ${label}`}</p>
        <p className={`text-sm ${color}`}>{`Form: ${formStatus}`}</p>
      </div>
    );
  }
  return null;
};

const WorkoutPage = () => {
  const [searchParams] = useSearchParams();
  const selectedExercise = searchParams.get('exercise');

  // --- State for logging ---
  const [numSets, setNumSets] = useState(3);
  const [setDetails, setSetDetails] = useState(
    Array(3).fill({ reps: '', weight: '' })
  );
  const [workoutDate, setWorkoutDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logError, setLogError] = useState('');
  const [logSuccess, setLogSuccess] = useState('');

  // --- State for accuracy check ---
  const [file, setFile] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [accuracy, setAccuracy] = useState(null);
  const [timeSeries, setTimeSeries] = useState([]); // For the graph

  // --- State for history ---
  const [progressData, setProgressData] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const { token } = useAuth(); // Get auth token

  // --- Data Fetching Effect ---
  useEffect(() => {
    if (selectedExercise && token) {
      setIsLoadingHistory(true);
      // Fetch progress data
      fetch(`/api/progress/${selectedExercise}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        setProgressData(data);
        setIsLoadingHistory(false);
      })
      .catch(err => {
        console.error("Failed to fetch progress", err);
        setIsLoadingHistory(false);
      });
    }
  }, [selectedExercise, token]); // Re-fetch if exercise or token changes

  // --- Handlers for logging form ---
  const handleSetNumChange = (e) => {
    let newNumSets = parseInt(e.target.value, 10);
    if (isNaN(newNumSets)) {
      setNumSets('');
      setSetDetails([]);
      return;
    }

    if (newNumSets < VALIDATION.minSets) newNumSets = VALIDATION.minSets;
    if (newNumSets > VALIDATION.maxSets) newNumSets = VALIDATION.maxSets;
    
    setNumSets(newNumSets);
    const newSetDetails = Array(newNumSets).fill({ reps: '', weight: '' });
    
    // Preserve old data if possible
    for (let i = 0; i < Math.min(newNumSets, setDetails.length); i++) {
      newSetDetails[i] = setDetails[i];
    }
    setSetDetails(newSetDetails);
  };

  const handleSetDetailChange = (index, field, value) => {
    let numericValue = parseInt(value, 10);
    if (isNaN(numericValue)) numericValue = '';

    const maxVal = field === 'reps' ? VALIDATION.maxReps : VALIDATION.maxWeight;
    if (numericValue > maxVal) numericValue = maxVal;
    
    const newSetDetails = [...setDetails];
    newSetDetails[index] = { ...newSetDetails[index], [field]: numericValue };
    setSetDetails(newSetDetails);
  };

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    setLogError('');
    setLogSuccess('');
    
    const sets = setDetails
      .map(set => ({
        reps: parseInt(set.reps, 10),
        weight: parseFloat(set.weight)
      }))
      .filter(set => !isNaN(set.reps) && !isNaN(set.weight));

    if (sets.length === 0) {
      setLogError('Please fill in at least one set with valid reps and weight.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          exercise: selectedExercise,
          sets: sets,
          workout_date: workoutDate
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to log workout');
      }

      setLogSuccess('Workout logged successfully!');
      // Refresh history
      setProgressData([
        { 
          id: data.workoutId, 
          workout_date: workoutDate, 
          sets: sets.map((s, i) => ({ ...s, set_number: i + 1 })) 
        },
        ...progressData
      ]);
      // Clear form
      setNumSets(3);
      setSetDetails(Array(3).fill({ reps: '', weight: '' }));

    } catch (err) {
      setLogError(err.message);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setLogSuccess(''), 3000);
    }
  };

  // --- Handlers for file upload ---
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setAccuracy(null);
    setTimeSeries([]);
    setUploadError('');
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadError('Please select a file first.');
      return;
    }

    setIsCalculating(true);
    setUploadError('');
    setAccuracy(null);
    setTimeSeries([]);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('exercise', selectedExercise);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'File upload failed');
      }
      
      setAccuracy(data.accuracy);
      setTimeSeries(data.timeSeries || []); // Expect timeSeries array
      
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setIsCalculating(false);
    }
  };

  // --- Process data for the chart ---
  let chartData = timeSeries.map((value, index) => ({
    time: index,
    good: value === 1 ? 1 : 0,
    bad: value === 0 ? 1 : 0,
    originalValue: value // Keep original value for the tooltip
  }));

  // --- FIX: A chart with one point won't render ---
  // If there's exactly one data point, duplicate it to make the area visible.
  if (chartData.length === 1) {
    chartData.push({ ...chartData[0], time: chartData[0].time + 1 });
  }

  // --- Helper to determine accuracy color ---
  const getAccuracyColor = (acc) => {
    if (acc === null) return 'text-white'; // Default
    if (acc >= 80) return 'text-green-400';
    if (acc >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };
  const accuracyColor = getAccuracyColor(accuracy);


  // Helper to get Best Set
  const getBestSet = () => {
    if (!progressData || progressData.length === 0) {
      return { bestWeight: 0, bestReps: 0 };
    }
    let bestWeight = 0;
    let bestReps = 0;
    progressData.forEach(workout => {
      workout.sets.forEach(set => {
        if (set.weight > bestWeight) {
          bestWeight = set.weight;
          bestReps = set.reps;
        } else if (set.weight === bestWeight && set.reps > bestReps) {
          bestReps = set.reps;
        }
      });
    });
    return { bestWeight, bestReps };
  };

  const { bestWeight, bestReps } = getBestSet();

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1975&auto-format&fit-crop')" }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="relative z-10 text-white min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <BackButton />
          <h1 className="text-3xl font-bold mb-2 text-yellow-400 capitalize">
            {selectedExercise ? selectedExercise.replace(/_/g, ' ') : 'Workout'}
          </h1>
          <p className="text-blue-200 mb-6">Log your sets and reps, or upload a CSV to check your form.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* --- Column 1: Log Workout Form --- */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white/10 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-white">Log Workout</h2>
                
                {logSuccess && <p className="text-green-400 mb-4">{logSuccess}</p>}
                {logError && <p className="text-red-400 mb-4">{logError}</p>}
                
                <form onSubmit={handleLogSubmit} className="space-y-4">
                  {/* Date Input */}
                  <div>
                    <label htmlFor="workoutDate" className="block text-sm font-medium text-blue-200 mb-1">Date</label>
                    <input
                      type="date"
                      id="workoutDate"
                      value={workoutDate}
                      onChange={(e) => setWorkoutDate(e.target.value)}
                      className="w-full bg-white/10 text-white p-2 rounded border-white/20"
                      required
                    />
                  </div>
                  
                  {/* Number of Sets */}
                  <div>
                    <label htmlFor="numSets" className="block text-sm font-medium text-blue-200 mb-1">Number of Sets</label>
                    <input
                      type="number"
                      id="numSets"
                      value={numSets}
                      onChange={handleSetNumChange}
                      className="w-full bg-white/10 text-white p-2 rounded border-white/20"
                      min={VALIDATION.minSets}
                      max={VALIDATION.maxSets}
                      step="1"
                      required
                    />
                  </div>

                  {/* Dynamic Set Details */}
                  <div className="space-y-3">
                    {setDetails.map((set, index) => (
                      <div key={index} className="grid grid-cols-3 gap-3 items-center">
                        <span className="text-blue-200">Set {index + 1}</span>
                        
                        <input
                          type="number"
                          placeholder="Weight (kg)"
                          value={set.weight}
                          onChange={(e) => handleSetDetailChange(index, 'weight', e.target.value)}
                          className="w-full bg-white/10 text-white p-2 rounded border-white/20 placeholder:text-gray-400"
                          min={VALIDATION.minWeight}
                          max={VALIDATION.maxWeight}
                          step="0.25"
                        />
                        <input
                          type="number"
                          placeholder="Reps"
                          value={set.reps}
                          onChange={(e) => handleSetDetailChange(index, 'reps', e.target.value)}
                          className="w-full bg-white/10 text-white p-2 rounded border-white/20 placeholder:text-gray-400"
                          min={VALIDATION.minReps}
                          max={VALIDATION.maxReps}
                          step="1"
                        />
                      </div>
                    ))}
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-yellow-400 text-black font-bold p-3 rounded-lg hover:bg-yellow-500 disabled:bg-gray-500 flex items-center justify-center"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : 'Log Workout'}
                  </button>
                </form>
              </div>

              {/* --- Accuracy Check Card --- */}
              <div className="bg-white/10 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-white">Check Your Form</h2>
                
                <p className="text-blue-200 mb-4 text-sm">Upload your workout CSV to get an accuracy score and see your form over time.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-400 file:text-black hover:file:bg-yellow-500 cursor-pointer"
                  />
                  <button
                    onClick={handleUpload}
                    disabled={isCalculating || !file}
                    className="w-full bg-blue-500 text-white font-bold p-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-500 flex items-center justify-center"
                  >
                    {isCalculating ? <Loader2 className="animate-spin" /> : 'Calculate Accuracy'}
                  </button>
                </div>
                
                {uploadError && <p className="text-red-400 mt-4 text-sm">{uploadError}</p>}

                {/* Accuracy Result & Graph */}
                {(accuracy !== null || timeSeries.length > 0) && (
                  <div className="mt-6 border-t border-white/20 pt-6">
                    {/* Accuracy Score */}
                    {accuracy !== null && (
                      <div className="mb-6">
                        <p className="text-sm text-blue-200">Overall Form Score:</p>
                        <p className={`text-5xl font-bold ${accuracyColor}`}>{accuracy}%</p>
                      </div>
                    )}
                    
                    {/* Accuracy Graph */}
                    {timeSeries.length > 0 && (
                      <div>
                        <p className="text-sm text-blue-200 mb-2">Form Over Time</p>
                        <div className="h-40 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart 
                              data={chartData}
                              margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
                            >
                              <defs>
                                <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorRed" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              
                              {/* --- THIS IS THE FIX --- */}
                              {/* This invisible X-axis forces the chart to render */}
                              <XAxis dataKey="time" hide />
                              
                              <Tooltip content={<CustomTooltip />} />
                              <Area 
                                type="monotone" 
                                dataKey="good" 
                                stroke="#10B981" 
                                fill="url(#colorGreen)" 
                                stackId="1" 
                                fillOpacity={1}
                              />
                              <Area 
                                type="monotone" 
                                dataKey="bad" 
                                stroke="#EF4444" 
                                fill="url(#colorRed)" 
                                stackId="1" 
                                fillOpacity={1}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* --- Column 2: History & Stats --- */}
            <div className="bg-white/10 p-6 rounded-lg shadow-lg space-y-6">
              {/* Stats */}
              <div>
                <h3 className="text-xl font-semibold mb-3 text-white">Personal Best</h3>
                <div className="bg-black/20 p-4 rounded-lg">
                  <p className="text-sm text-blue-200">Heaviest Set</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {bestWeight} <span className="text-lg text-white">kg</span> x {bestReps} <span className="text-lg text-white">reps</span>
                  </p>
                </div>
              </div>

              {/* History */}
              <div>
                <h3 className="text-xl font-semibold mb-3 text-white">History</h3>
                {isLoadingHistory ? (
                  <div className="flex justify-center items-center h-20">
                    <Loader2 className="animate-spin text-blue-300" />
                  </div>
                ) : progressData.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {/* We map over progressData directly */}
                    {progressData.map((record) => {
                      const totalVolume = record.sets.reduce((acc, set) => acc + (set.reps * set.weight), 0);
                      return (
                        <div key={record.id} className="text-sm text-blue-200 border-b border-white/10 pb-3 last:border-b-0">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-white">{formatDate(record.workout_date)}</span>                        
                            <div className="flex gap-2 text-xs">
                              <span className="bg-white/20 px-2 py-1 rounded">
                                Vol: {totalVolume.toFixed(1)}kg
                              </span>
                            </div>
                          </div>
                          <div className="pl-4 text-xs space-y-1 text-blue-100">
                            {record.sets.map((set, setIndex) => (
                              <div key={setIndex} className="grid grid-cols-3 gap-2">
                                <span className="text-gray-400">Set {set.set_number}</span>
                                <span className="col-span-2">{set.weight} kg × {set.reps} reps</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No previous records for this exercise.</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutPage;