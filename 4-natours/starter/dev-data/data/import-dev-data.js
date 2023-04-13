const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('./../../models/tourModel');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<password>', process.env.PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log('DB connectino successfull');
  });

// Read JSon file

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

// import data into DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('success loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// Delete all data from DB

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('success delete');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
