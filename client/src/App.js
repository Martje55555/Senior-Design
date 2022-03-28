import React from 'react';
import { BrowserRouter as Router, HashRouter, Route, Redirect, Routes } from 'react-router-dom';

import Home from './components/home.js';
import Historical from './components/historical.js';
import Control from './components/control.js';
import NavBar from './components/navBar.js';

const App = () => {

    return (
        <div>
            <Router>
                <NavBar />
                <Routes>

                    <Route exact path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/historical" element={<Historical />} />
                    <Route path="/control" element={<Control />} />
                </Routes>
            </Router>
            
        </div>

    )
}

export default App;
