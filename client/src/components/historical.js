import React, { useEffect, useState } from 'react';

import NavBar from "./navBar";
import LineChart from "./charts/LineChart.js";
import dhtData from "./charts/data.json";

import '../styles/historical.css';

const Historical = () => {
    let dates = [];

    let largestTempValues = [];
    let smallestTempValues = [];
    let smallestTemp = null;
    let largestTemp = null;

    let largestHumidityValues = [];
    let smallestHumdityValues = [];
    let smallestHumdity;
    let largestHumdity;

    const getTempData = () => {
        dhtData.map((d) => {
            var obj = d.temperature.sensor_1;
            for (let key in obj) {
                let val = obj[key];
                dates.push(key);
                //console.log(key);
                for (let key in val) {
                    let item = val[key];
                    let temp = item.value;

                    smallestTemp = (temp < smallestTemp || smallestTemp == undefined) ?
                        temp :
                        smallestTemp;

                    largestTemp = (temp > largestTemp || largestTemp == undefined) ?
                        temp :
                        largestTemp;

                }
                largestTempValues.push(largestTemp);
                smallestTempValues.push(smallestTemp);
                smallestTemp = null;
                largestTemp = null;
            }
        });

        // largestTempValues.forEach(element => {
        //     console.log(element);
        // });
    };

    const getHumidityData = () => {
        dhtData.map((d) => {
            var obj = d.humidity.sensor_1;
            for (let key in obj) {
                let val = obj[key];
                //dates.push(key);

                for (let key in val) {
                    let item = val[key];
                    let temp = item.value;

                    smallestHumdity = (temp < smallestHumdity || smallestHumdity == undefined) ?
                        temp :
                        smallestHumdity;

                    largestHumdity = (temp > largestHumdity || largestHumdity == undefined) ?
                        temp :
                        largestHumdity;

                };

                largestHumidityValues.push(largestHumdity);
                smallestHumdityValues.push(smallestHumdity);
                smallestHumdity = null;
                largestHumdity = null;
            }
        });

        // values.forEach(element => {
        //     console.log(element);
        // });
    };

    getTempData();
    getHumidityData();

    const [dht_data, setData] = useState({
        labels: dates.map((d) => d),
        datasets: [{
            label: "Highest Temperature (F°)",
            data: largestTempValues.map((d) => d),
            borderColor: 'Blue'
        },
        {
            label: "Lowest Temperature (F°)",
            data: smallestTempValues.map((d) => d),
            borderColor: 'Red'
        },
        {
            label: "Highest Humidity (%rh)",
            data: largestHumidityValues.map((d) => d),
            borderColor: 'Purple'
        },
        {
            label: "Lowest Humidity (%rh)",
            data: smallestHumdityValues.map((d) => d),
            borderColor: 'Yellow'
        }]
    });

    const [options, setOptions] = useState({
        scales: {
            y: {
                min: 0
            }
        }
    });

    // useEffect(() => {
    //     getTempData();
    // }, []);


    return (
        <>
            <NavBar />
            <div className="lineChartContainer">
                <center><h1>Temperature and Air Humdity</h1></center>
                <br/>
                <LineChart chartData={dht_data} options={options} />
            </div>
        </>
    )
}

export default Historical;