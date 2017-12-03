const express = require('express');

const router = express.Router();

const users = require('../controllers/users');

router.get('/new', users.newUser);

module.exports = router;
