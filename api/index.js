const express = require('express');
const cors = require('cors');
const firebase = require('firebase-admin');
const axios = require('axios');
const ping = require('net-ping');

const serviceAccount = require("./admin.json");
const { json } = require('express');

require('dotenv').config();

let session = ping.createSession();

let espIP = null;

let day = new Date().getDate();
if (10 - day > 0) {
    day = day.toString();
    day = '0' + day;
} else {
    day = day.toString();
}

let month = new Date().getMonth() + 1;
if (10 - month > 0) {
    month = month.toString();
    month = '0' + month;
} else {
    month = month.toString();
}

let year = new Date().getFullYear().toString();

let today = month + '-' + day + '-' + year;

const app = express();

app.use(cors());
app.use(express.json());

const firebaseConfig = {
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://sdtest-849e7-default-rtdb.firebaseio.com"
};

firebase.initializeApp(firebaseConfig);

const database = firebase.database();

const dhtRef = database.ref("/dht_sensors/");
const otherRef = database.ref("/other_sensors/");

// HELPER FUNCTIONS

const getNumberOfChildren = async (sensor) => {
    let value;
    let pathRef = database.ref(`temperature/sensor_${sensor}`);
    let response = await pathRef.once('value', async (snapshot) => {
        value = await snapshot.val();
    });

    return response.numChildren();
};

// This function runs in intervals - every ___ minutes
var minutes = 1, the_interval = minutes * 60 * 1000;
setInterval( async function() {
  console.log("I am doing my 1 minute check");
  console.log(espIP);
}, the_interval);

// Call Model
app.get("/call_model", async (req, res, next) => {
    try {
        var spawn = require('child_process').spawn;
        var process = spawn('python', ['./model/run_model.py']);
        process.stdout.on('data', function (data) {
            let prediction = JSON.parse(data);
            res.status(200).json(prediction);
        });
    } catch(e) {
        console.log(e);
        res.status(400).json(["'Success': false", `"Error": ${e}`]);
    };
});

// STATUS OF ESP
app.get("/status", async (req, res, next) => {
    if (espIP === null) {
        res.status(404).json("Please set ip using /set_ip endpoint");
    } else {
        try {
            session.pingHost(espIP, function (error, espIP) {
                if (error) {
                    console.log(espIP + ": " + error.toString());
                    isAlive = false;
                    res.status(200).json("OFF");
                } else {
                    console.log(espIP + ": Alive");
                    isAlive = true;
                    res.status(200).json("ON");
                }
            });
        } catch (e) {
            console.log("Error: " + e);
            res.status(400).json(`${e}`);
        };
    }
});

// SET THE IP of the ESP
app.post("/set_ip", async (req, res, next) => {
    try {
        espIP = req.body.ip.toString();
        console.log(espIP);
        if (typeof (espIP) === 'string') {
            res.status(200).json(`Set ip: ${espIP}`);
        } else {
            res.status(403).json(`Incorrect ip format`);
        }
    } catch (e) {
        console.log("Error: " + e);
        res.status(400).json(`Error: ${e}`);
    }
});

console.log(espIP);

// Calls the ESP endpoint to gather data
app.get("/trigger_esp_data", async (req, res, next) => {
    if (process.env.NODE_ENV === 'test') {
        console.log("Success");
        res.status(200).json(`"Success": true`);
    } else {
        try {
            let data;
            console.log(espIP);
            let url = `http://${espIP}/sendData`
            axios.get(url)
                .then((response) => {
                    data = response.data;
                    res.status(200).json(data);
                });
        } catch (err) {
            console.log("Error: " + err);
            res.status(400).json(["'Success': false", `"Error": ${err}`]);
        }
    }
});

// Calls the ESP endpoint to trigger irrigation
app.get("/trigger_esp_irrigation/:number", async (req, res, next) => {
    if (process.env.NODE_ENV === 'test'){
        console.log("Success");
    } else {
        try {
            let data;
            console.log(espIP);
            let url = `http://${espIP}/irrigate/${req.params.number}`;
            axios.get(url)
                .then((response) => {
                    data = response.data;
                    res.status(200).json([`${req.params.number}: ${data}`]);
                });
        } catch (err) {
            console.log("Error: " + err);
            res.status(400).json(["'Success': false", `"Error": ${err}`, `${req.params.number}: ${err}`]);
        };
    };
});

