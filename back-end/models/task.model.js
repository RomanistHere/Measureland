const { Schema, model } = require('mongoose');

const schema = new Schema({
	key: {
		type: String,
		required: true,
		maxLength: 512,
	},
	upvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	downvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, {
	timestamps: true,
}).index({ 'key': 1 });

const Task = model('Task', schema);

module.exports = Task;
