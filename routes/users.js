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
router.get('/:id', users.getUserProfile);
router.post('/follow/:id', users.postFollowUser);

module.exports = router;
