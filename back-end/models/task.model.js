const { Schema, model } = require('mongoose');

const schema = new Schema({
    key: {
        type: String,
        required: true
    },
    upvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    downvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, {
    timestamps: true
}).index({ 'key': 1 });

const Task = model('Task', schema);

module.exports = Task;
