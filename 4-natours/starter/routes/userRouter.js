const express = require('express');
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
} = require('../controllers/userController');

const {
  signup,
  login,
  protect,
  forgotPassword,
  resetPassword,
  updatePassword,
  restrictTo,
} = require('../controllers/authController');

const { createReview } = require('../controllers/reviewController');

const router = express.Router();

router.get('/me', protect, getMe, getUser);

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

// Protect all route after this middleware
router.use(protect);
router.patch('/updateMyPassword', updatePassword);

router.patch('/updateMe', updateMe);
router.patch('/deleteMe', deleteMe);

// Protect all route after this middleware from only admin
router.use(restrictTo('admin'));

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
