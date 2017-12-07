$(document).ready(function() {
  var socket = io();

  $('#send-tweet').submit(function(e) {
    e.preventDefault();
    var content = $('#tweet').val();
    socket.emit('tweet', { content: content });
    $('#tweet').val('');
  });
});
