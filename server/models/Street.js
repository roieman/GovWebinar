const mongoose = require('mongoose');

const streetSchema = new mongoose.Schema({
  cityCode: Number,
  cityName: { type: String, index: true },
  streetCode: Number,
  streetName: String,
});

streetSchema.index({ cityName: 1, streetName: 1 });

module.exports = mongoose.model('Street', streetSchema);
