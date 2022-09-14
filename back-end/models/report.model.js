const { Schema, model } = require('mongoose');

const schema = new Schema({
	code: {
		type: String,
		required: true,
	},
	comment: {
		type: String,
		required: false,
		maxLength: 1400,
	},
	reportedID: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	reportingID: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
}, {
	timestamps: true,
}).index({ 'code': 1 });

const Report = model('Report', schema);

module.exports = Report;
