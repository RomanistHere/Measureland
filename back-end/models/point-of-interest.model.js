const { Schema, model } = require('mongoose');

const schema = new Schema({
	userID: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	title: {
		type: String,
		required: true,
		maxLength: 400,
	},
	description: {
		type: String,
		required: true,
		maxLength: 1400,
	},
	isAdequate: {
		type: Boolean,
		default: true,
	},
	tags: {
		type: [ String ],
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
	commentIDs: [{ type: Schema.Types.ObjectId, ref: 'CommentPOI' }],
}, {
	timestamps: true,
}).index({ 'location': '2dsphere' });

const PointOfInterest = model('PointOfInterest', schema);

module.exports = PointOfInterest;
