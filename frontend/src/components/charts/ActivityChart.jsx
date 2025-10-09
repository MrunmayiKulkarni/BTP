import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ActivityChart = ({ data, dataKey, strokeColor, name }) => {
  // Filter out days where the dataKey is null or zero
  const chartData = data.filter(item => item[dataKey]).reverse(); // Reverse to show oldest to newest

  if (chartData.length === 0) {
    return <div className="text-center text-gray-400 p-4">Not enough data to display {name} chart.</div>;
  }

  return (
    <div className="bg-white/10 p-4 rounded-xl border border-white/20">
      <h3 className="text-lg font-semibold text-white mb-4">{name} Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
          <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
          <YAxis stroke="#9ca3af" fontSize={12} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(31, 41, 55, 0.8)', 
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: '#ffffff' 
            }}
          />
          <Legend />
          <Line type="monotone" dataKey={dataKey} stroke={strokeColor} strokeWidth={2} name={name} dot={{ r: 4 }} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityChart;