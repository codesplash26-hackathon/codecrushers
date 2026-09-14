const Route = require('../models/Route');

exports.getAllRoutes = async (req, res, next) => {
  try {
    const routes = await Route.find();
    res.status(200).json(routes);
  } catch (err) {
    next(err);
  }
};

exports.createRoute = async (req, res, next) => {
  try {
    const newRoute = await Route.create(req.body);
    res.status(201).json(newRoute);
  } catch (err) {
    next(err);
  }
};
