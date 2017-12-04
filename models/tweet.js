const mongoose = require('../config/mongoose');

const Schema = mongoose.Schema;

const TweetSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  content: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tweet', TweetSchema);
