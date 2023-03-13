const fs = require('fs');
const Tour = require('./../models/tourModel');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

exports.checkId = (req, res, next, val) => {
  console.log(`Tour id is ${val}`);

  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  next();
};

exports.checkPostBody = (req, res, next) => {
  console.log(`Check post body`);
  console.log('req', req.body);

  if (!req.body.name || !req.body.price) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid body',
    });
  }

  next();
};

exports.getAlltours = (req, res) => {
  console.log('re', req.requestTime);
  res.status(200).json({
    status: 'success',
    requestAt: req.requestTime,
    results: tours.length,
    data: { tours },
  });
};

exports.getTour = (req, res) => {
  const id = +req.params.id;
  // const tour = tours.find((el) => el.id == id);

  res.status(200).json({ status: 'success', data: { tour } });
};

exports.createTour = (req, res) => {
  console.log('body', req.body);
  // const newId = tours[tours.length - 1].id + 1;
  const newTours = Object.assign({ id: newId }, req.body);
  // tours.push(newTours);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTours,
        },
      });
    }
  );
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'Update tours',
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
