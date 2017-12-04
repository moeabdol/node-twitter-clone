const express = require('express');

const users = require('../controllers/users');

const router = express.Router();

router.route('/signup')
  .get(users.getSignup)
  .post(users.postSignup);

router.route('/signin')
  .get(users.getSignin)
  .post(users.postSignin);

router.get('/signout', users.getSignout);

module.exports = router;
