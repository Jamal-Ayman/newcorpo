import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const Statistics = ({ stats }) => {
  const data = [
    { name: 'Mean', value: stats.mean.id },
    { name: 'Median', value: stats.median.id },
    { name: 'Mode', value: stats.mode.id },
  ];

  return (
    <div className="mb-6">
      <h3 className="text-2xl mb-4">Statistics</h3>
      <BarChart width={500} height={300} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default Statistics;
