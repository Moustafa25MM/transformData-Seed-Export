import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';
import { IBrand } from '../interfaces/Brand.interface';
import BrandModel from '../models/Brand.model';
import logger from '../util/logger';
import { connectToMongoDB } from '../mongooseConnection';

export const exportToExcel = async () => {
  try {
    const brands = await BrandModel.find({});

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Brands');

    worksheet.columns = [
      { header: 'ID', key: '_id', width: 28 },
      { header: 'Brand Name', key: 'brandName', width: 32 },
      { header: 'Year Founded', key: 'yearFounded', width: 15 },
      { header: 'Headquarters', key: 'headquarters', width: 32 },
      { header: 'Number of Locations', key: 'numberOfLocations', width: 20 },
      { header: 'Created At', key: 'createdAt', width: 24 },
      { header: 'Updated At', key: 'updatedAt', width: 24 },
    ];

    brands.forEach((brand: IBrand) => {
      worksheet.addRow({
        _id: brand._id?.toString(),
        brandName: brand.brandName,
        yearFounded: brand.yearFounded,
        headquarters: brand.headquarters,
        numberOfLocations: brand.numberOfLocations,
        createdAt: brand.createdAt?.toISOString(),
        updatedAt: brand.updatedAt?.toISOString(),
      });
    });

    const reportsDir = path.join(__dirname, '../../reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const excelFileName = 'ModifiedBrands.xlsx';
    const filePath = path.join(reportsDir, excelFileName);

    await workbook.xlsx.writeFile(filePath);
    logger.info(`Exported data to ${filePath}`);
  } catch (error: any) {
    if (error.code === 'EBUSY') {
      logger.error(
        'The file is busy or locked. Please close any programs that might be using it and try again.'
      );
    } else {
      logger.error('An error occurred:', error);
    }
  }
};

export const exportToJson = async () => {
  try {
    const brands = await BrandModel.find({});
    const brandsData = JSON.stringify(brands, null, 2);

    const reportsDir = path.join(__dirname, '../../reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const jsonFileName = 'ModifiedBrands.json';
    const filePath = path.join(reportsDir, jsonFileName);

    fs.writeFileSync(filePath, brandsData);
    logger.info(`Exported data to ${filePath}`);
  } catch (error: any) {
    logger.error('An error occurred while exporting to JSON:', error);
  }
};

if (require.main === module) {
  connectToMongoDB().then(() => {
    exportToExcel()
      .then(() => {
        logger.info(`Excel export complete. Starting JSON export...`);
        return exportToJson();
      })
      .then(() => {
        logger.info(
          `JSON export complete. Data Exported Using Script Successfully.`
        );
      })
      .catch((error) => {
        if (error.code === 'EBUSY') {
          logger.error(
            'The file is busy or locked. Please close any programs that might be using it and try again.'
          );
        } else {
          logger.error('An error occurred when using script:', error);
        }
      });
  });
}
