const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

module.exports = function(passport) {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallBack: true
  }, (email, password, done) => {
    User.findOne({ email: email })
      .then(user => {
        if (!user) return done(null, false, {
          message: 'User not found!'
        });

        user.comparePassword(password, (err, isMatch) => {
          if (err) return console.log(err);

          if (!isMatch) return done(null, false, {
            message: 'Password is incorrect!'
          });

          done(null, user, { message: 'Signed in successfully.' });
        });
      })
      .catch(err => done(err));
  }));
};
