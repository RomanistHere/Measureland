const { Schema, model } = require('mongoose');

const schema = new Schema({
	userID: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	geoID: {
		type: Schema.Types.ObjectId,
		ref: 'Geo',
		required: true,
	},
	commentID: {
		type: Schema.Types.ObjectId,
		ref: 'Comment',
	},
	dateCreated: {
		type: Date,
		default: Date.now(),
	},
	isPersonalExperience: {
		type: Boolean,
		default: false,
		required: true,
	},
	rating: Object,
	averageRating: {
		type: Number,
		required: true,
	},
	timeline: {
		type: Number,
		required: true,
	},
	reported: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	endorsed: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, {
	timestamps: true,
}).index({ 'geo': 1 });

const Rating = model('Rating', schema);

module.exports = Rating;
