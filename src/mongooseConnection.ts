import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import logger from './util/logger';

dotenv.config();

const MONGO_DB = process.env.MONGO_DB;
export const connectToMongoDB = async () => {
  try {
    await mongoose.connect(MONGO_DB || '');
    logger.info('Connected to the database');
  } catch (error) {
    logger.error('Error connecting to the database: ', error);
  }
};
