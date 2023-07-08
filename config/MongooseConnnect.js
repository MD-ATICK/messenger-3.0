require('dotenv').config()
const { default: mongoose } = require("mongoose")


exports.MongooseConnect = async () => {
    try {
        await mongoose.connect(process.env.database_url, { dbName: 'messenger_v1' })
        console.log('database connected')
    } catch (error) {
        console.log('not connected')
    }
}