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
                    <h1>Next Irrigation: 3-26-2022 9:30 AM</h1>

                </div>
                <div className="buttons">

                    <button data-testid="onButton" className="btn1">ON</button>

                    <button data-testid="offButton" className="btn2">OFF</button>
                </div>
            </div>
        </>
    )
}
//
export default Control;