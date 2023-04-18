const Tour = require('./../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

exports.alistTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingAverage,summary,difficulty';

  next();
};

exports.getAlltours = catchAsync(async (req, res, next) => {
  // const queryObj = { ...req.query };
  // // deep clone

  // // normal filtering
  // const excludedFields = ['page', 'sort', 'limit', 'fields'];
  // excludedFields.forEach((el) => delete queryObj[el]);

  // console.log(queryObj);

  // // advanc fitlering
  // let queryStr = JSON.stringify(queryObj);
  // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)|b/g, (match) => `$${match}`);
  // console.log(JSON.parse(queryStr));

  // let query = Tour.find(JSON.parse(queryStr));

  // console.log(await query);

  // sorting
  // if (req.query.sort) {
  //   const sortBy = req.query.sort.split(',').join(' ');
  //   console.log('sortBy', sortBy);
  //   query = query.sort(sortBy);
  //   // sort('price ratingAverage')
  // } else {
  //   query = query.sort('-createdAt');
  // }

  // Field limiting
  // if (req.query.fields) {
  //   const fields = req.query.fields.split(',').join(' ');
  //   query = query.select(fields);
  // } else {
  //   query = query.select('-__v');
  // }

  // Pagination
  // const page = req.query.page * 1 || 1;
  // const limit = req.query.limit * 1 || 100;
  // const skip = (page - 1) * limit;
  // query = query.skip(skip).limit(limit);

  // if (req.query.page) {
  //   const numTours = await Tour.countDocuments();
  //   if (skip >= numTours) throw new Error('This page does not exsit');
  // }

  // Excute query
  const features = new APIFeatures(Tour, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;

  res.status(200).json({
    status: 'success',
    requestAt: req.requestTime,
    results: tours.length,
    data: tours,
  });
});

// const catchAsync = (fn) => {
//   return (req, res, next) => {
//     fn(req, res, next).catch((err) => next(err));
//   };
// };

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate('reviews');

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(200).json({ status: 'success', data: { tour } });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
  // try {
  //   });
  // } catch (err) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: err,
  //   });
  // }
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);

//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }

//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// });

exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        // _id: '$rating',
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingQuantity' },
        avgRating: { $avg: '$ratingAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    { $sort: { avgPrice: 1 } },
    // { $match: { _id: { $ne: 'EASY' } } },
  ]);

  res.status(200).json({
    status: 'success',
    data: stats,
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.years * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    // {
    //   $match: {
    //     ratingAverage: {
    //       $eq: 4.5,
    //     },
    //     startDates: {
    //       $gte: new Date(`${year}-01-01`),
    //       $lte: new Date(`${year}-12-31`),
    //     },
    //   },
    // },
  ]);

  res.status(200).json({
    status: 'success',
    data: plan,
  });
});
