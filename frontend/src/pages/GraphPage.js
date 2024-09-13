import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import GraphDisplay from '../components/GraphDisplay';

const GraphPage = () => {
  const [graphData, setGraphData] = useState(null);

  useEffect(() => {
    const fetchGraph = async () => {
      const res = await api.get('/graph');
      setGraphData(res.data);
    };
    fetchGraph();
  }, []);

  return (
    <div>
      <h2 className="text-2xl mb-4">Graph</h2>
      {graphData ? <GraphDisplay data={graphData} /> : <p>Loading...</p>}
    </div>
  );
};

export default GraphPage;
