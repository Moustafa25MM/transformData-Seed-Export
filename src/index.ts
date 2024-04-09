import { exportToExcel, exportToJson } from './helpers/exportData';
import { seedDatabase } from './helpers/seedData';
import { transformData } from './helpers/transformData';
import { connectToMongoDB } from './mongooseConnection';

connectToMongoDB().then(async () => {
  await transformData();
  await seedDatabase();
  await exportToExcel();
  await exportToJson();
});
