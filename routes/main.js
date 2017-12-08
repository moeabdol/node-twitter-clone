const express = require('express');

const Tweet = require('../models/tweet');

const router = express.Router();

router.get('/', (req, res, next) => {
  if (req.user) {
    Tweet.find()
      .sort('-createdAt')
      .populate('owner')
      .then(tweets => res.render('home', { tweets }))
      .catch(err => next(err));
  } else {
    res.render('landing');
  }
});

module.exports = router;
