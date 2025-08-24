const mongoose = require('mongoose');

const recommendationSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: ['transportation', 'energy', 'food', 'shopping', 'waste', 'general'],
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    potentialImpact: {
      type: Number,
      default: 0,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    isImplemented: {
      type: Boolean,
      default: false,
    },
    source: {
      type: String,
      default: 'ai',
      enum: ['ai', 'system', 'community'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Recommendation', recommendationSchema);