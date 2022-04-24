const supertest = require('supertest');
const app = require('../index.js');
const request = supertest(app);
const serviceAccount = require("../admin.json");
const { post } = require('superagent');
const { Tenant } = require('firebase-admin/lib/auth/tenant');

const testf = require('firebase-functions-test')({
    databaseURL: 'https://sdtest-849e7-default-rtdb.firebaseio.com',
    projectId: 'sdtest-849e7',
}, serviceAccount);

// GET all dht sensor data
describe("Get /dht_sensors/all", () => {

    it("it should respond with content-type json and status code 200", async () => {
        jest.setTimeout(30000);
        const response = await request.get("/dht_sensors/all");
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    });
});

// GET all temp sensors
describe("GET /temperature/all", () => {

    it("it should respond with content-type json and status code 200", async () => {
        jest.setTimeout(30000);
        const response = await request.get("/temperature/all");
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    });

});

// GET all temp sensors
describe("GET /humidity/all", () => {

    it("it should respond with content-type json and status code 200", async () => {
        jest.setTimeout(30000);
        const response = await request.get("/humidity/all");
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    });

});

// Get one temperature sensor with an optional parameter of limiting the amount of results
describe("GET /temperature/:sensor", () => {

    it("it should respond with content-type json and status code 200", async () => {
        jest.setTimeout(30000);
        const response = await request.get("/temperature/sensor_1");
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    });

});

// Gets latest temperature for a sensor
describe("GET /temperature/:sensor/latest", () => {

    it("it should respond with content-type json and status code 200", async () => {
        jest.setTimeout(30000);
        const response = await request.get("/temperature/sensor_1/latest");
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    });

});


// Get one humidity sensor with an optional parameter of limiting the amount of results
describe("GET /humidity/:sensor", () => {

    it("it should respond with content-type json and status code 200", async () => {
        jest.setTimeout(30000);
        const response = await request.get("/humidity/sensor_1");
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    });

});

// Gets the latest humdity for a sensor
describe("GET /humidity/:sensor/latest", () => {

    it("it should respond with content-type json and status code 200", async () => {
        jest.setTimeout(30000);
        const response = await request.get("/humidity/sensor_1/latest");
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    });

});

// Get values for a certain day for a dht temp sensor
describe("GET /temperature/:sensor/:date", () => {

    it("it should respond with content-type json and status code 200", async () => {
        jest.setTimeout(30000);
        const response = await request.get("/temperature/sensor_1/04-05-2022");
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    });

});

// Get values for a certain day for a dht humdity sensor
describe("GET /humidity/:sensor/:date", () => {

    it("it should respond with content-type json and status code 200", async () => {
        jest.setTimeout(30000);
        const response = await request.get("/humidity/sensor_1/04-05-2022");
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    });

});

// GET number of reads for a dht sensor
describe("GET /:type/:sensor/:date/amount", () => {

    it("it should respond with content-type json and status code 200", async () => {
        jest.setTimeout(30000);
        const response = await request.get("/humidity/sensor_1/04-05-2022/amount");
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    });

});

// GET all other sensor data
describe("GET /other_sensors/all", () => {

    it("it should respond with content-type json and status code 200", async () => {
        jest.setTimeout(30000);
        const response = await request.get("/other_sensors/all");
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    });

});

// Get values for a specifc other sensor with an optional amount parameter that limits the most recent data
describe("GET /other_sensors/:sensor", () => {

    it("it should respond with content-type json and status code 200", async () => {
        jest.setTimeout(30000);
        const response = await request.get("/other_sensors/sensor_1");
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    });

});

// GET latest read from "other sensors" for a specifc sensor
describe("GET /other_sensors/:sensor/latest", () => {

    it("it should respond with content-type json and status code 200", async () => {
        jest.setTimeout(30000);
        const response = await request.get("/other_sensors/sensor_1/latest");
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    });

});

// GET reads from "other sensors" for a specifc sensor and date
describe("GET /other_sensors/:sensor/:date", () => {

    it("it should respond with content-type json and status code 200", async () => {
        jest.setTimeout(30000);
        const response = await request.get("/other_sensors/sensor_1/04-05-2022");
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    });

});

// POST request for DHT sensors
describe("POST /:sensor_num", () => {

    it("it should respond with content-type json and status code 200 and expected body should be true", async () => {
        jest.setTimeout(30000);
        const body = {
            "temperature": 100,
            "humidity": 7.12
        };

        const humidityResult = {
            "date": "today",
            "time": "right now",
            "value": 7.12,
            "description": "This is sensor_1, at location xyz."
        }

        const tempResult = {
            "date": "today",
            "time": "right now",
            "value": 100,
            "description": "This is sensor_1, at locations xyz."
        }

        const bodyResult = tempResult + humidityResult;

        const response = await request.post("/sensor_1").send(body);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        expect(response.body).toEqual(bodyResult);
    });
});

// POST request for "other sensors"
describe("POST /other_sensors/add", () => {

    it("it should respond with content-type json and status code 200 and expected body should be true", async () => {
        jest.setTimeout(30000);

        const body = {
            "sensor_1": 21,
            "sensor_2": 32,
            "sensor_3": 12,
            "sensor_4": 15,
            "sensor_5": 20,
            "sensor_6": 23,
            "sensor_7": 16,
            "sensor_8": 19,
            "sensor_9": 18,
        };

        const tempObj = {
            "time": "right now",
            "date": "today",
            "value": 0,
            "description": ""
        }

        let postResult = {
            "time": "right now",
            "date": "today",
            "value": 21,
            "description": "This is sensor_1, at location xyz."
        };

        for (let i = 2; i <= 9; i++) {
            if (i == 2) {
                tempObj.value = body.sensor_2;
                tempObj.description = `This is sensor_2, at location xyz.`
                postResult += tempObj;
            } else if (i == 3) {
                tempObj.value = body.sensor_3;
                tempObj.description = `This is sensor_3, at location xyz.`
                postResult += tempObj;
            } else if (i == 4) {
                tempObj.value = body.sensor_4;
                tempObj.description = `This is sensor_4, at location xyz.`
                postResult += tempObj;
            } else if (i == 5) {
                tempObj.value = body.sensor_5;
                tempObj.description = `This is sensor_5, at location xyz.`
                postResult += tempObj;
            } else if (i == 6) {
                tempObj.value = body.sensor_6;
                tempObj.description = `This is sensor_6, at location xyz.`
                postResult += tempObj;
            } else if (i == 7) {
                tempObj.value = body.sensor_7;
                tempObj.description = `This is sensor_7, at location xyz.`
                postResult += tempObj;
            } else if (i == 8) {
                tempObj.value = body.sensor_8;
                tempObj.description = `This is sensor_8, at location xyz.`
                postResult += tempObj;
            } else if (i == 9) {
                tempObj.value = body.sensor_9;
                tempObj.description = `This is sensor_9, at location xyz.`
                postResult += tempObj;
            }
        }
        console.log(postResult);
        const response = await request.post("/other_sensors/add").send(body);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        expect(response.body).toEqual(postResult);
    });
});