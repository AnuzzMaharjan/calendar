const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    start: Date,
    end: Date,
    title: String
})

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;