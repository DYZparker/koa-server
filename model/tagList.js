const mongoose = require('./db.js')

const TagList = mongoose.model('TagList', {
    title: {
        type: String,
        required: true,
        trim: true
    },
    color: {
        type: String,
        required: true
    }
});

module.exports = TagList