import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import BrandModel from '../models/Brand.model';

export const seedDatabase = async () => {
  try {
    for (let i = 0; i < 10; i++) {
      const brand = new BrandModel({
        brandName: faker.company.name(),
        yearFounded: faker.date
          .between({
            from: '1600-01-01',
            to: new Date().getFullYear().toString(),
          })
          .getFullYear(),
        headquarters: `${faker.location.city()}, ${faker.location.country()}`,
        numberOfLocations: faker.number.int({ min: 1, max: 10000 }),
      });

      await brand.save();
    }

    console.log('Database seeded!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
