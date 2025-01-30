import mongoose from 'mongoose';
import {config} from "../config/env";

const connectToDB = async (): Promise<void> => {
    try {

        await mongoose.connect(config.DB_URL);
        console.log('Successfully connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
};

export default connectToDB;
