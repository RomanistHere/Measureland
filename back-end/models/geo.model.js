const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GeoSchema = new Schema({
	properties: {
		ratingIDs: [{ type: Schema.Types.ObjectId, ref: 'Rating' }],
		rating: {
			air: {
				type: Number,
				min: 1,
				max: 5,
				required: true,
			},
			water: {
				type: Number,
				min: 1,
				max: 5,
				required: true,
			},
			logistic: {
				type: Number,
				min: 1,
				max: 5,
				required: true,
			},
			transport: {
				type: Number,
				min: 1,
				max: 5,
				required: true,
			},
			noize: {
				type: Number,
				min: 1,
				max: 5,
				required: true,
			},
			clean: {
				type: Number,
				min: 1,
				max: 5,
				required: true,
			},
			chill: {
				type: Number,
				min: 1,
				max: 5,
				required: true,
			},
			safety: {
				type: Number,
				min: 1,
				max: 5,
				required: true,
			},
			pets: {
				type: Number,
				min: 1,
				max: 5,
				required: true,
			},
			kids: {
				type: Number,
				min: 1,
				max: 5,
				required: true,
			},
			parking: {
				type: Number,
				min: 1,
				max: 5,
				required: true,
			},
		},
		averageRating: {
			type: Number,
			min: 1,
			max: 5,
			required: true,
		},
		numberOfUsers: {
			type: Number,
			required: true,
		},
		numberOfComments: {
			type: Number,
			required: true,
		},
		numberOfPersonalExperience: {
			type: Number,
			required: true,
		},
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
}).index({ 'location': '2dsphere' });

// Export the model
module.exports = mongoose.model('Geo', GeoSchema);
