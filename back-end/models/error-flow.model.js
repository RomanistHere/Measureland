const { Schema, model } = require('mongoose');

const schema = new Schema({
	message: {
		type: String,
	},
	filename: {
		type: String,
	},
	lineno: {
		type: Number,
	},
	colno: {
		type: Number,
	},
	error: {
		type: Object,
	},
	dateCreated: {
		type: Date,
		default: Date.now(),
	},
}, {
	timestamps: true,
});

const ErrorFlow = model('ErrorFlow', schema);

module.exports = ErrorFlow;
