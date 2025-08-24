const asyncHandler = require('express-async-handler');
const Footprint = require('../models/footprintModel');


const getFootprints = asyncHandler(async (req, res) => {
  const footprints = await Footprint.find({ user: req.user.id });
  res.status(200).json(footprints);
});


const addFootprint = asyncHandler(async (req, res) => {
  if (!req.body.category || !req.body.activity || !req.body.carbonEmission) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const footprint = await Footprint.create({
    user: req.user.id,
    category: req.body.category,
    activity: req.body.activity,
    date: req.body.date || Date.now(),
    carbonEmission: req.body.carbonEmission,
    unit: req.body.unit || 'kg CO2e',
    details: req.body.details || {},
    source: req.body.source || 'manual',
  });

  res.status(201).json(footprint);
});

const updateFootprint = asyncHandler(async (req, res) => {
  const footprint = await Footprint.findById(req.params.id);

  if (!footprint) {
    res.status(404);
    throw new Error('Footprint not found');
  }

  
  if (footprint.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedFootprint = await Footprint.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedFootprint);
});


const deleteFootprint = asyncHandler(async (req, res) => {
  const footprint = await Footprint.findById(req.params.id);

  if (!footprint) {
    res.status(404);
    throw new Error('Footprint not found');
  }


  if (footprint.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await footprint.deleteOne();

  res.status(200).json({ id: req.params.id });
});


const getFootprintSummary = asyncHandler(async (req, res) => {

  const totalFootprint = await Footprint.aggregate([
    { $match: { user: req.user._id } },
    { $group: { _id: null, total: { $sum: '$carbonEmission' } } },
  ]);


  const footprintByCategory = await Footprint.aggregate([
    { $match: { user: req.user._id } },
    { $group: { _id: '$category', total: { $sum: '$carbonEmission' } } },
    { $sort: { total: -1 } },
  ]);

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const footprintByMonth = await Footprint.aggregate([
    {
      $match: {
        user: req.user._id,
        date: { $gte: sixMonthsAgo },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
        total: { $sum: '$carbonEmission' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json({
    total: totalFootprint.length > 0 ? totalFootprint[0].total : 0,
    byCategory: footprintByCategory,
    byMonth: footprintByMonth,
  });
});



module.exports = {
  getFootprints,
  addFootprint,
  updateFootprint,
  deleteFootprint,
  getFootprintSummary,
};