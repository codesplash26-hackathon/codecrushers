const Disruption = require('../models/Disruption');

exports.getActiveDisruptions = async (req, res, next) => {
  try {
    const disruptions = await Disruption.find({ status: 'ACTIVE' });
    res.status(200).json(disruptions);
  } catch (err) {
    next(err);
  }
};

exports.reportDisruption = async (req, res, next) => {
  try {
    const newDisruption = await Disruption.create(req.body);
    res.status(201).json(newDisruption);
  } catch (err) {
    next(err);
  }
};
