const mongoose = require('./db.js')

const Article = mongoose.model('Article', {
  title: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date
  },
  tags: {
    type: Array,
    required: true
  },
  img: {
    type: String
  },
  summary: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
});

module.exports = Article