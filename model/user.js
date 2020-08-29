const mongoose = require('./db.js')

const User = mongoose.model('User', {
    admin: {
        type: Number,
        default: 0
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
      type: Date,
      default: new Date()
    }
});

module.exports = User