import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import Statistics from '../components/Statistics';

const StatisticsPage = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      const res = await api.get('/tabular_data/1/statistics');
      setStats(res.data);
    };
    fetchStatistics();
  }, []);

  return (
    <div>
      <h2 className="text-2xl mb-4">Statistics</h2>
      {stats ? <Statistics stats={stats} /> : <p>Loading...</p>}
    </div>
  );
};

export default StatisticsPage;
