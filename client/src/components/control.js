import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';

import '../styles/control.css'
import NavBar from "./navBar";

const Control = () => {

    const [next_irrigation, setNextIrrigation] = useState("TBD");
    const [last_irrigation, setLastIrrigation] = useState("TBD");
    const [curr_weather, setCurrWeather] = useState("TBD");

    const url = 'http://localhost:3001';

    const handleIrrigation = async () => {
        await axios.get(`${url}/trigger_esp_irrigation`, { crossDomain : true })
        .then( async (response) => {
            console.log(response);
        })
        .catch((err) => {
            console.log(`Error: ${err}`); 
        });
    };

    const handleWeather = async () => {
        let lat = 26.30519;
        let lon = -98.171924;
        axios.get(`${url}/weather_desc`, { params : {
            'lat' : lat,
            'lon' : lon,
            'appid' : process.env.REACT_APP_WEATHER_API_KEY
        }})
        .then((response) => {
            let data = response.data[0];
            setCurrWeather(data.toString());
        })
        .catch((err) => {
            console.log(`Error: ${err}`);

        });
    };

    const handle_model = async () => {
        await axios.get(`${url}/call_model`, { crossDomain: true })
        .then( async (response) => {
            console.log(response);
            setNextIrrigation(response.data['next_irrigation']);
            setLastIrrigation(response.data['last_irrigation']);
        })
        .catch((err) => {
            console.log(`Error : ${err}`);
        });
    };

    useEffect(() => {
        handle_model();
        handleWeather();

    }, []);

    return (
        <>
            <NavBar />
            <div className="outer">
                <div className="container">
                    <h1>Last Irrigation: {last_irrigation} </h1>
                    <h1>Next Irrigation: {next_irrigation} </h1>
                    <h1>Current Weather: {curr_weather}</h1>

                </div>
                <div className="buttons">
                    <button onClick={handleIrrigation} data-testid="onButton" className="btn1">Manual Irrigation</button>
                    <button data-testid="offButton" className="btn2">Delay Irrigation</button>
                </div>
            </div>
        </>
    );
};

export default Control;