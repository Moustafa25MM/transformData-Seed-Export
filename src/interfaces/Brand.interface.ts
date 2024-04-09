import mongoose from 'mongoose';

export interface IBrand {
  _id?: mongoose.Types.ObjectId;
  brandName: string;
  yearFounded: number;
  headquarters: string;
  numberOfLocations: number;
  createdAt?: Date;
  updatedAt?: Date;
}
