const { Schema, model } = require('mongoose');

const schema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	point: {
		type: Schema.Types.ObjectId,
		ref: 'PointOfInterest',
		required: true,
	},
	comment: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
	},
	likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	dislikes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, {
	timestamps: true,
}).index({ 'point': 1 });

const CommentPOI = model('CommentPOI', schema);

module.exports = CommentPOI;
