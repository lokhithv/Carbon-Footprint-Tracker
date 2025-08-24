const mongoose = require('mongoose');

const footprintSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: ['transportation', 'energy', 'food', 'shopping', 'waste', 'other'],
    },
    activity: {
      type: String,
      required: [true, 'Please add an activity'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    carbonEmission: {
      type: Number,
      required: [true, 'Please add carbon emission value'],
    },
    unit: {
      type: String,
      default: 'kg CO2e',
    },
    details: {
      type: Object,
      default: {},
    },
    source: {
      type: String,
      default: 'manual',
      enum: ['manual', 'api', 'ai-estimated'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Footprint', footprintSchema);