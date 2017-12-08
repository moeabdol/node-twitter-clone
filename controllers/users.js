const passport = require('passport');
const async = require('async');

const User = require('../models/user');
const Tweet = require('../models/tweet');

const getSignup = (req, res) => {
  res.render('users/signup');
};

const postSignup = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        req.flash('error', 'Email already exists!');
        return res.redirect('/users/signup');
      }

      const newUser = new User();
      newUser.name = req.body.name;
      newUser.email = req.body.email;
      newUser.password = req.body.password;
      newUser.photo = newUser.gravatar();

      newUser.save()
        .then(user => {
          req.logIn(user, err => {
            if (err) return next(err);

            req.flash('success', 'User created successfully');
            res.redirect('/');
          });
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
};

const getSignin = (req, res) => {
  if (req.user) return res.redirect('/');

  res.render('users/signin');
};

const postSignin = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/signin',
  successFlash: true,
  failureFlash: true
});

const getSignout = (req, res) => {
  req.logout();
  req.flash('success', 'Signed out successfully');
  res.redirect('/');
};

const getUserProfile = (req, res, next) => {
  async.waterfall([
    callback => {
      Tweet.find({ owner: req.params.id })
        .populate('owner')
        .then(tweets => callback(null, tweets))
        .catch(err => next(err));
    },

    tweets => {
      User.findById(req.params.id)
        .populate('following')
        .populate('followers')
        .then(user => res.render('users/profile', { foundUser: user, tweets }))
        .catch(err => next(err));
    }
  ]);
};

module.exports = {
  getSignup,
  postSignup,
  getSignin,
  postSignin,
  getSignout,
  getUserProfile
};
