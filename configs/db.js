import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', ()=>console.log('database connect'))
        await mongoose.connect(`${process.env.MONGODB_URI}/Mernstack`)
    } catch (error) {
        console.log(error.message)
    }
}

export default connectDB