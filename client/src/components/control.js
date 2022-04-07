import React from 'react';

import '../styles/control.css'
import NavBar from "./navBar";

const Control = () => {

    return (
        <>
            <NavBar />
            <div className="outer">
                <div className="container">
                    <h1>Last Irrigation: 3-26-2022 9:30 AM</h1>
                    <h1>First Irrigation: 3-26-2022 9:30 AM</h1>

                </div>
                <div className="buttons">

                    <button className="btn1">ON</button>

                    <button className="btn2">OFF</button>
                </div>
            </div>
        </>
    )
}

export default Control;