const mongoose = require('../config/mongoose');
const bcrypt   = require('bcrypt');
const crypto   = require('crypto');

const SALT_FACTOR = 10;
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

UserSchema.pre('save', function(next) {
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(SALT_FACTOR)
      .then(salt => {
        bcrypt.hash(this.password, salt)
          .then(hash => {
            this.password = hash;
            next();
          })
          .catch(err => next(err));
      })
      .catch(err => next(err));
  } else {
    next();
  }
});

UserSchema.methods.gravatar = function(size) {
  if (!size) size = 200;
  const md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return `https://gravatar.com/avatar/${md5}?s=${size}$d=retro`;
};

UserSchema.methods.comparePassword = function(password, done) {
  bcrypt.compare(password, this.password)
    .then(isMatch => done(null, isMatch))
    .catch(err => done(err));
};

module.exports = mongoose.model('User', UserSchema);
