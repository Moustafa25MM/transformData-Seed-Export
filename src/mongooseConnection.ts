import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const MONGO_DB = process.env.MONGO_DB;
export const connectToMongoDB = async () => {
  try {
    await mongoose.connect(MONGO_DB || '');
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database: ', error);
  }
};
