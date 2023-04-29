const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('./../../models/tourModel');
const Users = require('../../models/userModel');
const Reviews = require('../../models/reviewModel');
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
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

// import data into DB
const importData = async () => {
  try {
    await Tour.create(tours);
    await Users.create(users, { validateBeforeSave: false });
    await Reviews.create(reviews);
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
    await Users.deleteMany();
    await Reviews.deleteMany();
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
