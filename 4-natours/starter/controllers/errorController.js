const AppErorr = require('../utils/appError');
const AppError = require('../utils/appError');

const handleCaseErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;

  return new AppError(message, 400);
};

const handleDuplicateDM = (err) => {
  console.log('err', err);
  const value = err.keyValue.name;
  const message = `Duplicate field value ${value}. Please use another value`;
  return new AppErorr(message, 400);
};

const handlerValidationErrorDB = (err) => {
  const errors = Object.values(err.errors)
    .map((el) => el.message)
    .join('. ');

  console.log('long', err.errors);
  const message = `Invalid input data. ${errors}`;

  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};
const sendErrorProduction = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    // console.log('err', err);
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // Programing or oher unknow error: dont leak error details
  } else {
    // 1) Log error
    // console.error('error', err);
    // 2)send generic message
    res.status(500).json({
      status: 'error',
      message: 'Somethind went very wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  console.log('errr dev', err);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // let error = { ...err }; // dont work
    let error = JSON.parse(JSON.stringify(err));

    // console.log('name', error.name);

    if (error.name === 'CastError') {
      error = handleCaseErrorDB(error);
    }

    if (error.code === 11000) {
      error = handleDuplicateDM(error);
    }

    if (error.name === 'ValidationError') {
      error = handlerValidationErrorDB(error);
    }
    sendErrorProduction(error, res);
  }
};
