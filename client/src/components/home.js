import React from "react";

import '../styles/home.css'

const Home = () => {
    if(window.screen.width > 1280){
        return (
            <div class="outerD">
                <div className="containerInfo">
                    <h1 className="sample">Status: On/Off</h1>
                    <h1 className="sample">Gathering data: Yes/No</h1>
                    <h1 className="sample">Weather: 85°F</h1>
                    <h1 className="airHumidity">Air Humidity: 40%</h1>
                </div>
                <div className="containerGraph">
                    <div class="gridContainer">
                        <div className="box">1</div>
                        <div className="box">2</div>
                        <div className="box">3</div>
                    </div>
                    <div class="gridContainer">
                        <div className="box">4</div>
                        <div className="box">5</div>
                        <div className="box">6</div>
                    </div>
                    <div class="gridContainer">
                        <div className="box">7</div>
                        <div className="box">8</div>
                        <div className="box">9</div>
                    </div>
                </div>
            </div>
        )
        }
    else{
        return(
            <div class="outerM">
                <div className="containerGraphM">
                    <div class="gridContainer">
                        <div className="box">1</div>    
                        <div className="box">2</div>
                        <div className="box">3</div>
                    </div>
                    <div class="gridContainer">
                        <div className="box">4</div>
                        <div className="box">5</div>
                        <div className="box">6</div>
                    </div>
                    <div class="gridContainer">
                        <div className="box">7</div>
                        <div className="box">8</div>
                        <div className="box">9</div>
                    </div>
                </div>
                <div className="containerInfo">
                    <h1 className="sample">Status: On/Off</h1>
                    <h1 className="sample">Gathering data: Yes/No</h1>
                    <h1 className="sample">Weather: 85°F</h1>
                    <h1 className="sample">Air Humidity: 40%</h1>
                </div>
            </div>
        )
    }
}

export default Home;