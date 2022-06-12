const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
	email: {
		type: String,
		unique: true,
		trim: true,
		maxLength: 128,
	},
	telegramID: String,
	walletAddress: String,
	username: {
		type: String,
		trim: true,
		default: "Anonym",
		maxLength: 128,
	},
	verified: {
		type: Boolean,
		required: true,
		default: false,
	},
	usergroup: {
		type: Number,
		default: 1,
	},
	password: {
		type: String,
		maxLength: 128,
	},
	dateCreated: {
		type: Date,
		default: Date.now(),
	},
	karma: {
		curVal: {
			type: Number,
			default: 0,
		},
		thresholdVal: {
			type: Number,
			default: 0,
		},
		activityVal: {
			type: Number,
			default: 0, // here karma activity for the last 12 hours should be stored
		},
		lastAction: {
			type: Date,
			default: Date.now(),
		},
	},
	isSuspicious: {
		type: Boolean,
		required: true,
		default: false,
	},
	properties: {
		ratingIDs: [{ type: Schema.Types.ObjectId, ref: 'Rating' }],
		geoIDs: [{ type: Schema.Types.ObjectId, ref: 'Geo' }],
		POIIDs: [{ type: Schema.Types.ObjectId, ref: 'PointOfInterest' }],
		POICommentIDs: [{ type: Schema.Types.ObjectId, ref: 'CommentPOI' }],
		ageGrp: {
			type: Number,
			default: 1, // 0 - under 25, 1 - 25-40, 2- 41-55, 3 - 55+
		},
		moneyGrp: {
			type: Number,
			default: 1, // 0 - below average, 1 - average, 2 - above average
		},
		activeRatings: {
			type: Number,
			default: 3,
		},
		lastRatingsAdded: {
			type: Date,
			default: Date.now(),
		},
		lang: {
			type: String,
			default: 'en',
		},
		balance: {
			type: Number,
			default: 0,
		},
		wantMoreRatings: {
			type: Boolean,
			default: false,
		},
	},
}).index({ 'email': 1 });

// Export the model
module.exports = model('User', UserSchema);