// GET REQUESTS

// Get all dht-sensors
app.get("/dht_sensors/all", async (req, res, next) => {
    if (process.env.NODE_ENV === 'test') {
        res.status(200).json(["'Success': true"])
    } else {
        try {
            let value;
            await dhtRef.once('value', async (snapshot) => {
                value = await snapshot.val();
                console.log(snapshot.val());
            });

            res.status(200).json([value]);

        } catch (err) {
            console.log("Error: " + err);
            res.status(400).json(["'Success': false", `"Error": ${err}`]);
        }
    };
});

// Get all temp sensors
app.get("/temperature/all", async (req, res, next) => {
    if (process.env.NODE_ENV === 'test') {
        console.log("Success");
        res.status(200).json(`"Success": true`);
    } else {
        try {
            let value;
            let tempRef = database.ref("/dht_sensors/temperature/")
            await tempRef.once('value', async (snapshot) => {
                value = await snapshot.val();
                console.log(snapshot.val());
            });

            res.status(200).json([value]);

        } catch (err) {
            console.log("Error: " + err);
            res.status(400).json(["'Success': false", `"Error": ${err}`]);
        }
    }
});

// Get all humidity sensors
app.get("/humidity/all", async (req, res, next) => {
    if (process.env.NODE_ENV === 'test') {
        console.log("Success");
        res.status(200).json(`"Success": true`);
    } else {
        try {
            let value;
            let humidityRef = database.ref("/dht_sensors/humidity/");
            await humidityRef.once('value', async (snapshot) => {
                value = await snapshot.val();
                console.log(snapshot.val());
            });

            res.status(200).json([value]);

        } catch (err) {
            console.log("Error: " + err);
            res.status(400).json(["'Success': false", `"Error": ${err}`]);
        }
    }

});

// Get one temperature sensor with an optional parameter of limiting the amount of results
app.get("/temperature/:sensor", async (req, res, next) => {
    if (process.env.NODE_ENV === 'test') {
        console.log("Success");
        res.status(200).json(`"Success": true`);
    } else {
        try {

            let amount = req.query.amount ? req.query.amount : null;

            if (amount == null) {
                let value;
                let tempRef = database.ref("/dht_sensors/temperature/")
                await tempRef.once('value', async (snapshot) => {
                    value = await snapshot.val();
                    console.log(value[`${req.params.sensor}`]);
                });

                res.status(200).json([value[`${req.params.sensor}`]]);

            } else {
                amount = Number(amount);
                let value;
                database.ref(`/dht_sensors/temperature/${req.params.sensor}`)
                    .orderByKey()
                    .limitToLast(amount)
                    .on("value", async (snapshot) => {
                        value = await snapshot.val();
                        console.log(value);
                        res.status(200).json([value]);
                    });
            }
        } catch (err) {
            console.log("Error: " + err);
            res.status(400).json(["'Success': false", `"Error": ${err}`]);
        }
    }
});

app.get("/temperature/:sensor/latest", async (req, res, next) => {
    if (process.env.NODE_ENV === 'test') {
        console.log("Success");
        res.status(200).json(`"Success": true`);
    } else {
        try {

            if (!req.params.sensor) {
                res.status(418).send({ message: 'Must specify sensor' });
            }

            let value;
            let key;
            let data;
            await database.ref(`/dht_sensors/temperature/${req.params.sensor}`)
                .orderByKey()
                .limitToLast(1)
                .once("value", async (snapshot) => {
                    value = snapshot.forEach((childSnapshot) => {
                        data = childSnapshot.val();
                    });
                })

            for (var att in data) {
                key = att;
            }

            console.log(data[key]);
            res.status(200).json(data[key]);
        } catch (err) {
            console.log("Error: " + err);
            res.status(400).json(["'Success': false", `"Error": ${err}`]);
        }
    }
});

