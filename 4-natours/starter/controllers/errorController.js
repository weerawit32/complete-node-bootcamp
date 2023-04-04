const AppErorr = require('../utils/appError');
const AppError = require('../utils/appError');

const handleCaseErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;

  return new AppError(message, 400);
};

const handleDuplicateDM = (err) => {
  const value = err.keyValue.name;
  const message = `Duplicate field value ${value}. Please use another value`;
  return new AppErorr(message, 400);
};

const handlerValidationErrorDB = (err) => {
  const errors = Object.values(err.errors)
    .map((el) => el.message)
    .join('. ');

  const message = `Invalid input data. ${errors}`;

  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppErorr('Invalid token. Please login again', 401);

const handleJWTExpiredError = () =>
  new AppErorr('Your token has expired. Please login again', 401);
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
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // Programing or oher unknow error: dont leak error details
  } else {
    console.error('ERROR', err);
    // 1) Log error
    // 2)send generic message
    res.status(500).json({
      status: 'error',
      message: 'Somethind went very wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  // console.log('errr dev', err);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  console.log('name', err.name);

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

    if (error.name === 'JsonWebTokenError') {
      error = handleJWTError();
    }
    if (error.name === 'TokenExpiredError') {
      error = handleJWTExpiredError();
    }

    sendErrorProduction(error, res);
  }
};
