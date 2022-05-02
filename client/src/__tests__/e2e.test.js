import puppeteer from "puppeteer";
import '@testing-library/jest-dom'
import { screen } from '@testing-library/dom'
import { render } from "enzyme";
import Home from "../components/home";

describe("Login.js Happy Paths", () => {
    let browser;
    let page;

    jest.setTimeout(5000);
    beforeAll(async () => {

        browser = await puppeteer.launch({
            headless: true,
        });
        page = await browser.newPage();
    });

    test("navigates to login screen", async () => {
        await page.goto("http://localhost:3000");
        await page.waitForSelector(".username");
        await page.waitForSelector(".password");
        await page.waitForSelector(".login");
        await page.waitForSelector(".loginContainer");
        await page.waitForSelector(".signin");
        await page.waitForSelector(".sign");
        await page.waitForSelector('input[type="text"]');
        await page.waitForSelector('input[type="password"]');
        await page.waitForSelector(".password");

        const username = await page.$eval(".username", (e) => e.textContent);
        const password = await page.$eval(".password", (e) => e.textContent);

        expect(username).toContain("Username");
        expect(password).toContain("Password ");
    });

    test("enter username and password and redirect to home page", async () => {
        await page.click('input[type="text"]');
        await page.type('input[type="text"]', "test@gmail.com");

        await page.click('input[type="password"]');
        await page.type('input[type="password"]', "password");

        await page.click(".signin");

        const singIN = await page.$eval(".sign", (e) => e.textContent);

        expect(singIN).toContain("Sign in");

        await page.click(".sign");
        await page.waitForNavigation();

        const redirected = page.url() == "http://localhost:3000/home" ? true : false;

        await page.waitForSelector(".airHumidity");

        const airHumidity = await page.$eval(
            ".airHumidity",
            (e) => e.textContent
        );

        expect(airHumidity).toContain("Air Humidity: 40%");

        expect(redirected).toBe(true);
    }, 160000);

    afterAll(() => browser.close());
});




describe("Login.js Sad Paths", () => {
    let browser;
    let page;

    jest.setTimeout(5000);
    beforeAll(async () => {

        browser = await puppeteer.launch({
            headless: true,
        });
        page = await browser.newPage();
    });

    test("starts at login screen", async () => {
        await page.goto("http://localhost:3000");
        await page.waitForSelector(".username");
        await page.waitForSelector(".password");
        await page.waitForSelector(".login");
        await page.waitForSelector(".loginContainer");
        await page.waitForSelector(".signin");
        await page.waitForSelector(".sign");
        await page.waitForSelector('input[type="text"]');
        await page.waitForSelector('input[type="password"]');
        await page.waitForSelector(".password");

        const username = await page.$eval(".username", (e) => e.textContent);
        const password = await page.$eval(".password", (e) => e.textContent);

        expect(username).toContain("Username");
        expect(password).toContain("Password ");
    });

    test("entering incorrect username gives you an error and doesn't redirect you", async () => {
        await page.click('input[type="text"]');
        await page.type('input[type="text"]', "wrongemail@gmail.com");

        await page.click('input[type="password"]');
        await page.type('input[type="password"]', "password");

        await page.click(".signin");

        const singIn = await page.$eval(".sign", (e) => e.textContent);

        expect(singIn).toContain("Sign in");

        await page.click(".sign");
        await page.waitForTimeout(2000);

        await page.waitForSelector(".errorMsgUser");

        const errorMessage = await page.$eval(".errorMsgUser", (e) => e.textContent);
        const notRedirected = page.url() == "http://localhost:3000/login" ? true : false;

        expect(errorMessage).toContain("There is no user record corresponding to this identifier. The user may have been deleted.")
        expect(notRedirected).toBe(true);
        await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
    }, 16000);

    test("entering incorrect password gives you an error and doesn't redirect you", async () => {
        await page.click('input[type="text"]');
        await page.type('input[type="text"]', "test@gmail.com");

        await page.click('input[type="password"]');
        await page.type('input[type="password"]', "incorrectpassword");

        await page.click(".signin");

        await page.click(".sign");
        await page.waitForTimeout(2000);

        await page.waitForSelector(".errorMsgPass");

        const errorMessage = await page.$eval(".errorMsgPass", (e) => e.textContent);
        const notRedirected = page.url() == "http://localhost:3000/login" ? true : false;

        expect(errorMessage).toContain("The password is invalid or the user does not have a password.")
        expect(notRedirected).toBe(true);
        await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
    }, 16000);

    test("entering invalid email when sign up gives you an error", async () => {
        await page.click('input[type="text"]');
        await page.type('input[type="text"]', "test@.com");

        await page.click('input[type="password"]');
        await page.type('input[type="password"]', "incorrectpassword");

        await page.click(".sign");
        await page.waitForTimeout(2000);

        await page.waitForSelector(".errorMsgUser");

        const errorMessage = await page.$eval(".errorMsgUser", (e) => e.textContent);
        const notRedirected = page.url() == "http://localhost:3000/login" ? true : false;

        expect(errorMessage).toContain("The email address is badly formatted.")
        expect(notRedirected).toBe(true);
        await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
    }, 16000);

    test("entering invalid password when sign up gives you an error", async () => {
        await page.click('input[type="text"]');
        await page.type('input[type="text"]', "goodemail@gmail.com");

        await page.click('input[type="password"]');
        await page.type('input[type="password"]', "123");

        await page.click(".sign");
        await page.waitForTimeout(2000);

        await page.waitForSelector(".errorMsgPass");

        const errorMessage = await page.$eval(".errorMsgPass", (e) => e.textContent);
        const notRedirected = page.url() == "http://localhost:3000/login" ? true : false;

        expect(errorMessage).toContain("Password should be at least 6 characters")
        expect(notRedirected).toBe(true);
        await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
    }, 16000);

    test("while not logged in, doesn't let you go to other routes", async () => {
        await page.goto("http://localhost:3000/home");

        await page.waitForSelector(".username");
        await page.waitForSelector(".password");

        const notRedirected = page.url() == "http://localhost:3000/login" ? true : false;

        expect(notRedirected).toBe(true);
    }, 16000);

    afterAll(() => browser.close());
});

