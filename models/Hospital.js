const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
    hospitalName: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    location: {
        type: String,
        required: true
    },
    numberOfDoctors: {
        type: Number,
        required: true
    },
    numberOfBed: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Hospital', hospitalSchema); 