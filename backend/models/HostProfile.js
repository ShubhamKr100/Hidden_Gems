// backend/models/HostProfile.js

const mongoose = require('mongoose');

const hostProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  kitchenName: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  images: [{ type: String }],
  rating: { type: Number, required: true, default: 0 },
  numReviews: { type: Number, required: true, default: 0 },
  offersMeal: { type: Boolean, default: false },
  mealPrice: { type: Number, default: 0 },
  mealDescription: { type: String },
  offersStay: { type: Boolean, default: false },
  stayPrice: { type: Number, default: 0 },
  stayDescription: { type: String },
}, { timestamps: true });

const HostProfile = mongoose.model('HostProfile', hostProfileSchema);
module.exports = HostProfile;