const express = require('express');
const cors = require('cors');
const firebase = require('firebase-admin');

const serviceAccount = require("./admin.json");
const { json } = require('express');
const app = express();

app.use(cors());
app.use(express.json());

const firebaseConfig = {
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://sdtest-849e7-default-rtdb.firebaseio.com"
};

firebase.initializeApp(firebaseConfig);

let database = firebase.database();


let tempRef = database.ref("/dht_sensors/temperature/");
let humidityRef = database.ref("/dht_sensors/humidity/");
let dhtRef = database.ref("/dht_sensors/");
let otherRef = database.ref("/other_sensors/");

// HELPER FUNCTIONS

let getNumberOfChildren = async ( sensor ) => {
    let value;
    let pathRef = database.ref(`temperature/sensor_${sensor}`);
    let response = await pathRef.once('value', async (snapshot) => {
        value = await snapshot.val();
    });
    return await response.numChildren();
}

// GET REQUESTS

// Get all dht-sensors
app.get("/dht_sensors/all", async (req, res, next) => {
    let value;
    await dhtRef.once('value', async (snapshot) => {
        value = await snapshot.val();
        console.log(snapshot.val());
    });
    res.json([value]);
});

// Get all temp sensors
app.get("/temperature/all", async (req, res, next) => {
    let value;
    await tempRef.once('value', async (snapshot) => {
        value = await snapshot.val();
        console.log(snapshot.val());
    });
    res.json([value]);
});

// Get all humidity sensors
app.get("/humidity/all", async (req, res, next) => {
    let value;
    await humidityRef.once('value', async (snapshot) => {
        value = await snapshot.val();
        console.log(snapshot.val());
    });
    res.json([value]);
});

// Get one temperature sensor
app.get("/temperature/:num", async (req, res, next) => {
    let value;
    await tempRef.once('value', async (snapshot) => {
        value = await snapshot.val();
        console.log(value[`sensor_${req.params.num}`]);
    });
    res.json([value[`sensor_${req.params.num}`]]);
});

// Get one humidity sensor
app.get("/humidity/:num", async (req, res, next) => {
    let value;
    await humidityRef.once('value', async (snapshot) => {
        value = await snapshot.val();
        console.log(value[`sensor_${req.params.num}`]);
    });
    res.json([value[`sensor_${req.params.num}`]]);
});

// Get number of reads for a dht_sensor
app.get("/:num/amount", async (req, res, next) => {
    let value;
    let pathRef = database.ref(`dht_sensors/temperature/sensor_${req.params.num}`);
    let response = await pathRef.once('value', async (snapshot) => {
        value = await snapshot.val();
    });
    res.send({'amount': `${response.numChildren()}`});
});

// Get all values for other sensors
app.get("/other_sensors/all", async (req, res, next) => {
    let value;
    await otherRef.once('value', async (snapshot) => {
        value = await snapshot.val();
        console.log(snapshot.val());
    });
    res.json([value]);
});


// POST REQUESTS

// POSTS new data from sensor_num for DHT SENSORS
app.post("/:sensor_num/add", async (req, res, next) => {
    let time = new Date().toLocaleTimeString();
    let date = new Date().toLocaleDateString();
    let temp = req.body.temperature;
    let humidity = req.body.humidity;

    // Temperature Object
    let tempObj = {
        time : time,
        date : date,
        value : temp
    };
    // Humidity Object
    let humidityObj = {
        time : time,
        date : date,
        value : humidity
    };

    await tempRef.child(`${req.params.sensor_num}`).push(tempObj, (error) => {
        if (error) {
          // The write failed...
          console.log("Failed with error: " + error);
        } else {
          // The write was successful...
          console.log("success");
        };
    });

    await humidityRef.child(`${req.params.sensor_num}`).push(humidityObj, (error) => {
        if (error) {
          // The write failed...
          console.log("Failed with error: " + error);
        } else {
          // The write was successful...
          console.log("success");
        };
    });

    res.send({Succes : true});
});

// POSTS new data for non DHT SENSORS
app.post("/other_sensors/add", async (req, res, next) => {
    let time = new Date().toLocaleTimeString();
    let date = new Date().toLocaleDateString();
    let val = req.body.sensor_1;

    // Temperature Object
    let bodyObj = {
        time : time,
        date : date,
        value : val
    };

    for(let i = 1; i <= 8; i++) {
        if(i == 1) {
            bodyObj.value = req.body.sensor_1;
        } else if(i == 2) {
            bodyObj.value = req.body.sensor_2;
        } else if(i == 3) {
            bodyObj.value = req.body.sensor_3;
        } else if(i == 4) {
            bodyObj.value = req.body.sensor_4;
        } else if(i == 5) {
            bodyObj.value = req.body.sensor_5;
        } else if(i == 6) {
            bodyObj.value = req.body.sensor_6;
        } else if(i == 7) {
            bodyObj.value = req.body.sensor_7;
        } else if(i == 8) {
            bodyObj.value = req.body.sensor_8;
        }

        await otherRef.child(`sensor_${i}`).push(bodyObj, (error) => {
            if (error) {
              // The write failed...
              console.log("Failed with error: " + error);
            } else {
              // The write was successful...
              console.log("success");
            };
        });
    }

    res.send({Succes : true});
});

module.exports = app;
