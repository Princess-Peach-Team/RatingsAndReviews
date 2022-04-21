import mongoose from 'mongoose';
const { Schema } = mongoose;

const ratingsAndReviewsSchema = new Schema({
  product: String,
  page: Number,
  count: Number,
  results: [
    {
      review_id: Number,
      rating: Number,
      summary: String,
      recommend: Boolean,
      response: String,
      body: String,
      date: Date,
      reviewer_name: String,
      helpfulness: Number,
      photos: [
        {
          id: Number,
          url: String
        }
      ]
    }
  ]
});

export default ratingsAndReviewsSchema;