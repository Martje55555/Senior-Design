import React from "react";


import '../styles/control.css'

const Control = () => {

    return(
        /*<div className="outerContainer">
            <div className="container">   
                <h1 className="airHumidity">Last Irrigation: Last Irrigation: 3-26-2022 9:30 AM</h1>
                <h1 className="airHumidity">First Irrigation: 3-27-2022 3:30 PM</h1>
            </div>
            <br/>
            <div className="container1">
            <br/>
                <button>ON</button>
                <button>OFF</button>
            </div>
        </div>
        */
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
        
    )
}

export default Control;