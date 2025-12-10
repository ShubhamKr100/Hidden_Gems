// backend/models/Review.js
const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    // Which host is being reviewed
    host: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'HostProfile',
    },
    // Which user wrote the review
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    // User's name (to display with the review)
    name: { type: String, required: true },
    rating: { type: Number, required: true }, // Rating from 1 to 5
    comment: { type: String, required: true },
    // Optional: Could add 'traveler_review' if hosts can review travelers later
    reviewType: { type: String, default: 'host_review' },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;