// models/Entry.js
const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
    },
    prompt: {
      type: String,
      required: true,
      trim: true,
    },
    tag: {
      type: String,
      enum: ['hopeful', 'anxious', 'advice', 'reflective', 'other'],
      required: true,
    },
    
    timeframe: {
      type: String,
      default: 'sometime',
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Entry', entrySchema);

