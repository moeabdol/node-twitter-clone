module.exports = io => {
  io.on('connection', (socket) => {
    console.log('Socket connected');
    const user = socket.request.user;
    console.log(user.name);

    socket.on('tweet', data => {
      console.log(data);
      io.emit('incomingTweets', { data, user });
    });
  });
};
