import React, { useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import NavBar from "./navBar";

import '../styles/home.css'

const Home = ({ handleLogout }) => {

    if (window.screen.width > 1280) {
        return (
            <>
                <NavBar />
                <div className="outerD">
                    <div className="containerInfo">
                        <h1 className="sample">Status: On/Off</h1>
                        <h1 className="sample">Gathering data: Yes/No</h1>
                        <h1 className="sample">Weather: 85°F</h1>
                        <h1 className="airHumidity">Air Humidity: 40%</h1>
                    </div>
                    <div className="containerGraph">
                        <div className="gridContainer">
                            <div className="box">1</div>
                            <div className="box">2</div>
                            <div className="box">3</div>
                        </div>
                        <div className="gridContainer">
                            <div className="box">4</div>
                            <div className="box">5</div>
                            <div className="box">6</div>
                        </div>
                        <div className="gridContainer">
                            <div className="box">7</div>
                            <div className="box">8</div>
                            <div className="box">9</div>
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
                            <div className="box">1</div>
                            <div className="box">2</div>
                            <div className="box">3</div>
                        </div>
                        <div className="gridContainer">
                            <div className="box">4</div>
                            <div className="box">5</div>
                            <div className="box">6</div>
                        </div>
                        <div className="gridContainer">
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
                    <br style={{ marginTop: "50px" }} />
                    <center><button onClick={handleLogout}>LOGOUT</button></center>
                </div>
            </>
        )
    }
}

export default Home;