$(document).ready(function() {
  var socket = io();

  $('#send-tweet').submit(function(e) {
    e.preventDefault();

    var content = $('#tweet').val();
    socket.emit('tweet', { content: content });
    $('#tweet').val('');
  });

  socket.on('incomingTweets', function(data) {
    var html = '';
    html += '<div class="media">';
    html += `<a href="/users/${data.user._id}" class="pr-3">`;
    html += `<img src="${data.user.photo}" alt="">`;
    html += '</a>';
    html += '<div class="media-body">';
    html += `<h4 class="mt-0">${data.user.name}</h4>`;
    html += `<p>${data.data.content}</p>`;
    html += '</div>';

    $('#tweets').prepend(html);
  });

  $('#follow').click(function(e) {
    e.preventDefault();

    var userId = $('#user-id').val();
    $.ajax({
      type: 'POST',
      url: `/users/follow/${userId}`,
      success: function() {
        $('#follow').removeClass('btn-dark').addClass('btn-primary')
          .html('Following').attr('id', 'unfollow');
      },
      error: function(data) {
        console.log(data);
      }
    });
  });
});
