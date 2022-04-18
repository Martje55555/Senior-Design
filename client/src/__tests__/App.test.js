import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import Login from '../App.js';

describe('Login component', () => {
    test('it renders Login form', async () => {
        render(<Login />);
        const userName = screen.queryByText(/Username/i);
        const passWord = screen.queryByText(/Password/i);

        expect(userName).toBeInTheDocument();
        expect(passWord).toBeInTheDocument();

        const loginBtn = screen.queryByText(/Sign In/i);
        const signupBtn = screen.queryByText(/Sign Up/i);

        expect(loginBtn).toBeInTheDocument();
        expect(signupBtn).toBeInTheDocument();
    });
});