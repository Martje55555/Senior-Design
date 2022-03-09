const express = require('express');
const cors = require('cors');
const firebase = require('firebase-admin');

const serviceAccount = require("./admin.json");
const app = express();

const firebaseConfig = {
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://sdtest-849e7-default-rtdb.firebaseio.com"
};

app.use(cors());

firebase.initializeApp(firebaseConfig);

let database = firebase.database();

let tempRef = database.ref("temperature");

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
app.get("/humidity", async (req, res, next) => {
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

module.exports = app;
