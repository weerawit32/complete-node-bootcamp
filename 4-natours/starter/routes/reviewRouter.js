const express = require('express');
const {
  getAllReviews,
  createReview,
  deleteReview,
} = require('../controllers/reviewController');
const { restrictTo, protect } = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

// POST/tours/234fad4/reviews
router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), createReview);

router.route('/:id').delete(deleteReview);

module.exports = router;
