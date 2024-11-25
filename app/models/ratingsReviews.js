const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ratingsReviewsSchema = new Schema({
  leader_id: {
    type:Schema.Types.ObjectId,
    required: true,
  },
  citizen_id: {
    type:Schema.Types.ObjectId,
    required: true,
  },
  sosId: {
    type: String,
    required: true,
  },
  trustWorthy: {
    type: Number,
  },
  knowledgeable: {
    type: Number,
  },
  helpful: {
    type: Number,
  },
  available: {
    type: Number,
  },
  courageous: {
    type: Number,
  },
  efficient: {
    type: Number,
  },
  reviews: {
    type: String,
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('RatingsReviews', ratingsReviewsSchema);
