import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJs } from 'chart.js/auto';


function LineChart({ chartData, options }) {
    return (
        <Line data={chartData} options={options} />

    )
}

export default LineChart;