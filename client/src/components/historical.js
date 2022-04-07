import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import {Redirect} from 'react-router';

import NavBar from "./navBar";

const Historical = ({user}) => {
    // const Navigate = useNavigate();
    // const login = () => {
    //     <Redirect to="/login" />
    // }

    // useEffect(() => {
    //     login();
    //     // if(user === "") {
    //     //     login();
    //     // }
    // }, []);

    return (
        <>
            <NavBar />
            <h1>This is the Historical Page</h1>
        </>
    )
}

export default Historical;