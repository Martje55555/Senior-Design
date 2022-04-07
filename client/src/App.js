import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, HashRouter, Navigate, Route, Routes } from 'react-router-dom';


import Home from './components/home.js';
import Historical from './components/historical.js';
import Control from './components/control.js';
import NavBar from './components/navBar.js';
import fire from './fire.js';

import Login from './components/Login.js';

const App = () => {

    const home = () => {
        Navigate('/home', { replace: true });
    }

    const [user, setUser] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [hasAccount, setHasAccount] = useState(false);

    const clearInputs = () => {
        setEmail('');
        setPassword('');
    };

    const clearErrors = () => {
        setEmailError('');
        setPasswordError('');
    };

    const handleLogin = () => {
        clearErrors();
        fire
            .auth()
            .signInWithEmailAndPassword(email, password)
            .catch(err => {
                switch (err.code) {
                    case "auth/invalid-email":
                    case "auth/user-disabled":
                    case "auth/user-not-found":
                        setEmailError(err.message);
                        break;
                    case "auth/wrong-password":
                        setPasswordError(err.message);
                        break;
                }
            });

        if (user) {
            Navigate('/home', { replace: true });
        }
    };

    const handleSignup = () => {
        clearErrors();
        fire
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .catch(err => {
                switch (err.code) {
                    case "auth/email-already-in-use":
                    case "auth/invalid-email":
                        setEmailError(err.message);
                        break;
                    case "auth/weak-password":
                        setPasswordError(err.message);
                        break;
                }
            });
    };

    const handleLogout = () => {
        fire.auth().signOut();
    };

    const authListener = () => {
        fire.auth().onAuthStateChanged(user => {
            if (user) {
                clearInputs();
                setUser(user);
                home();
            } else {
                setUser('');
            }
        });
    };

    useEffect(() => {
        authListener();
    }, []);

    if (user) {
        return (
            <Router>
                <Routes>
                    <Route path="/home" element={<Home handleLogout={handleLogout} user={user} />} />
                    <Route path="/historical" element={<Historical />} />
                    <Route path="/control" element={<Control />} />
                </Routes>
            </Router>
        )
    } else {
        return (
            <Router>
                <Routes>
                    <Route exact path="/" element={<Login
                        user={user}
                        email={email}
                        setEmail={setEmail}
                        password={password}
                        setPassword={setPassword}
                        handleLogin={handleLogin}
                        handleSignup={handleSignup}
                        hasAccount={hasAccount}
                        setHasAccount={setHasAccount}
                        emailError={emailError}
                        passwordError={passwordError} />}
                    />
                </Routes>
            </Router>
        )
    }
};

export default App;


{/* <Route path="/home" element={<Home />} />
<Route path="/historical" element={<Historical />} />
<Route path="/control" element={<Control />} /> */}

{/* <Route path="/home" render={() => user ? <Home handleLogout={handleLogout}/> : <Navigate to="/login" />}/>
<Route path="/historical" element={<Historical user={user}/>} />
<Route path="/control" element={<Control user={user}/>} /> */}





// THIS ONE WORKS KIND OF ISH

// <Router>
// {user ? (

//     <Routes>
//         <Route path="/home" element={<Home handleLogout={handleLogout} user={user} />} />
//         <Route path="/historical" element={<Historical />} />
//         <Route path="/control" element={<Control />} />
//     </Routes>

// ) : (
//     <Routes>
//         <Route exact path="/" element={<Login
//             user={user}
//             email={email}
//             setEmail={setEmail}
//             password={password}
//             setPassword={setPassword}
//             handleLogin={handleLogin}
//             handleSignup={handleSignup}
//             hasAccount={hasAccount}
//             setHasAccount={setHasAccount}
//             emailError={emailError}
//             passwordError={passwordError} />}
//         />
//         <Route path="/login" element={<Login
//             user={user}
//             email={email}
//             setEmail={setEmail}
//             password={password}
//             setPassword={setPassword}
//             handleLogin={handleLogin}
//             handleSignup={handleSignup}
//             hasAccount={hasAccount}
//             setHasAccount={setHasAccount}
//             emailError={emailError}
//             passwordError={passwordError} />}
//         />
//     </Routes>
// )}
// </Router>