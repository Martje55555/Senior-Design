import React from 'react';
import axios from 'axios';

import '../styles/control.css'
import NavBar from "./navBar";

const Control = () => {

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

    return (
        <>
            <NavBar />
            <div className="outer">
                <div className="container">
                    <h1>Last Irrigation: TBD </h1>
                    <h1>Next Irrigation: TBD </h1>

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