const express = require('express');
const reviewRouter = require('../routes/reviewRouter');
const {
  getAlltours,
  getTour,
  deleteTour,
  updateTour,
  createTour,
  alistTopTours,
  getTourStats,
  getMonthlyPlan,
} = require('../controllers/tourController');

// const { createReview } = require('../controllers/reviewController');

const { protect, restrictTo } = require('../controllers/authController');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

const router = express.Router();

// POST/tours/234fad4/reviews
// GET/tours/234fad4/reviews
// GET/tours/234fad4/reviews/asdwd
// router

router.use('/:tourId/reviews', reviewRouter);

// Create a checkBody middleware
// Check if body contain the name and price property
// If not sent back 400(bad request)

router.route('/top-5-cheap').get(alistTopTours, getAlltours);

router.route('/tour-stats').get(getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    protect,
    restrictTo('admin', 'lead-guide', 'normal-guide'),
    getMonthlyPlan
  );

router
  .route('/')
  .get(getAlltours)
  .post(protect, restrictTo('admin', 'lead-guide'), createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(protect, restrictTo('admin', 'lead-guide'), updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);
// router.param('id', checkId);

module.exports = router;
