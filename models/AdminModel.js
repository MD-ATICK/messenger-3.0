const { Schema, model } = require('mongoose')


const userMainSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true
    },
    restriction: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

const userMainModel = model('adminusers', userMainSchema)
module.exports = userMainModel;