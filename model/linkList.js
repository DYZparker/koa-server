const mongoose = require('./db.js')

const LinkList = mongoose.model('LinkList', {
	name: {
		type: String,
		required: true
	},
	content: [
		{
			id: {
				type: Number,
				required: true
			},
			title: {
				type: String,
				required: true
			},
			src: {
				type: String,
			},
			href: {
				type: String,
			}
		}
	]
});

module.exports = LinkList