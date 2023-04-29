const express = require('express');
const {
  getAllReviews,
  createReview,
  deleteReview,
  updateReview,
  addUserAndTourId,
  getReview,
} = require('../controllers/reviewController');
const { restrictTo, protect } = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(protect);

// POST/tours/234fad4/reviews
router
  .route('/')
  .get(getAllReviews)
  .post(restrictTo('user'), addUserAndTourId, createReview);

router
  .route('/:id')
  .get(getReview)
  .delete(restrictTo('user', 'admin'), deleteReview)
  .patch(restrictTo('user', 'admin'), updateReview);

module.exports = router;
