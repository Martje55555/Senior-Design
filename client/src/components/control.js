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

    const handleIrrigationAll = async () => {
        for (let i = 1; i <= 3; i++) {
            await axios.get(`${url}/trigger_esp_irrigation/${i}`, { crossDomain : true })
            .then( async (response) => {
                console.log(response);
            })
            .catch((err) => {
                console.log(`Error: ${err}`); 
            });
        };
    };

    const handleIrrigation1 = async () => {
        await axios.get(`${url}/trigger_esp_irrigation/1`, { crossDomain : true })
        .then( async (response) => {
            console.log(response);
        })
        .catch((err) => {
            console.log(`Error: ${err}`); 
        });
    };

    const handleIrrigation2 = async () => {
        await axios.get(`${url}/trigger_esp_irrigation/2`, { crossDomain : true })
        .then( async (response) => {
            console.log(response);
        })
        .catch((err) => {
            console.log(`Error: ${err}`); 
        });
    };

    const handleIrrigation3 = async () => {
        await axios.get(`${url}/trigger_esp_irrigation/3`, { crossDomain : true })
        .then( async (response) => {
            console.log(response);
        })
        .catch((err) => {
            console.log(`Error: ${err}`); 
        });
    };

    const handleIrrigation2 = async () => {
        await axios.get(`${url}/trigger_esp_irrigation/2`, { crossDomain : true })
        .then( async (response) => {
            console.log(response);
        })
        .catch((err) => {
            console.log(`Error: ${err}`); 
        });
    };

    const handleIrrigation3 = async () => {
        await axios.get(`${url}/trigger_esp_irrigation/3`, { crossDomain : true })
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
            setCurrWeather(response.data[1].toString() + '/' + data.toString());
        })
        .catch((err) => {
            console.log(`Error: ${err}`);
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
                    <button onClick={handleIrrigationAll} data-testid="onButton" className="massive green ui button">Manual Irrigation All</button>
                    <br/>
                    <button style={{marginTop: '20px'}} onClick={handleIrrigation1} data-testid="onButton" className="massive green ui button">Manual Irrigation 1</button>
                    <button style={{marginTop: '5px'}} onClick={handleIrrigation2} data-testid="onButton" className="massive green ui button">Manual Irrigation 2</button>
                    <button style={{marginTop: '5px'}} onClick={handleIrrigation3} data-testid="onButton" className="massive green ui button">Manual Irrigation 3</button>
                    <br/>
                    <button style={{marginTop:'20px'}} data-testid="offButton" className="massive red ui button">DELAY IRRIGATION</button>
                </div>
            </div>
        </>
    );
};

export default Control;