import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation, Outlet } from 'react-router-dom';

import Home from './components/home.js';
import Historical from './components/historical.js';
import Control from './components/control.js';
import fire from './fire.js';
import firebase from 'firebase';

import Login from './components/Login.js';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
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
        fire.
            auth().
            setPersistence(firebase.auth.Auth.Persistence.SESSION)
            .then(() => {
                return fire.auth().signInWithEmailAndPassword(email, password);
            })
            .catch((err) => {
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
            setIsLoggedIn(true);
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
                setIsLoggedIn(true);

            } else {
                setUser('');
                setIsLoggedIn(false);
            }
        });
    };

    useEffect(() => {
        authListener();
    }, []);

    return (
        <div>
            {user ? (
                <Router>
                    <Routes>
                        <Route exact path="/" element={isLoggedIn ? <Home handleLogout={handleLogout} user={user} />
                            :
                            <Login
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
                        <Route path="/home" element={isLoggedIn ? <Home handleLogout={handleLogout} user={user} /> : <Login />} />
                        <Route path="/historical" element={<Historical />} />
                        <Route path="/control" element={<Control />} />
                        <Route path="*" element={<Navigate to="/home" />} />
                    </Routes>
                </Router>
            ) : (
                <Router>
                    <Routes>
                        <Route path="/login" element={isLoggedIn ? <Home handleLogout={handleLogout} user={user} />
                            :
                            <Login
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

                        <Route path="*" element={<Navigate to="/login" />} />
                    </Routes>
                </Router>
            )}
        </div>
    );

};

export default App;
