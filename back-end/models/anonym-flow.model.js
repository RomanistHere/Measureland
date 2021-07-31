const { Schema, model } = require('mongoose')

const schema = new Schema({
    flow: {
        type: String,
        required: true
    },
    uniqID: {
        type: String
    }
}, {
    timestamps: true
})

const AnonymFlow = model('AnonymFlow', schema)

module.exports = AnonymFlow
