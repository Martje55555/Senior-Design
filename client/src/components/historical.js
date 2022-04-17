import React, { useEffect, useState } from 'react';

import NavBar from "./navBar";
import BarChart from "./charts/BarChart.js";
import dhtData from "./charts/data.json";

const Historical = () => {
    let dates = [];
    let largestValues = [];
    let smallestValues = [];
    let smallest = null;
    let largest = null;

    console.log(smallest);

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

                    smallest = (temp < smallest || smallest == undefined) ? temp : smallest;
                    largest = (temp > largest || largest == undefined) ? temp : largest;
                    
                }
                largestValues.push(largest);
                smallestValues.push(smallest);
                smallest = null;
                largest = null;
            }
        });

        largestValues.forEach(element => {
            console.log(element);
        });
    };

    // const getHumidityData = () => {
    //     dhtData.map((d, i) => {
    //         var obj = d.humidity.sensor_1;
    //         for (let key in obj) {
    //             let val = obj[key];
    //             dates.push(key);

    //             let largest = 0;
    //             for (let key in val) {
    //                 let item = val[key];
    //                 if (item.value > largest) {
    //                     largest = item.value;
    //                 }
    //             }
    //             values.push(largest);
    //         }
    //     });

    //     dhtData.map((d, i) => {
    //         var obj = d.humidity.sensor_1;
    //         for (let key in obj) {
    //             let val = obj[key];

    //             for (let key in val) {
    //                 let item = val[key]
    //                 values.push(item.value);
    //             }
    //         }
    //     });

    //     values.forEach(element => {
    //         console.log(element);
    //     });
    // };

    getTempData();

    const [data, setData] = useState({
        labels: dates.map((d) => d),
        datasets: [{
            label: "Highest Temperature",
            data: largestValues.map((d) => d),
            borderColor: 'Blue'
        },
        {
            label: "Lowest Temperature",
            data: smallestValues.map((d) => d),
            borderColor: 'Red'
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
            <h1>This is the Historical Page</h1>
            <BarChart chartData={data} options={options} />
        </>
    )
}

export default Historical;