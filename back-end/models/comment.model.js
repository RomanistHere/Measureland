const { Schema, model } = require('mongoose')

const schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    geo: {
        type: Schema.Types.ObjectId,
        ref: 'Geo',
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    dislikes: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, {
    timestamps: true
}).index({ 'geo': 1 })

const Comment = model('Comment', schema)

module.exports = Comment
