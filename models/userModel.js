const { Schema, model } = require('mongoose')


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    // image: {
    //     type: String,
    //     required: true,
    // },
    avatar: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
})

const userModel = model('users', userSchema)
module.exports = userModel;