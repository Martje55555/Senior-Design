import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/navBar.css'

const NavBar = () => {
    const Navigate = useNavigate();
    const [homeActive, setHomeActive] = useState(false);
    const [historicalActive, setHistoricalActive] = useState(false);
    const [controlActive, setControlActive] = useState(false);

    const home = () => {
        Navigate('/home', { replace: true });
        setHomeActive(!homeActive);
        setHistoricalActive(false);
        setControlActive(false);
    }

    const historical = () => {
        Navigate('/historical', { replace: true });
        setHomeActive(false);
        setHistoricalActive(!historicalActive);
        setControlActive(false);
    }

    const control = () => {
        Navigate('/control', { replace: true });
        setHomeActive(false);
        setHistoricalActive(false);
        setControlActive(!controlActive);
    }

    return (
        <div className="ui fluid three item menu ar">
            <a onClick={() => home()}
                className={homeActive ? "item active" : "item"}>
                Home
            </a>

            <a onClick={() => historical()}
                className={historicalActive ? "item active" : "item"}>
                Historical
            </a>

            <a onClick={() => control()}
                className={controlActive ? "item active" : "item"}>
                Control
            </a>

        </div>
    )
}

export default NavBar;