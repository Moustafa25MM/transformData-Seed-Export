import { Document } from 'mongoose';

export interface IBrand extends Document {
    brandName: string;
    yearFounded: number;
    headquarters: string;
    numberOfLocations: number;
}