describe("Happy paths for home screen", () => {
    let browser;
    let page;

    jest.setTimeout(5000);
    beforeAll(async () => {

        browser = await puppeteer.launch({
            headless: true,
        });
        page = await browser.newPage();
        await page.goto("http://localhost:3000/login");
        await page.waitForSelector('input[type="text"]');
        await page.waitForSelector('input[type="password"]');
        await page.click('input[type="text"]');
        await page.type('input[type="text"]', "test@gmail.com");

        await page.click('input[type="password"]');
        await page.type('input[type="password"]', "password");

        await page.click(".signin");
        await page.click(".sign");
        await page.waitForNavigation();
    });



    test("on home screen", () => {
        const onHome = page.url() == "http://localhost:3000/home" ? true : false;
        expect(onHome).toBe(true);
    });

    test("navigate to historical from home screen and back", async () => {
        await page.click(".historical");
        const onHistorical = page.url() == "http://localhost:3000/historical" ? true : false;

        expect(onHistorical).toBe(true);

        await page.click(".home");
        const onHome = page.url() == "http://localhost:3000/home" ? true : false;

        expect(onHome).toBe(true);
    });

    test("navigate to control screen from home and back", async () => {
        await page.click(".control");
        const onControl = page.url() == "http://localhost:3000/control" ? true : false;

        expect(onControl).toBe(true);

        await page.click(".home");
        const onHome = page.url() == "http://localhost:3000/home" ? true : false;

        expect(onHome).toBe(true);
    })

    test("logout", async () => {
        // jest.setTimeout(6000);
        let button = await page.waitForSelector(".logoutButton");
        await button.evaluate(b => b.click());
        // await page.waitForNavigation();

        const onLogin = page.url() == "http://localhost:3000/login" ? true : false;
        expect(onLogin).toBe(true);
    })
})

describe("Happy paths for historical screen", () => {
    let browser;
    let page;

    jest.setTimeout(5000);
    beforeAll(async () => {

        browser = await puppeteer.launch({
            headless: true,
        });
        page = await browser.newPage();
        await page.goto("http://localhost:3000/login");
        await page.waitForSelector('input[type="text"]');
        await page.waitForSelector('input[type="password"]');
        await page.click('input[type="text"]');
        await page.type('input[type="text"]', "test@gmail.com");

        await page.click('input[type="password"]');
        await page.type('input[type="password"]', "password");

        await page.click(".signin");
        await page.click(".sign");
        await page.waitForNavigation();
    });

    test("on historical screen", async () =>{

        await page.click(".historical")
        const onHistorical = page.url() == "http://localhost:3000/historical" ? true : false;

        expect(onHistorical).toBe(true);
    })

    test("navigate to control and back", async () =>{
        await page.click(".control");
        const onControl=page.url()=="http://localhost:3000/control" ? true : false;

        expect(onControl).toBe(true);

        await page.click(".historical")
        const onHistorical = page.url() == "http://localhost:3000/historical" ? true : false;

        expect(onHistorical).toBe(true);
    })

    test("navigate to home screen from historical", async() =>{
        await page.click(".home");
        const onHome=page.url()=="http://localhost:3000/home" ? true : false;

        expect(onHome).toBe(true);
    })

    test("logout", async () => {
        // jest.setTimeout(6000);
        let button = await page.waitForSelector(".logoutButton");
        await button.evaluate(b => b.click());
        // await page.waitForNavigation();

        const onLogin = page.url() == "http://localhost:3000/login" ? true : false;
        expect(onLogin).toBe(true);
    })
})