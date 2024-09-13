import React from 'react';

const GraphDisplay = ({ data }) => {
  return (
    <div className="mb-6">
      <h3 className="text-2xl mb-4">Graph</h3>
      <img src={`data:image/png;base64,${data}`} alt="Graph" className="w-full" />
    </div>
  );
};

export default GraphDisplay;
