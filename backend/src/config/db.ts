import mongoose from 'mongoose'
import {MONGO_URI} from '../constants//env'

const connectToDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('DB connected');
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
}

export default connectToDB;