import mongoose from 'mongoose';
const { Schema } = mongoose;

const metaSchema = new Schema({
  product_id: String,
  ratings: {
    '1': String,
    '2': String,
    '3': String,
    '4': String,
    '5': String
  },
  recommended: {
    false: String,
    true: String
  },
  characteristics: {
    Fit: {
      id: Number,
      value: String
    },
    Length: {
      id: Number,
      value: String
    },
    Comfort: {
      id: Number,
      value: String
    },
    Quality: {
      id: Number,
      value: String
    }
  }
});