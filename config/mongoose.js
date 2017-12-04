const mongoose = require('mongoose');

const config = require('./');

mongoose.Promise = global.Promise;

mongoose.connect(config.db, { useMongoClient: true }, (err) => {
  if (err) return console.log(err);
  console.log('Connected to database', config.db);
});

module.exports = mongoose;
