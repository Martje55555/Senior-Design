import { render, screen, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom'
import Login from '../App.js';
import Home from '../components/home.js';
import {shallow} from 'enzyme';

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

describe('Login component', () => {
    afterEach(() => {
        cleanup();
    });

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

    test('it renders Home Screen', async () => {
        render(<Home />);
        
        const status = screen.queryByText(/Status: On/i);
        const gathering = screen.queryByText(/Gathering data: Yes/i);

        expect(status).toBeInTheDocument();
        expect(gathering).toBeInTheDocument();
    });

});