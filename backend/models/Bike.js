const mongoose = require('mongoose');

const bikeSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
    unique: true,
  },
  models: [{
    type: String,
    required: true,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

bikeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Bike', bikeSchema);