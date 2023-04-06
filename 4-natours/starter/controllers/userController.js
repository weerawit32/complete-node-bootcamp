const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    result: users.length,
    data: { users },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  //1) Create error if user Post password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Plase use /updateMypassword',
        400
      )
    );
  }

  //2) update user document

  const updatedUser = await User.findByIdAndUpdate(req.user.id, {});
});

exports.getUser = (req, res) => {
  // res.status(500).json({
  //   status: 'error',
  //   message: 'This route is not yet defined!',
  // });
};
exports.createUser = (req, res) => {
  // res.status(500).json({
  //   status: 'error',
  //   message: 'This route is not yet defined!',
  // });
};
exports.updateUser = (req, res) => {
  // res.status(500).json({
  //   status: 'error',
  //   message: 'This route is not yet defined!',
  // });
};
exports.deleteUser = (req, res) => {
  // res.status(500).json({
  //   status: 'error',
  //   message: 'This route is not yet defined!',
  // });
};