// Get one humidity sensor with an optional parameter of limiting the amount of results
app.get("/humidity/:sensor", async (req, res, next) => {
    if (process.env.NODE_ENV === 'test') {
        console.log("Success");
        res.status(200).json(`"Success": true`);
    } else {
        try {

            if (!req.params.sensor) {
                res.status(418).send({ message: 'Must specify sensor' });
            }

            let amount = req.query.amount ? req.query.amount : null;

            if (amount == null) {
                let value;
                let humidityRef = database.ref("/dht_sensors/humidity/");
                await humidityRef.once('value', async (snapshot) => {
                    value = await snapshot.val();
                    console.log(value[`${req.params.sensor}`]);
                });

                res.status(200).json([value[`${req.params.sensor}`]]);
            } else {
                amount = Number(amount);
                let value;
                database.ref(`/dht_sensors/humidity/${req.params.sensor}`)
                    .orderByKey()
                    .limitToLast(amount)
                    .on("value", async (snapshot) => {
                        value = await snapshot.val();
                        console.log(value);
                        res.status(200).json([value]);
                    });
            }
        } catch (err) {
            console.log("Error: " + err);
            res.status(400).json(["'Success': false", `"Error": ${err}`]);
        }
    }
});

app.get("/humidity/:sensor/latest", async (req, res, next) => {
    if (process.env.NODE_ENV === 'test') {
        console.log("Success");
        res.status(200).json(`"Success": true`);
    } else {
        try {

            if (!req.params.sensor) {
                res.status(418).send({ message: 'Must specify sensor' });
            }
            let value;
            let key;
            let data;
            await database.ref(`/dht_sensors/humidity/${req.params.sensor}`)
                .orderByKey()
                .limitToLast(1)
                .once("value", async (snapshot) => {
                    value = snapshot.forEach((childSnapshot) => {
                        data = childSnapshot.val();
                    });
                })

            for (var att in data) {
                key = att;
            }

            console.log(data[key]);
            res.status(200).json(data[key]);
        } catch (err) {
            console.log("Error: " + err);
            res.status(400).json(["'Success': false", `"Error": ${err}`]);
        }
    }
});

// Get values for a certain day for a dht temp sensor
app.get("/temperature/:sensor/:date", async (req, res, next) => {
    if (process.env.NODE_ENV === 'test') {
        console.log("Success");
        res.status(200).json(`"Success": true`);
    } else {
        try {
            if (!req.params.sensor) {
                res.status(418).send({ message: 'Must specify sensor' });
            }

            if (!req.params.date) {
                res.status(418).send({ message: 'Must specify a date' });
            }

            let value;
            let pathRef = database.ref(`dht_sensors/temperature/${req.params.sensor}/${req.params.date}`);
            let response = await pathRef.once('value', async (snapshot) => {
                value = await snapshot.val();
            });

            console.log(response);
            res.status(200).json([value]);
        } catch (err) {
            console.log("Error: " + err);
            res.status(400).json(["'Success': false", `"Error": ${err}`]);
        }
    }
});

// Get values for a certain day for a dht humidity sensor
app.get("/humidity/:sensor/:date", async (req, res, next) => {
    if (process.env.NODE_ENV === 'test') {
        console.log("Success");
        res.status(200).json(`"Success": true`);
    } else {
        try {
            if (!req.params.sensor) {
                res.status(418).send({ message: 'Must specify sensor' });
            }

            if (!req.params.date) {
                res.status(418).send({ message: 'Must specify a date' });
            }

            let value;
            let pathRef = database.ref(`dht_sensors/humidity/${req.params.sensor}/${req.params.date}`);
            let response = await pathRef.once('value', async (snapshot) => {
                value = await snapshot.val();
            });

            console.log(response);
            res.status(200).json([value]);
        } catch (err) {
            console.log("Error: " + err);
            res.status(400).json(["'Success': false", `"Error": ${err}`]);
        }
    }
});

