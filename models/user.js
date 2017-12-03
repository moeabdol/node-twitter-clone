const mongoose = require('../config/mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  photo: { type: String },
  tweets: [{
    tweet: { type: Schema.Types.ObjectId, ref: 'Tweet' }
  }]
});

module.exports = mongoose.model('User', UserSchema);
