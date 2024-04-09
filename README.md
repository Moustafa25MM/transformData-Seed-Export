# Restaurant Brands Data Transformation and Seeding

This project is designed to standardize a MongoDB collection of restaurant brands and extend the dataset with new seed data. It includes scripts to transform data to a correct format, seed the database with new documents, and export the updated collection to an Excel file.

## Project Structure

- `src/helpers/`: Contains utility functions for data transformation, seeding, and exporting.
- `src/interfaces/`: TypeScript interfaces for the brand model and extra fields.
- `src/models/`: Mongoose model for the brand collection.
- `src/mongooseConnection.ts`: Sets up the MongoDB connection using Mongoose.
- `reports/`: The directory where exported Excel files are saved.
- `src/util/`: Contails Winston logger middleware to use instead of console.log

## Running the Project

To run the project, ensure that you have MongoDB running,
Then create .env file similar to .envExample file and add
MONGO_DB=your_mongodb_connection

Then run the following commands:

```bash
npm install
npm start

```

## Project Details

- Data Transformation
  The transformData function takes the existing documents in the MongoDB collection and transforms them in place to match the provided schema. It addresses inconsistencies such as incorrect field names and types.

- Data Seeding
  The seedDatabase function generates new brand documents using the Faker.js library to create realistic test data. Each document adheres to the schema defined in brands-schema.ts.

- Exporting Data
  The exportToExcel function takes the transformed and seeded data from the MongoDB collection and exports it to an Excel file. The file is saved in the reports/ directory.

- Notes
  All transformations and seeding are performed within the same MongoDB collection and database.
