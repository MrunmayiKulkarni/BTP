import React, { useState, useEffect } from 'react';
import { List, BarChart2, Activity, Flame, Footprints, BatteryCharging } from 'lucide-react';
import BackButton from '../common/BackButton';
import { useWorkoutData } from '../../hooks/useWorkoutData';
import ActivityChart from '../charts/ActivityChart';
import ExerciseProgressChart from '../charts/ExerciseProgressChart';

const formatDate = (dateString) => {
    if (!dateString) return 'Invalid Date';
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const ENERGY_LEVELS = {
    1: { label: 'Tired', color: 'bg-red-500' },
    2: { label: 'Okay', color: 'bg-yellow-500' },
    3: { label: 'Good', color: 'bg-blue-500' },
    4: { label: 'Energized', color: 'bg-green-500' },
};

const HistoryPage = () => {
    const [view, setView] = useState('list'); // 'list', 'daily', 'exercise'
    const [selectedExercise, setSelectedExercise] = useState('');
    
    const { getCombinedHistory, getUniqueExercises, getExerciseHistoryForChart, isLoading } = useWorkoutData();
    
    const combinedData = getCombinedHistory();
    const uniqueExercises = getUniqueExercises();

    // Set default selected exercise once data is loaded
    useEffect(() => {
        if (!selectedExercise && uniqueExercises.length > 0) {
            setSelectedExercise(uniqueExercises[0]);
        }
    }, [uniqueExercises, selectedExercise]);
    
    const exerciseChartData = selectedExercise ? getExerciseHistoryForChart(selectedExercise) : null;

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen text-white">Loading history...</div>;
    }

    return (
        <div 
            className="relative min-h-screen text-white bg-cover bg-center p-6"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1975&auto-format&fit=crop')" }}
        >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
            <div className="relative z-10 max-w-4xl mx-auto pb-10">
                <div className="flex items-center gap-4 mb-6">
                    <BackButton to="/home" />
                    <h1 className="text-3xl font-bold text-white">History & Progress</h1>
                </div>

                {/* View Mode Tabs */}
                <div className="flex gap-2 mb-6 p-1 bg-black/20 rounded-lg border border-white/20">
                    <button onClick={() => setView('list')} className={`flex-1 p-2 rounded-md text-sm font-semibold flex items-center justify-center gap-2 transition ${view === 'list' ? 'bg-yellow-500 text-black' : 'hover:bg-white/10'}`}><List size={16} /> List View</button>
                    <button onClick={() => setView('daily')} className={`flex-1 p-2 rounded-md text-sm font-semibold flex items-center justify-center gap-2 transition ${view === 'daily' ? 'bg-yellow-500 text-black' : 'hover:bg-white/10'}`}><Activity size={16} /> Daily Stats</button>
                    <button onClick={() => setView('exercise')} className={`flex-1 p-2 rounded-md text-sm font-semibold flex items-center justify-center gap-2 transition ${view === 'exercise' ? 'bg-yellow-500 text-black' : 'hover:bg-white/10'}`}><BarChart2 size={16} /> Exercise Progress</button>
                </div>

                {/* Conditional Content */}
                {view === 'list' && (
                    <ListView combinedData={combinedData} />
                )}

                {view === 'daily' && (
                    <div className="space-y-6">
                        <ActivityChart data={combinedData} dataKey="calories" name="Calories" strokeColor="#facc15" />
                        <ActivityChart data={combinedData} dataKey="steps" name="Steps" strokeColor="#4ade80" />
                        <ActivityChart data={combinedData} dataKey="energy" name="Energy Level" strokeColor="#38bdf8" />
                    </div>
                )}

                {view === 'exercise' && (
                    <div>
                        {uniqueExercises.length > 0 ? (
                            <>
                                <div className="relative mb-6">
                                    <select
                                        value={selectedExercise}
                                        onChange={(e) => setSelectedExercise(e.target.value)}
                                        className="appearance-none w-full p-3 pr-10 rounded-lg bg-black/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    >
                                        {uniqueExercises.map(ex => (
                                            <option key={ex} value={ex} className="bg-gray-800 text-white">{ex}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-300">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                    </div>
                                </div>
                                {exerciseChartData && <ExerciseProgressChart data={exerciseChartData} />}
                            </>
                        ) : (
                            <div className="text-center text-gray-400 p-4">Log a workout to see exercise progress.</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- THIS SUB-COMPONENT IS NOW CORRECTED ---
const ListView = ({ combinedData }) => {
    if (combinedData.length === 0) {
        return <div className="text-center text-gray-400 p-4">Log a workout or activity to see your history.</div>;
    }
    return (
        <div className="space-y-6">
            {combinedData.map((day) => (
                <div key={day.date} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex flex-wrap justify-between items-center mb-4 border-b border-white/10 pb-3 gap-2">
                        <h3 className="font-bold text-lg text-white">{formatDate(day.date)}</h3>
                        <div className="flex items-center gap-4">
                            {day.calories != null && (
                                <div className="flex items-center gap-1.5 text-sm text-yellow-300">
                                    <Flame size={16} /> {day.calories.toLocaleString()} kcal
                                </div>
                            )}
                            {day.steps != null && (
                                <div className="flex items-center gap-1.5 text-sm text-green-300">
                                    <Footprints size={16} /> {day.steps.toLocaleString()} steps
                                </div>
                            )}
                            {day.energy != null && ENERGY_LEVELS[day.energy] && (
                                <div className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full ${ENERGY_LEVELS[day.energy].color} text-black`}>
                                    <BatteryCharging size={14} />
                                    {ENERGY_LEVELS[day.energy].label}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="space-y-4">
                        {day.workouts.length > 0 ? (
                            day.workouts.map((workout) => (
                                <div key={workout.id} className="bg-black/20 p-3 rounded-lg">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-semibold text-white">{workout.exercise_name}</h4>
                                        <span className="bg-yellow-500/20 text-yellow-300 font-bold px-2 py-1 rounded text-xs">
                                            Vol: {workout.totalVolume?.toFixed(1)}kg
                                        </span>
                                    </div>
                                    <div className="pl-3 text-sm space-y-1 text-blue-100 border-l-2 border-blue-500/50">
                                        {workout.sets.map((set) => (
                                            <div key={set.id || set.set_number} className="grid grid-cols-3 gap-2 items-center">
                                                <span className="text-gray-400">Set {set.set_number}</span>
                                                <span className="col-span-2 font-mono">{set.weight} kg × {set.reps} reps</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-sm italic px-2">No workouts logged for this day.</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HistoryPage;