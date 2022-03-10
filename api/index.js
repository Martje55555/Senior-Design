const express = require('express');
const cors = require('cors');
const firebase = require('firebase-admin');

const serviceAccount = require("./admin.json");
const { json } = require('express');
const app = express();

const firebaseConfig = {
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://sdtest-849e7-default-rtdb.firebaseio.com"
};

app.use(cors());
app.use(express.json());

firebase.initializeApp(firebaseConfig);

let database = firebase.database();

let tempRef = database.ref("temperature");
let humidityRef = database.ref("humidity");

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

// Get all temperatures sensors
app.get("/temperature/all", async (req, res, next) => {
    let value;
    await tempRef.once('value', async (snapshot) => {
        value = await snapshot.val();
        console.log(snapshot.val());
    });
    res.json([value]);
});

// Get one humidity sensor
app.get("/humidity/all", async (req, res, next) => {
    let value;
    await tempRef.once('value', async (snapshot) => {
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
    await tempRef.once('value', async (snapshot) => {
        value = await snapshot.val();
        console.log(value[`sensor_${req.params.num}`]);
    });
    res.json([value[`sensor_${req.params.num}`]]);
});

// Get number of reads for sensor_1
app.get("/temperature/:num/amount", async (req, res, next) => {
    let value;
    let pathRef = database.ref(`temperature/sensor_${req.params.num}`);
    let response = await pathRef.once('value', async (snapshot) => {
        value = await snapshot.val();
    });
    res.send({'amount': `${response.numChildren()}`});
});

// POST REQUESTS

// POSTS new data from sensor_1
app.post("/sensor_1", async (req, res, next) => {
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

    tempRef.child('sensor_1').push(tempObj, function(error) {
        if (error) {
          // The write failed...
          console.log("Failed with error: " + error);
        } else {
          // The write was successful...
          console.log("success");
        };
    });

    humidityRef.child('sensor_1').push(humidityObj, function(error) {
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

module.exports = app;
