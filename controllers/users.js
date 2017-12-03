const User = require('../models/user');

const newUser = (req, res, next) => {
  const newUser = new User({
    email: 'user@email.com',
    name: 'Jack',
    password: 'hello',
  });

  newUser.save()
    .then(user => res.status(201).json(user))
    .catch(err => next(err));
};

module.exports = {
  newUser
};
