const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  if (req.user) {
    res.render('home');
  } else {
    res.render('landing');
  }
});

module.exports = router;
