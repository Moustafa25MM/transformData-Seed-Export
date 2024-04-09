import mongoose from 'mongoose';
import { IBrand } from '../interfaces/Brand.interface';
import BrandModel from '../models/Brand.model';
import { IBrandExtraFields } from '../interfaces/ExtraBrand.interface';
import logger from '../util/logger';

export async function transformData(): Promise<void> {
  try {
    const brands = await BrandModel.find({}).lean<IBrandExtraFields[]>();

    for (const brand of brands) {
      const updatedBrandFields: Partial<IBrand> = {};
      const fieldsToRemove: Record<string, ''> = {};

      if (brand.brandName) {
        updatedBrandFields.brandName = brand.brandName;
      } else if (
        brand.brand &&
        typeof brand.brand == 'object' &&
        brand.brand.name
      ) {
        updatedBrandFields.brandName = brand.brand.name;
      }
      fieldsToRemove.brand = '';

      const possibleYear =
        brand.yearCreated || brand.yearsFounded || brand.yearFounded;
      if (typeof possibleYear === 'string') {
        updatedBrandFields.yearFounded = parseInt(possibleYear, 10);
      } else if (typeof possibleYear === 'number') {
        updatedBrandFields.yearFounded = possibleYear;
      }
      if (
        !updatedBrandFields.yearFounded ||
        isNaN(updatedBrandFields.yearFounded) ||
        updatedBrandFields.yearFounded < 1600
      ) {
        updatedBrandFields.yearFounded = 1600;
      }

      fieldsToRemove.yearCreated = '';
      fieldsToRemove.yearsFounded = '';

      if (brand.headquarters) {
        updatedBrandFields.headquarters = brand.headquarters;
      } else if (brand.hqAddress) {
        updatedBrandFields.headquarters = brand.hqAddress;
      }
      fieldsToRemove.hqAddress = '';

      let numLocations = parseInt(brand.numberOfLocations as any, 10);
      if (isNaN(numLocations) || numLocations < 1) {
        numLocations = 1;
      }
      updatedBrandFields.numberOfLocations = numLocations;

      const validationError = new BrandModel(updatedBrandFields).validateSync();
      if (validationError) {
        logger.error(
          `Validation error for brand _id: ${brand._id}`,
          validationError
        );
        continue;
      }
      const currentDate = new Date();
      const updateOps: any = {
        $set: updatedBrandFields,
        $unset: fieldsToRemove,
        $currentDate: { updatedAt: true },
      };
      if (!brand.createdAt) {
        updateOps.$set.createdAt = currentDate;
      }
      await mongoose.connection
        .collection('brands')
        .updateOne({ _id: brand._id }, updateOps, {
          writeConcern: { w: 'majority' },
        });
    }

    logger.info('Data transformation complete');
  } catch (error) {
    logger.error('Error during data transformation:', error);
  }
}
