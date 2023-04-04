const express = require('express');
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

const { protect, restrictTo } = require('../controllers/authController');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

const router = express.Router();

// Create a checkBody middleware
// Check if body contain the name and price property
// If not sent back 400(bad request)

router.route('/top-5-cheap').get(alistTopTours, getAlltours);

router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.route('/').get(protect, getAlltours).post(createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);
// router.param('id', checkId);

module.exports = router;
