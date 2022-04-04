import React from "react";


import '../styles/control.css'

const Control = () => {

    return(
        <div className="outerContainer">
            <div className="container">   
                <h1 className="airHumidity">Last Irrigation: Last Irrigation: 3-26-2022 9:30 AM</h1>
                <h1 className="airHumidity">First Irrigation: 3-27-2022 3:30 PM</h1>
            </div>
            <div className="containerPadding"></div>
            <div className="container1">
                <button>ON</button>
                
            <div className="container1">
                <button>OFF</button>
            </div>
            </div>
        </div>
    )
}

export default Control;