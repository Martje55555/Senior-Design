import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom'
import Login from '../App.js';
import Home from '../components/home.js';
import Historical from '../components/historical.js';
import { mount, configure } from 'enzyme';
import LineChart from '../components/charts/LineChart.js';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import NavBar from '../components/navBar.js';
import Control from '../components/control.js';

configure({ adapter: new Adapter() });

const mockedUsedNavigate = jest.fn();

// Mock UsedNavigate
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate,
}));

// Mock Line Chart
jest.mock('react-chartjs-2', () => ({
    Line: () => null,
}))

// TESTS TO SEE IF COMPONENTS RENDER
describe('Testing components', () => {
    afterEach(() => {
        cleanup();
    });

    test('it renders Login form', async () => {
        render(<Login />);

        const navbarWrapper = mount(<NavBar />,);

        const home = screen.queryByText(/Home/i);
        const historical = screen.queryByText(/Historical/i);
        const control = screen.queryByText(/Control/i);

        const checkHome = navbarWrapper.contains(home);
        const checkHistorical = navbarWrapper.contains(historical);
        const checkControl = navbarWrapper.contains(control);

        const userName = screen.queryByText(/Username/i);
        const passWord = screen.queryByText(/Password/i);
        const loginBtn = screen.queryByText(/Sign In/i);
        const signupBtn = screen.queryByText(/Sign Up/i);

        expect(checkHome).toBeFalsy();
        expect(home).not.toBeInTheDocument();

        expect(checkHistorical).toBeFalsy();
        expect(historical).not.toBeInTheDocument();

        expect(checkControl).toBeFalsy();
        expect(control).not.toBeInTheDocument();

        expect(userName).toBeInTheDocument();
        expect(passWord).toBeInTheDocument();
        expect(loginBtn).toBeInTheDocument();
        expect(signupBtn).toBeInTheDocument();
    });

    test('it renders Home Screen', async () => {
        render(<Home />);

        const navbarWrapper = mount(<NavBar />,);
        const status = screen.queryByText(/Status: UNKNOWN/i);
        const gathering = screen.queryByText(/Gathering data: Yes/i);
        const weather = screen.queryByText(/Weather: weather°F/i);
        const air = screen.queryByText(/Air Humidity: 40%/i);
        const logoutBtn = screen.queryByText(/LOGOUT/i);

        expect(navbarWrapper).toMatchSnapshot();
        expect(logoutBtn).toBeInTheDocument();
        expect(air).toBeInTheDocument();
        expect(weather).toBeInTheDocument();
        expect(status).toBeInTheDocument();
        expect(gathering).toBeInTheDocument();
    });

    test('it renders Historical screen', async () => {
        render(<Historical />);

        const navbarWrapper = mount(<NavBar />,);
        const tempAndHumdityTitle = screen.queryByText(/Temperature and Air Humdity/i);
        const lineChartWrapper = mount(<LineChart />,);

        expect(navbarWrapper).toMatchSnapshot();
        expect(lineChartWrapper).toMatchSnapshot();
        expect(tempAndHumdityTitle).toBeInTheDocument();
    });

    test('it renders Control screen', async () => {
        render(<Control />);

        const navbarWrapper = mount(<NavBar />,);
        const last = screen.queryByText(/Last Irrigation: 3-26-2022 9:30 AM/i);
        const next = screen.queryByText(/Next Irrigation: 3-26-2022 9:30 AM/i);
        const onBtn = screen.queryByTestId("onButton");
        const offBtn = screen.queryByTestId("offButton");

        expect(navbarWrapper).toMatchSnapshot();
        expect(last).toBeInTheDocument();
        expect(next).toBeInTheDocument();
        expect(onBtn).toBeInTheDocument();
        expect(offBtn).toBeInTheDocument();
    });

    test('it renders the navigation bar', async () => {
        render(<NavBar />);

        const home = screen.queryByText(/Home/i);
        const historical = screen.queryByText(/Historical/i);
        const control = screen.queryByText(/Control/i);
        const random = screen.queryByText(/This shouldn't be here/i);

        expect(random).not.toBeInTheDocument();
        expect(home).toBeInTheDocument();
        expect(historical).toBeInTheDocument();
        expect(control).toBeInTheDocument();
    });

});
