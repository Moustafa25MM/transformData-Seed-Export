# Restaurant Brands Data Transformation and Seeding

This project is designed to standardize a MongoDB collection of restaurant brands and extend the dataset with new seed data. It includes scripts to transform data to a correct format, seed the database with new documents, and export the updated collection to an Excel file and Json file.

## Project Structure

- `data/`:
  - `brands.json`: Initial dataset of restaurant brands with potential format inconsistencies. This file serves as the input for the data transformation process.
  - `modifiedBrands.json`: Output file from MongoDB that contains the transformed data in the correct format, along with any new seed data that has been added.
- `reports/`: The directory where exported Excel and Json files are saved.
- `src/helpers/`: Contains utility functions for data transformation, seeding, and exporting.
- `src/interfaces/`: TypeScript interfaces for the brand model and extra fields.
- `src/models/`: Mongoose model for the brand collection.
- `src/mongooseConnection.ts`: Sets up the MongoDB connection using Mongoose.
- `src/util/`: Contails Winston logger middleware to use instead of `console.log`.

## Running the Project

Before starting the project, make sure MongoDB is running. Then create a `.env` file similar to the `.envExample` file and add your MongoDB connection string:

```plaintext
MONGO_DB=your_mongodb_connection
```

To install dependencies and build the project, run the following commands:

```bash
npm install
npm build
```

To start the application, use:

```bash
npm start --> This will run the built app
```

## Project Details

- Data Transformation
  The transformData function takes the existing documents in the MongoDB collection and transforms them in place to match the provided schema. It addresses inconsistencies such as incorrect field names and types.

- Data Seeding
  The seedDatabase function generates new brand documents using the Faker.js library to create realistic test data. Each document adheres to the schema defined in brands-schema.ts.

- Exporting Data
  The exportToExcel & exportToJson function takes the transformed and seeded data from the MongoDB collection and exports it to an Excel file & Json file. The files are saved in the reports/ directory.

- Notes
  All transformations and seeding are performed within the same MongoDB collection and database.

## Usage

### Transforming Data

To standardize and correct the format of the existing data in your MongoDB collection, run the data transformation script:

```bash
npm run transform:data
```

### Seeding the Database

To add new brand documents to your MongoDB collection, use the seed script:

```bash
npm run seed
```

### Exporting Data

To export the current state of the MongoDB collection to an Excel file and Json file, you can run the export script:

```bash
npm run export
```
