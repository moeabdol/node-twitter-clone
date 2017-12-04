module.exports = io => {
  io.on('connection', () => {
    console.log('Socket connected');
  });
};
