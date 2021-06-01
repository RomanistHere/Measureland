const { Schema, model } = require('mongoose')

const schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

schema.index({ 'updatedAt': 1 }, { expireAfterSeconds: 3600000 * 24 }) // 24 hours

const UserVerification = model('UserVerification', schema)

module.exports = UserVerification
