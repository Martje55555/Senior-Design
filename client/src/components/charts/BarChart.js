import React from 'react';
import { Bar, Line} from 'react-chartjs-2';
import { Chart as ChartJs } from 'chart.js/auto';


function BarChart({ chartData, options }) {
    return (
        <Line data={chartData}  options={options}/>
    )
}

export default BarChart;