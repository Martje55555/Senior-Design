jest.useFakeTimers();

const supertest = require("supertest");

const app = require('../index.js');

// beforeEach((done) => {
//     mongoose.connect("mongodb://localhost:27017/JestDB",
//         { useNewUrlParser: true, useUnifiedTopology: true },
//         () => done());
// });

// afterEach((done) => {
//     mongoose.connection.db.dropDatabase(() => {
//         mongoose.connection.close(() => done())
//     });
// });

test("GET /temperature/all", async () => {
    const data = {
        "temperature": {
            "sensor_1": {
                "1": {
                    "date": "",
                    "time": "",
                    "value": ""
                }
            }

        },
        "humidity": {
            "sensor_1": {
                "1": {
                    "date": "",
                    "time": "",
                    "value": ""
                }
            }
        }
    };

    await supertest(app).get("/temperature/all")
        .expect(200)
        .then((response) => {
            // Check type and length
            expect(Array.isArray(response.body)).toBeTruthy();
            //expect(response.body.length).toEqual(1);
            // Check data
            expect(response.body[0].temperature).toBe(post.temperature);
            expect(response.body[0].sensor_1).toBe(post.sensor_1);
            //expect(response.body[0][1].)
        });
});

