//jest.useFakeTimers()
console.log(process.env.NODE_ENV);
// ONLY USE IN DEVELOPMENT TO TEST FIREBASE CONNECTION WITH API
if (process.env.NODE_ENV === 'dev') {
    const supertest = require('supertest');
    const app = require('../index.js');
    const request = supertest(app);
    const serviceAccount = require("../admin.json");
    const { post } = require('superagent');

    const testf = require('firebase-functions-test')({
        databaseURL: 'https://sdtest-849e7-default-rtdb.firebaseio.com',
        projectId: 'sdtest-849e7',
    }, serviceAccount);

    // GET all dht sensor data
    describe("Get /dht_sensors/all", () => {

        it("it should respond with content-type json and status code 200", async () => {
            jest.setTimeout(50000);
            const response = await request.get("/dht_sensors/all");
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        });

    });

    // GET all temp sensors
    describe("GET /temperature/all", () => {

        it("it should respond with content-type json and status code 200", async () => {
            jest.setTimeout(50000);
            const response = await request.get("/temperature/all");
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        });

    });

    // GET all temp sensors
    describe("GET /humidity/all", () => {

        it("it should respond with content-type json and status code 200", async () => {
            jest.setTimeout(50000);
            const response = await request.get("/humidity/all");
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        });

    });

    // Get one temperature sensor with an optional parameter of limiting the amount of results
    describe("GET /temperature/:sensor", () => {

        it("it should respond with content-type json and status code 200", async () => {
            jest.setTimeout(50000);
            const response = await request.get("/temperature/sensor_1");
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        });

    });

    // Gets latest temperature for a sensor
    describe("GET /temperature/:sensor/latest", () => {

        it("it should respond with content-type json and status code 200", async () => {
            jest.setTimeout(50000);
            const response = await request.get("/temperature/sensor_1/latest");
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        });

    });


    // Get one humidity sensor with an optional parameter of limiting the amount of results
    describe("GET /humidity/:sensor", () => {

        it("it should respond with content-type json and status code 200", async () => {
            jest.setTimeout(50000);
            const response = await request.get("/humidity/sensor_1");
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        });

    });

    // Gets the latest humdity for a sensor
    describe("GET /humidity/:sensor/latest", () => {

        it("it should respond with content-type json and status code 200", async () => {
            jest.setTimeout(50000);
            const response = await request.get("/humidity/sensor_1/latest");
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        });

    });

    // Get values for a certain day for a dht temp sensor
    describe("GET /temperature/:sensor/:date", () => {

        it("it should respond with content-type json and status code 200", async () => {
            jest.setTimeout(50000);
            const response = await request.get("/temperature/sensor_1/04-05-2022");
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        });

    });

    // Get values for a certain day for a dht humdity sensor
    describe("GET /humidity/:sensor/:date", () => {

        it("it should respond with content-type json and status code 200", async () => {
            jest.setTimeout(50000);
            const response = await request.get("/humidity/sensor_1/04-05-2022");
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        });

    });

    // GET number of reads for a dht sensor
    describe("GET /:type/:sensor/:date/amount", () => {

        it("it should respond with content-type json and status code 200", async () => {
            jest.setTimeout(50000);
            const response = await request.get("/humidity/sensor_1/04-05-2022/amount");
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        });

    });

    // GET all other sensor data
    describe("GET /other_sensors/all", () => {

        it("it should respond with content-type json and status code 200", async () => {
            jest.setTimeout(50000);
            const response = await request.get("/other_sensors/all");
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        });

    });

    // Get values for a specifc other sensor with an optional amount parameter that limits the most recent data
    describe("GET /other_sensors/:sensor", () => {

        it("it should respond with content-type json and status code 200", async () => {
            jest.setTimeout(50000);
            const response = await request.get("/other_sensors/sensor_1");
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        });

    });

    // GET latest read from "other sensors" for a specifc sensor
    describe("GET /other_sensors/:sensor/latest", () => {

        it("it should respond with content-type json and status code 200", async () => {
            jest.setTimeout(50000);
            const response = await request.get("/other_sensors/sensor_1/latest");
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        });

    });

    // GET reads from "other sensors" for a specifc sensor and date
    describe("GET /other_sensors/:sensor/:date", () => {

        it("it should respond with content-type json and status code 200", async () => {
            jest.setTimeout(50000);
            const response = await request.get("/other_sensors/sensor_1/04-05-2022");
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        });

    });

    // POST request for DHT sensors
    describe("POST /:sensor_num", () => {

        it("it should respond with content-type json and status code 200 and expected body should be true", async () => {
            jest.setTimeout(50000);
            const body = {
                "temperature": 100,
                "humidity": 7.12
            };

            const response = await request.post("/sensor_1").send(body);
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        });
    });

    // POST request for "other sensors"
    describe("POST /other_sensors/add", () => {

        it("it should respond with content-type json and status code 200 and expected body should be true", async () => {
            jest.setTimeout(50000);

            const body = {
                "sensor_1": 21,
                "sensor_2": 32,
                "sensor_3": 12,
                "sensor_4": 15,
                "sensor_5": 20,
                "sensor_6": 23,
                "sensor_7": 16,
                "sensor_8": 19
            };

            const response = await request.post("/other_sensors/add").send(body);
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        });
    });
} else {
    describe('Space test suite', () => {
        it('My Space Test', () => {
            expect(true).toEqual(true);
        });
    });
}


