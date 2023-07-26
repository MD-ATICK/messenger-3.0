const { default: mongoose } = require("mongoose")


exports.MongooseConnect = async () => {
    try {
        mongoose.connect("mongodb+srv://messenger-lwp:messenger-lwp@cluster0.sxaoekd.mongodb.net/?retryWrites=true&w=majority", { dbName: 'messenger_v1' })
        console.log('database connected')
    } catch (error) {
        console.log('not connected')
    }
}