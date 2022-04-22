import React, { useEffect, useState } from 'react';

import NavBar from "./navBar";
import LineChart from "./charts/LineChart.js";
import dhtData from "./charts/data.json";
import otherData from "./charts/other_sensor_data.json";

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

    let fc28_dates = [];

    let largestFcValues = [];
    let smallestFcValues = [];
    let largestFc = null;
    let smallestFc = null

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

                    smallestTemp = (temp < smallestTemp || smallestTemp == null) ?
                        temp :
                        smallestTemp;

                    largestTemp = (temp > largestTemp || largestTemp == null) ?
                        temp :
                        largestTemp;

                }
                largestTempValues.push(largestTemp);
                smallestTempValues.push(smallestTemp);
                smallestTemp = null;
                largestTemp = null;
            }
        });
    };

    const getHumidityData = () => {
        dhtData.map((d) => {
            var obj = d.humidity.sensor_1;
            for (let key in obj) {
                let val = obj[key];

                for (let key in val) {
                    let item = val[key];
                    let temp = item.value;

                    smallestHumdity = (temp < smallestHumdity || smallestHumdity == null) ?
                        temp :
                        smallestHumdity;

                    largestHumdity = (temp > largestHumdity || largestHumdity == null) ?
                        temp :
                        largestHumdity;

                };

                largestHumidityValues.push(largestHumdity);
                smallestHumdityValues.push(smallestHumdity);
                smallestHumdity = null;
                largestHumdity = null;
            };
        });
    };

    const getOtherData = () => {
        otherData.map((d) => {
            var obj = d.sensor_1;
            for (let key in obj) {
                let val = obj[key];
                fc28_dates.push(key);

                for (let key in val) {
                    let item = val[key];
                    let temp = item.value;

                    smallestFc = (temp < smallestFc || smallestFc == null) ?
                        temp :
                        smallestFc;

                    largestFc = (temp > largestFc || largestFc == null) ?
                        temp :
                        largestFc;
                };

                largestFcValues.push(largestFc);
                smallestFcValues.push(smallestFc);
                largestFc = null;
                smallestFc = null;
            };
        });
    };

    getTempData();
    getHumidityData();
    getOtherData();

    const [dht_data, setData] = useState({
        labels: dates.map((d) => d),
        datasets: [
            {
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

    const [fc28_data, setFc28_data] = useState({
        labels: fc28_dates.map((d) => d),
            datasets: [
                {
                    label: "Largest Humdity (%rh)",
                    data: largestFcValues.map((d) => d),
                    borderColor: "Blue"
                },
                {
                    label: "Lowest Humidity (%rh)",
                    data: smallestFcValues.map((d) => d),
                    borderColor: "Green"
                }
            ]
    });

    // useEffect(() => {
    //     getTempData();
    // }, []);


    return (
        <>
            <NavBar />
            <div className="lineChartContainer">
                <center><h1>Temperature and Air Humdity</h1></center>
                <br />
                <LineChart chartData={dht_data} options={options} />
                <br />
                <br />
                <br />
                <center><h1>Soil Humidity</h1></center>
                <br />
                <LineChart chartData={fc28_data} options={options} />
            </div>
        </>
    )
}

export default Historical;