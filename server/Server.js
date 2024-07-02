require('dotenv').config();

const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("Connected to MongoDB");

    app.use("/api/calendar", require('./CalendarController'));

    app.listen(5000, () => { console.log('server started') });
})
    .catch((error) => {
        console.log("Error while conneecting MongoDB: ", error);
    })