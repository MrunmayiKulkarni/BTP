import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// A bright color palette for the chart lines
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00C49F", "#FFBB28", "#FF8042"];

const MultiLineChart = ({ data, title, dataKeys, yAxisLabel }) => {
  return (
    <div className="bg-white/10 p-4 rounded-xl border border-white/20">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
          <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
          <YAxis stroke="#9ca3af" fontSize={12} label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', fill: '#9ca3af', dy: 40 }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(31, 41, 55, 0.8)', 
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: '#ffffff' 
            }}
          />
          <Legend />
          {dataKeys.map((key, index) => (
            <Line 
              key={key}
              type="monotone" 
              dataKey={key} 
              stroke={COLORS[index % COLORS.length]} 
              strokeWidth={2}
              connectNulls // This will connect lines over dates with no data for that set
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const ExerciseProgressChart = ({ data }) => {
  if (!data || data.chartData.length < 2) {
    return <div className="text-center text-gray-400 p-4">Log this exercise at least twice to see progress charts.</div>;
  }

  return (
    <div className="space-y-6">
      <MultiLineChart data={data.chartData} title="Reps per Set" dataKeys={data.repKeys} yAxisLabel="Reps" />
      <MultiLineChart data={data.chartData} title="Weight per Set" dataKeys={data.weightKeys} yAxisLabel="Weight (kg)" />
    </div>
  );
};

export default ExerciseProgressChart;