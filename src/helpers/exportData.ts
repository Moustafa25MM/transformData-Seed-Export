import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';
import { IBrand } from '../interfaces/Brand.interface';
import BrandModel from '../models/Brand.model';

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
    console.log(`Exported data to ${filePath}`);
  } catch (error: any) {
    if (error.code === 'EBUSY') {
      console.error(
        'The file is busy or locked. Please close any programs that might be using it and try again.'
      );
    } else {
      console.error('An error occurred:', error);
    }
  }
};
