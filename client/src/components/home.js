import React, { useEffect, useState } from 'react';
import axios from 'axios';

import NavBar from "./navBar";

import '../styles/home.css'

const Home = ({ handleLogout }) => {

    const url = 'http://localhost:3001';

    const [sens1, setSens1] = useState('');
    const [sens2, setSens2] = useState('');
    const [sens3, setSens3] = useState('');
    const [sens4, setSens4] = useState('');
    const [sens5, setSens5] = useState('');
    const [sens6, setSens6] = useState('');
    const [sens7, setSens7] = useState('');
    const [sens8, setSens8] = useState('');
    const [sens9, setSens9] = useState('blah');
    const [weather, setWeather] = useState('blah');

    const getAllOtherValues = async () => {

        for (let i = 1; i <= 8; i++) {
            axios.get(`${url}/other_sensors/sensor_${i}/latest`, { crossDomain: true })
                .then((response) => {
                    console.log(response);
                    if (i === 1) {
                        setSens1(`${response.data.value}%`);
                    }
                    else if (i === 2) {
                        setSens2(`${response.data.value}%`);
                    }
                    else if (i === 3) {
                        setSens3(`${response.data.value}%`);
                    }
                    else if (i === 4) {
                        setSens4(`${response.data.value}%`);
                    }
                    else if (i === 5) {
                        setSens5(`${response.data.value}%`);
                    }
                    else if (i === 6) {
                        setSens6(`${response.data.value}%`);
                    }
                    else if (i === 7) {
                        setSens7(`${response.data.value}%`);
                    }
                    else if (i === 8) {
                        setSens8(`${response.data.value}%`);
                    }
                })
                .catch((err) => {
                    console.log(`Error: ${err}`);
                });
        }
    };

    const getWeather = async () => {
        let lat = 26.30519;
        let lon = -98.171924;
        axios.get(`${url}/weather`, { params : {
            'lat' : lat,
            'lon' : lon,
            'appid' : process.env.REACT_APP_WEATHER_API_KEY
        }})
        .then((response) => {
            let data = response.data[0];
            //(K − 273.15) × 9/5 + 32 = -459.7°F
            data = (data - 273.15) * 9/5 + 32;
            data = data.toFixed(2);
            console.log(data);
            data.toString();
            setWeather(data);
        })
        .catch((err) => {
            console.log(`Error: ${err}`);
        });
    };

    // Leave commented when not using the data
    // to reduce the amount of calls, uncomment to see data
    useEffect(() => {
        //getAllOtherValues();
        getWeather();
    }, []);

    if (window.screen.width > 1280) {
        return (
            <>
                <NavBar />
                <div className="outerD">
                    <div className="containerInfo">
                        <h1 className="sample">Status: On/Off</h1>
                        <h1 className="sample">Gathering data: Yes/No</h1>
                        <h1 className="sample">{`Weather: ${weather}°F`}</h1>
                        <h1 className="airHumidity">Air Humidity: 40%</h1>
                    </div>
                    <div className="containerGraph">
                        <div className="gridContainer">
                            <div className="box">{sens1}</div>
                            <div className="box">{sens2}</div>
                            <div className="box">{sens3}</div>
                        </div>
                        <div className="gridContainer">
                            <div className="box">{sens4}</div>
                            <div className="box">{sens5}</div>
                            <div className="box">{sens6}</div>
                        </div>
                        <div className="gridContainer">
                            <div className="box">{sens7}</div>
                            <div className="box">{sens8}</div>
                            <div className="box">{sens9}</div>
                        </div>
                    </div>
                </div>
                <br style={{ marginTop: "50px" }} />
                <center><button onClick={handleLogout}>LOGOUT</button></center>
            </>
        )
    }
    else {
        return (
            <>
                <NavBar />
                <div className="outerM">
                    <div className="containerGraphM">
                        <div className="gridContainer">
                            <div className="box">{sens1}</div>
                            <div className="box">{sens2}</div>
                            <div className="box">{sens3}</div>
                        </div>
                        <div className="gridContainer">
                            <div className="box">{sens4}</div>
                            <div className="box">{sens5}</div>
                            <div className="box">{sens6}</div>
                        </div>
                        <div className="gridContainer">
                            <div className="box">{sens7}</div>
                            <div className="box">{sens8}</div>
                            <div className="box">{sens9}</div>
                        </div>
                    </div>
                    <div className="containerInfo">
                        <h1 className="sample">Status: On/Off</h1>
                        <h1 className="sample">Gathering data: Yes/No</h1>
                        <h1 className="sample">{`Weather: ${weather}°F`}</h1>
                        <h1 className="sample">Air Humidity: 40%</h1>
                    </div>
                    <br style={{ marginTop: "50px" }} />
                    <center><button onClick={handleLogout}>LOGOUT</button></center>
                </div>
            </>
        )
    }
}

export default Home;