// Get number of reads for a dht_sensor
app.get("/:type/:sensor/:date/amount", async (req, res, next) => {
    if (process.env.NODE_ENV === 'test') {
        console.log("Success");
        res.status(200).json(`"Success": true`);
    } else {
        try {
            if (!req.params.type) {
                res.status(418).send({ message: 'Must specify sensor type' });
            }
            if (!req.params.sensor) {
                res.status(418).send({ message: 'Must specify sensor' });
            }
            if (!req.params.date) {
                res.status(418).send({ message: 'Must specify date' });
            }

            let value;
            let pathRef = database.ref(`dht_sensors/${req.params.type}/${req.params.sensor}/${req.params.date}`);
            let response = await pathRef.once('value', async (snapshot) => {
                value = await snapshot.val();
            });

            res.status(200).json(`"amount": ${response.numChildren()}`);
        } catch (err) {
            console.log("Error: " + err);
            res.status(400).json(["'Success': false", `"Error": ${err}`]);
        }
    }
});

// Get all values for other sensors
app.get("/other_sensors/all", async (req, res, next) => {
    if (process.env.NODE_ENV === 'test') {
        console.log("Success");
        res.status(200).json(`"Success": true`);
    } else {
        try {
            let value;
            await otherRef.once('value', async (snapshot) => {
                value = await snapshot.val();
                console.log(snapshot.val());
            });

            res.status(200).json([value]);
        } catch (err) {
            console.log("Error: " + err);
            res.status(400).json(["'Success': false", `"Error": ${err}`]);
        }
    }
});

// Get values for a specifc other sensor with an optional amount parameter that limits the most recent data
app.get("/other_sensors/:sensor", async (req, res, next) => {
    if (process.env.NODE_ENV === 'test') {
        console.log("Success");
        res.status(200).json(`"Success": true`);
    } else {
        try {
            let amount = req.query.amount ? req.query.amount : null;

            if (amount == null) {
                let value;
                let pathRef = database.ref(`other_sensors/${req.params.sensor}/`);
                let response = await pathRef.once('value', async (snapshot) => {
                    value = await snapshot.val();
                });

                console.log(response);
                res.json([value]);
            } else {
                amount = Number(amount);
                let value;

                await database.ref(`/other_sensors/${req.params.sensor}`)
                    .orderByKey()
                    .limitToLast(amount)
                    .once("value", async (snapshot) => {
                        value = snapshot.val();
                    });

                console.log(value);
                res.status(200).json(value);
            }
        } catch (err) {
            console.log("Error: " + err);
            res.status(400).json(["'Success': false", `"Error": ${err}`]);
        }
    }
});

app.get("/other_sensors/:sensor/latest", async (req, res, next) => {
    if (process.env.NODE_ENV === 'test') {
        console.log("Success");
        res.status(200).json(`"Success": true`);
    } else {
        try {
            let value;
            let key;
            let data;
            await database.ref(`/other_sensors/${req.params.sensor}`)
                .orderByKey()
                .limitToLast(1)
                .once("value", async (snapshot) => {
                    value = snapshot.forEach((childSnapshot) => {
                        data = childSnapshot.val();
                    });
                })

            for (var att in data) {
                key = att;
            }

            console.log(data[key]);
            res.status(200).json(data[key]);
        } catch (err) {
            console.log("Error: " + err);
            res.status(400).json(["'Success': false", `"Error": ${err}`]);
        }
    }
});

// Get values for a certain day for a specific other sensor
app.get("/other_sensors/:sensor/:date", async (req, res, next) => {
    if (process.env.NODE_ENV === 'test') {
        console.log("Success");
        res.status(200).json(`"Success": true`);
    } else {
        try {
            let value;
            let pathRef = database.ref(`other_sensors/${req.params.sensor}/${req.params.date}`);
            let response = await pathRef.once('value', async (snapshot) => {
                value = await snapshot.val();
            });

            console.log(response);
            res.status(200).json([value]);
        } catch (err) {
            console.log("Error: " + err);
            res.status(400).json(["'Success': false", `"Error": ${err}`]);
        }
    }
});

