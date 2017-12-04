const express = require('express');

const users = require('../controllers/users');

const router = express.Router();

router.route('/signup')
  .get(users.getSignup)
  .post(users.postSignup);

module.exports = router;
