const User = require('../models/user');

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
        .then(() => {
          req.flash('success', 'User created successfully');
          res.redirect('/');
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
};

module.exports = {
  getSignup,
  postSignup
};
