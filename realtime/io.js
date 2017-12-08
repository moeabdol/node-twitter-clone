const async = require('async');

const Tweet = require('../models/tweet');
const User = require('../models/user');

module.exports = io => {
  io.on('connection', (socket) => {
    const user = socket.request.user;

    socket.on('tweet', data => {
      async.parallel([
        () => io.emit('incomingTweets', { data, user }),
        () => async.waterfall([
          callback => {
            const newTweet = new Tweet();
            newTweet.content = data.content;
            newTweet.owner = user._id;
            newTweet.save()
              .then(tweet => callback(null, tweet))
              .catch(err => callback(err, null));
          },
          (tweet, callback) => {
            User.update({ _id: user._id }, { $push: { tweets: tweet._id }})
              .then(count => callback(null, count))
              .catch(err => callback(err, null));
          }
        ])
      ]);
    });
  });
};
