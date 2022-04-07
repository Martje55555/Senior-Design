import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

const Login = (props) => {
    const Navigate = useNavigate();
    const home = () => {
        Navigate('/home', { replace: true });
    }

    const {
        user,
        email,
        setEmail,
        password,
        setPassword,
        handleLogin,
        handleSignup,
        hasAccount,
        setHasAccount,
        emailError,
        passwordError,
    } = props;

    useEffect(() => {
        console.log(user);
        console.log(email)
        if(user !== '') {
            home();
        }
    }, []);

    return (
        <section className='login'>
            <div className='loginContainer'>
                <label>Username</label>
                <input
                    type="text"
                    autoFocus
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <p className="errorMsg" ><b>{emailError}</b></p>

                <label>Password</label>
                <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <p className='errorMsg'><b>{passwordError}</b></p>

                <div className='btnContainer'>
                    {hasAccount ? (
                        <>
                            <button onClick={handleLogin}>Sign in</button>
                            <p>Don't have an account? <span onClick={() => setHasAccount(!hasAccount)}><b>Sign up</b></span></p>
                        </>
                    ) : (
                        <>
                            <button onClick={handleSignup}>Sign up</button>
                            <p>Have an account? <span onClick={() => setHasAccount(!hasAccount)}><b>Sign in</b></span></p>
                        </>
                    )}
                </div>

            </div>
        </section>
    )
};

export default Login;