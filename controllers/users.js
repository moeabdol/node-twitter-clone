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
        .then(user => {
          let currentUser = false;
          if (req.user._id.equals(user._id)) currentUser = true;

          const follower = user.followers.some(friend => {
            return friend.equals(req.user._id);
          });

          res.render('users/profile', {
            foundUser: user,
            tweets,
            currentUser,
            follower
          });
        })
        .catch(err => next(err));
    }
  ]);
};

const postFollowUser = (req, res, next) => {
  async.parallel([
    callback => {
      User.update({ _id: req.user._id, following: { $ne: req.params.id }},
        { $push: { following: req.params.id }})
        .then(() => callback())
        .catch(err => next(err));
    },
    callback => {
      User.update({ _id: req.params.id, followers: { $ne: req.user._id }},
        { $push: { followers: req.user._id }})
        .then(() => callback())
        .catch(err => next(err));
    }
  ], err => {
    if (err) return next(err);
    res.status(200).json('Success');
  });
};

const postUnfollowUser = (req, res, next) => {
  async.parallel([
    callback => {
      User.update({ _id: req.user._id },
        { $pull: { following: req.params.id }})
        .then(() => callback())
        .catch(err => next(err));
    },
    callback => {
      User.update({ _id: req.params.id },
        { $pull: { followers: req.user._id }})
        .then(() => callback())
        .catch(err => next(err));
    }
  ], err => {
    if (err) return next(err);
    res.status(200).json('Success');
  });
};

module.exports = {
  getSignup,
  postSignup,
  getSignin,
  postSignin,
  getSignout,
  getUserProfile,
  postFollowUser,
  postUnfollowUser
};
