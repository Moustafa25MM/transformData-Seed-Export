import mongoose from 'mongoose';
import { IBrand } from '../interfaces/Brand.interface';
import BrandModel from '../models/Brand.model';
import { IBrandExtraFields } from '../interfaces/ExtraBrand.interface';


export async function transformData(): Promise<void> {
  try {
    const brands = await BrandModel.find({}).lean<IBrandExtraFields[]>();

    for (const brand of brands) {

        const update: Partial<IBrand> = {};
        const unset: Record<string, ''> = {};

        if(brand.brandName){
            update.brandName = brand.brandName;
        }else if( brand.brand && typeof brand.brand == 'object' && brand.brand.name){
            update.brandName = brand.brand.name;
        }
        unset.brand = '';

        const possibleYear = brand.yearCreated || brand.yearsFounded || brand.yearFounded;
        if (typeof possibleYear === 'string') {
          update.yearFounded = parseInt(possibleYear, 10);
        } else if (typeof possibleYear === 'number') {
          update.yearFounded = possibleYear;
        }
        if (!update.yearFounded || isNaN(update.yearFounded) || update.yearFounded < 1600) {
          update.yearFounded = 1600; 
        }
  
        unset.yearCreated = ''; 
        unset.yearsFounded = ''; 
        
        if(brand.headquarters){
            update.headquarters = brand.headquarters;
        }else if(brand.hqAddress){
            update.headquarters = brand.hqAddress;
        }
        unset.hqAddress = ''; 
        
        let numLocations = parseInt(brand.numberOfLocations as any, 10);
        if (isNaN(numLocations) || numLocations < 1) {
          numLocations = 1; 
        }
        update.numberOfLocations = numLocations;
  
        const validationError = new BrandModel(update).validateSync();
        if (validationError) {
          console.error(`Validation error for brand _id: ${brand._id}`, validationError);
          continue; 
        }
        const currentDate = new Date();
        const updateOps: any = {
            $set: update,
            $unset: unset,
            $currentDate: { updatedAt: true }
          };
        if (!brand.createdAt) {
        updateOps.$set.createdAt = currentDate;
        }
        await mongoose.connection.collection('brands').updateOne(
            { _id: brand._id },
            updateOps,
            { writeConcern: { w: "majority" } }
          );
        
    }   

    console.log('Data transformation complete');
  } catch (error) {
    console.error('Error during data transformation:', error);
  }
}