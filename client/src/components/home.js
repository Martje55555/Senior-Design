import React from "react";

import '../styles/home.css'

const Home = () => {

    return (
        <div className="outerContainer">
            <h1 className="sample">Status: On/Off</h1>
            <h2 className="sample">Gathering data: Yes/No</h2>
            <h3 className="airHumidity">Air Humidity: 40%</h3>
            <div className="container">
                <div className="innerContainer">
                    <div className="box"> 1</div>
                    <div className="box"> 2</div>
                    <div className="box"> 3</div>
                </div>
                <div className="innerContainer">
                    <div className="box"> 4</div>
                    <div className="box"> 5</div>
                    <div className="box"> 6</div>
                </div>
                <div lassName="innerContainer">
                    <div className="box"> 7</div>
                    <div className="box"> 8</div>
                    <div className="box"> 9</div>
                </div>
            </div>
            
            
        </div>
        

    )
}

export default Home;