const mongoose = require('mongoose');

const Contact = mongoose.model('Contact', {
    name: {
        type: String,
        require: true
    },
    noHP: {
        type: String,
        require: true
    },
    email: {
        type: String
    }
})



module.exports = Contact