// POST REQUESTS

// POSTS new data from sensor_num for DHT SENSORS
app.post("/:sensor_num", async (req, res, next) => {
    let time = new Date().toLocaleTimeString();
    let date = new Date().toLocaleDateString();
    let temp = req.body.temperature;
    let humidity = req.body.humidity;
    let description = `This is ${req.params.sensor_num}, at location xyz.`

    // Temperature Object
    let tempObj = {
        time: time,
        date: date,
        value: temp,
        description: description
    };

    // Humidity Object
    let humidityObj = {
        time: time,
        date: date,
        value: humidity,
        description: description
    };

    if (process.env.NODE_ENV === 'test') {
        console.log("Success");
        tempObj.date = 'today';
        tempObj.time = 'right now';
        humidityObj.date = 'today';
        humidityObj.time = 'right now';

        const bodySend = tempObj + humidityObj;
        res.status(200).json(bodySend);
    } else {
        try {
            await dhtRef.child(`/temperature/${req.params.sensor_num}/${today}`).push(tempObj, (error) => {
                if (error) {
                    // The write failed...
                    console.log("Failed with error: " + error);
                } else {
                    // The write was successful...
                    console.log("success");
                };
            });

            await dhtRef.child(`/humidity/${req.params.sensor_num}/${today}`).push(humidityObj, (error) => {
                if (error) {
                    // The write failed...
                    console.log("Failed with error: " + error);
                } else {
                    // The write was successful...
                    console.log("success");
                };
            });

            res.status(200).json('"Success": true');
        } catch (err) {
            console.log("Error: " + err);
            res.status(400).json(["'Success': false", `"Error": ${err}`]);
        }
    }
});

// POSTS new data for non DHT SENSORS
app.post("/other_sensors/add", async (req, res, next) => {
    let time = new Date().toLocaleTimeString();
    let date = new Date().toLocaleDateString();
    let val = req.body.sensor_1;
    let description;

    // Temperature Object
    let bodyObj = {
        time: time,
        date: date,
        value: val,
        description: description
    };

    /////////// FOR TESTING //////////
    if (process.env.NODE_ENV === 'test') {
        let sendObj;
        let sens1;
        let sens2;
        let sens3;
        let sens4;
        let sens5;
        let sens6;
        let sens7;
        let sens8;
        let sens9;

        bodyObj.time = "right now";
        bodyObj.date = "today";

        for (let i = 1; i <= 9; i++) {
            if (i == 1) {
                bodyObj.value = req.body.sensor_1;
                bodyObj.description = `This is sensor_1, at location xyz.`
                sens1 = bodyObj;
            }
            else if (i == 2) {
                bodyObj.value = req.body.sensor_2;
                bodyObj.description = `This is sensor_2, at location xyz.`
                sens2 = bodyObj;
            } else if (i == 3) {
                bodyObj.value = req.body.sensor_3;
                bodyObj.description = `This is sensor_3, at location xyz.`
                sens3 = bodyObj;
            } else if (i == 4) {
                bodyObj.value = req.body.sensor_4;
                bodyObj.description = `This is sensor_4, at location xyz.`
                sens4 = bodyObj;
            } else if (i == 5) {
                bodyObj.value = req.body.sensor_5;
                bodyObj.description = `This is sensor_5, at location xyz.`
                sens5 = bodyObj;
            } else if (i == 6) {
                bodyObj.value = req.body.sensor_6;
                bodyObj.description = `This is sensor_6, at location xyz.`
                sens6 = bodyObj;
            } else if (i == 7) {
                bodyObj.value = req.body.sensor_7;
                bodyObj.description = `This is sensor_7, at location xyz.`
                sens7 = bodyObj;
            } else if (i == 8) {
                bodyObj.value = req.body.sensor_8;
                bodyObj.description = `This is sensor_8, at location xyz.`
                sens8 = bodyObj;
            } else if (i == 9) {
                bodyObj.value = req.body.sensor_9;
                bodyObj.description = `This is sensor_9, at location xyz.`
                sens9 = bodyObj;
            }
        }

        sendObj = sens1 + sens2 + sens3 + sens4 + sens5 + sens6 + sens7 + sens8 + sens9;
        console.log(sendObj);

        console.log("Success");
        res.status(200).json(sendObj);

    } else {
        try {
            for (let i = 1; i <= 9; i++) {
                if (i == 1) {
                    bodyObj.value = req.body.sensor_1;
                    bodyObj.description = `This is sensor_1, at location xyz.`
                } else if (i == 2) {
                    bodyObj.value = req.body.sensor_2;
                    bodyObj.description = `This is sensor_2, at location xyz.`
                } else if (i == 3) {
                    bodyObj.value = req.body.sensor_3;
                    bodyObj.description = `This is sensor_3, at location xyz.`
                } else if (i == 4) {
                    bodyObj.value = req.body.sensor_4;
                    bodyObj.description = `This is sensor_4, at location xyz.`
                } else if (i == 5) {
                    bodyObj.value = req.body.sensor_5;
                    bodyObj.description = `This is sensor_5, at location xyz.`
                } else if (i == 6) {
                    bodyObj.value = req.body.sensor_6;
                    bodyObj.description = `This is sensor_6, at location xyz.`
                } else if (i == 7) {
                    bodyObj.value = req.body.sensor_7;
                    bodyObj.description = `This is sensor_7, at location xyz.`
                } else if (i == 8) {
                    bodyObj.value = req.body.sensor_8;
                    bodyObj.description = `This is sensor_8, at location xyz.`
                } else if (i == 9) {
                    bodyObj.value = req.body.sensor_9;
                    bodyObj.description = `This is sensor_9 at location xyz`
                }

                await database.ref("/other_sensors/").child(`sensor_${i}/${today}`).push(bodyObj, (error) => {
                    if (error) {
                        // The write failed...
                        console.log("Failed with error: " + error);
                    } else {
                        // The write was successful...
                        console.log("success");
                    };
                });
            }

            res.status(200).json('"Success": true');
        } catch (err) {
            console.log("Error: " + err);
            res.status(400).json(["'Success': false", `"Error": ${err}`]);
        }
    }
});



