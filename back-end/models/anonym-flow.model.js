const { Schema, model } = require('mongoose')

const schema = new Schema({
    flow: {
        type: Array,
        required: true
    }
}, {
    timestamps: true
})

const AnonymFlow = model('AnonymFlow', schema)

module.exports = AnonymFlow
