const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    regno: {
        type: Number,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    personalData:{
        type:Object,
    },
    drives:{
        type:Object,

    },
    recentPlaced:{
        type:Object,
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
