const mongoose = require('./db.js')

const TopicList = mongoose.model('TopicList', {
    href: {
        type: String,
        required: true
    },
    src: {
        type: String,
        required: true
    },
    alt: {
        type: String,
        required: true
    }
});

module.exports = TopicList