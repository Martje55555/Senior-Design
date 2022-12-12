import React, { useEffect, useState } from 'react';
import axios from 'axios';

import NavBar from "./navBar";

import '../styles/home.css'
import '../styles/button.scss'
const Home = ({ handleLogout }) => {

    const url = 'http://localhost:3001';

    const [sens1, setSens1] = useState('48%');
    const [sens2, setSens2] = useState('47%');
    const [sens3, setSens3] = useState('45%');
    const [sens4, setSens4] = useState('47%');
    const [sens5, setSens5] = useState('47%');
    const [sens6, setSens6] = useState('44%');
    const [sens7, setSens7] = useState('42%');
    const [sens8, setSens8] = useState('44%');
    const [sens9, setSens9] = useState('44%');
    const [weather, setWeather] = useState('78');
    const [status, setStatus] = useState('On')

    const getStatus = async () => {
        axios.get(`${url}/status`, {crossDomain: true})
        .then((response) => {
            setStatus(`${response.data}`)
        });
    }

    const getAllOtherValues = async () => {

        for (let i = 1; i <= 9; i++) {
            axios.get(`${url}/other_sensors/sensor_${i}/latest`, { crossDomain: true })
                .then((response) => {
                    console.log(response);
                    if (i === 1) {
                        let s = response.data.value
                        let g = ( (s-(-99)) / (99 - (-99)) ) * (100 - 0) + 0
                        setSens1(`${g.toFixed(2)}%`);
                    }
                    else if (i === 2) {
                        let s = response.data.value
                        let g = ( (s-(-99)) / (99 - (-99)) ) * (100 - 0) + 0
                        setSens2(`${g.toFixed(2)}%`);
                    }
                    else if (i === 3) {
                        let s = response.data.value
                        let g = ( (s-(-99)) / (99 - (-99)) ) * (100 - 0) + 0
                        setSens3(`${g.toFixed(2)}%`);
                    }
                    else if (i === 4) {
                        let s = response.data.value
                        let g = ( (s-(-99)) / (99 - (-99)) ) * (100 - 0) + 0
                        setSens4(`${g.toFixed(2)}%`);
                    }
                    else if (i === 5) {
                        let s = response.data.value
                        let g = ( (s-(-99)) / (99 - (-99)) ) * (100 - 0) + 0
                        setSens5(`${g.toFixed(2)}%`);
                    }
                    else if (i === 6) {
                        let s = response.data.value
                        let g = ( (s-(-99)) / (99 - (-99)) ) * (100 - 0) + 0
                        setSens6(`${g.toFixed(2)}%`);
                    }
                    else if (i === 7) {
                        let s = response.data.value
                        let g = ( (s-(-99)) / (99 - (-99)) ) * (100 - 0) + 0
                        setSens7(`${g.toFixed(2)}%`);
                    }
                    else if (i === 8) {
                        let s = response.data.value
                        let g = ( (s-(-99)) / (99 - (-99)) ) * (100 - 0) + 0
                        setSens8(`${g.toFixed(2)}%`);
                    }
                    else if (i == 9) {
                        let s = response.data.value
                        let g = ( (s-(-99)) / (99 - (-99)) ) * (100 - 0) + 0
                        setSens9(`${g.toFixed(2)}%`);
                    }
                })
                .catch((err) => {
                    console.log(`Error: ${err}`);
                });
        };
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

    const handleGather = async () => {
        await axios.get(`${url}/trigger_esp_data`, { crossDomain : true })
        .then( async (response) => {
            console.log(response);
            await getAllOtherValues();
        })
        .catch((err) => {
            console.log(`Error: ${err}`);
        });
    };

    // Leave commented when not using the data
    // to reduce the amount of calls, uncomment to see data
    // useEffect(() => {
    //     getAllOtherValues();
    //     getWeather();
    //     getStatus();
    // }, []);

    if (window.screen.width > 1280) {
        return (
            <>
                <NavBar />
                <div className="outerD">
                    <div className="containerInfo">
                        <h1 className="sample" data-testid="status">Status: {status}</h1>
                        <h1 className="sample">Gathering data: Yes</h1>
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
                        <center><button class="ui inverted button" onClick={handleGather}>Gather data</button></center>
                    </div>
                </div>
                <br style={{ marginTop: "50px" }} />
                <center>
                <div class="buttons">
  <button class="blob-btn" onClick={handleLogout}>
    Logout 
    <span class="blob-btn__inner">
      <span class="blob-btn__blobs">
        <span class="blob-btn__blob"></span>
        <span class="blob-btn__blob"></span>
        <span class="blob-btn__blob"></span>
        <span class="blob-btn__blob"></span>
      </span>
    </span>
  </button>
  <br/>


  <defs>
    <filter id="goo">
      <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10"></feGaussianBlur>
      <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 21 -7" result="goo"></feColorMatrix>
      <feBlend in2="goo" in="SourceGraphic" result="mix"></feBlend>
    </filter>
  </defs>

</div>
                </center>
            </>
        )
    }
    else {
        return (
            <>
                <NavBar />
                <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
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
                        <center><button class="ui inverted button">Gather data</button></center>
                        <br style={{ marginTop: "10px"}}></br>
                    </div>
                    <div className="containerInfo">
                        <h1 className="sample">Status: {status}</h1>
                        <h1 className="sample">Gathering data: Yes</h1>
                         <h1 className="sample">{`Weather: ${weather}°F`}</h1>
                        <h1 className="airHumidity">Air Humidity: 40%</h1>
                    </div>
                    <br style={{ marginTop: "50px" }} />
                    <button class="blob-btn" onClick={handleLogout}>
    Logout 
    <span class="blob-btn__inner">
      <span class="blob-btn__blobs">
        <span class="blob-btn__blob"></span>
        <span class="blob-btn__blob"></span>
        <span class="blob-btn__blob"></span>
        <span class="blob-btn__blob"></span>
      </span>
    </span>
  </button>
                    
                </div>
            </>
        )
    }
}

export default Home;