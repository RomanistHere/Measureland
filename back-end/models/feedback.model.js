const { Schema, model } = require('mongoose');

const schema = new Schema({
	email: {
		type: String,
		trim: true,
	},
	heading: {
		type: String,
		trim: true,
	},
	comment: {
		type: String,
		trim: true,
		maxLength: 1400,
	},
}, {
	timestamps: true,
}).index({ 'email': 1 });

const Feedback = model('Feedback', schema);

module.exports = Feedback;
