import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary components from Chart.js
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const LineGraph = ({ data1, data2 }) => {
  // Create the chart data
  const chartData = {
    labels: data1.map((_, index) => index), // X-axis is the index of the data arrays
    datasets: [
      {
        label: 'Dataset 1',
        data: data1,
        borderColor: 'rgba(75,192,192,1)', // Line color for the first dataset
        backgroundColor: 'rgba(75,192,192,0.2)', // Background color for the first dataset
        fill: false, // Don't fill the area under the line
        tension: 0.1, // Smoothness of the line
      },
      {
        label: 'Dataset 2',
        data: data2,
        borderColor: 'rgba(153,102,255,1)', // Line color for the second dataset
        backgroundColor: 'rgba(153,102,255,0.2)', // Background color for the second dataset
        fill: false, // Don't fill the area under the line
        tension: 0.1, // Smoothness of the line
      },
    ],
  };

  return <Line data={chartData} />;
};

export default LineGraph;