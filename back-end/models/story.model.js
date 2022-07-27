const { Schema, model } = require('mongoose');

const schema = new Schema({
	userID: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	title: {
		type: String,
		required: true,
		maxLength: 400,
	},
	content: {
		type: String,
		required: true,
	},
	slug: {
		type: String,
		required: true,
	},
	author: {
		type: String,
		required: true,
		default: "Anon",
	},
	date: {
		type: Date,
		required: true,
		default: Date.now(),
	},
	location: {
		type: {
			type: String,
			enum : [ 'Point' ],
			default: 'Point',
		},
		coordinates: {
			type: [ Number ],
			required: true,
		},
	},
	likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	dislikes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, {
	timestamps: true,
}).index({ 'location': '2dsphere' });

const Story = model('Story', schema);

module.exports = Story;
