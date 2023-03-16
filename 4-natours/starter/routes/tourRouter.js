const express = require('express');
const {
  getAlltours,
  getTour,
  deleteTour,
  updateTour,
  createTour,
} = require('../controllers/tourController');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

const router = express.Router();

// Create a checkBody middleware
// Check if body contain the name and price property
// If not sent back 400(bad request)

router.route('/').get(getAlltours).post(createTour);

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);
// router.param('id', checkId);

module.exports = router;
