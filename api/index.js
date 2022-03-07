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

app.get("/temperature", async (req, res, next) => {
    let value;
    await tempRef.once('value', async (snapshot) => {
        value = await snapshot.val();
        console.log(snapshot.val());
    })
    res.json([value]);
});

app.listen(3001, () => {
    console.log("Server running on port 3001");
});