///////////// OUTSIDE 3'rd PARTY API'S ///////////////

app.get("/weather", async (req, res, next) => {
    if (process.env.NODE_ENV === 'test') {
        console.log("Success");
        res.status(200).json(`"Success": true`);
    } else {
        if (req.query.appid === process.env.WEATHER_API_KEY) {
            try {
                let data;
                let url = `https://api.openweathermap.org/data/2.5/weather`
                axios.get(url, {
                    params: {
                        'lat': req.query.lat,
                        'lon': req.query.lon,
                        'appid': req.query.appid
                    }
                })
                    .then((response) => {
                        data = response.data;
                        res.status(200).json([data["main"]["temp"]])
                    });
            } catch (err) {
                console.log("Error: " + err);
                res.status(400).json(["'Success': false", `"Error": ${err}`]);
            }
        } else {

            res.status(401).json(`ERROR: INVALID API KEY - ${req.query.appid}`);
        }
    }
});

// weather desc
app.get("/weather_desc", async (req, res, next) => {
    if (process.env.NODE_ENV === 'test') {
        console.log("Success");
        res.status(200).json(`"Success": true`);
    } else {
        if (req.query.appid === process.env.WEATHER_API_KEY) {
            try {
                let data;
                let url = `https://api.openweathermap.org/data/2.5/weather`
                axios.get(url, {
                    params: {
                        'lat': req.query.lat,
                        'lon': req.query.lon,
                        'appid': req.query.appid
                    }
                })
                    .then((response) => {
                        data = response.data;
                        console.log(data["weather"][0]["description"])
                        res.status(200).json([data["weather"][0]["description"]]);
                    });
            } catch (err) {
                console.log("Error: " + err);
                res.status(400).json(["'Success': false", `"Error": ${err}`]);
            }
        } else {

            res.status(401).json(`ERROR: INVALID API KEY - ${req.query.appid}`);
        }
    }
});

module.exports = app;
