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

  $(document).on('click', '#follow', function(e) {
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

  $(document).on('click', '#unfollow', function(e) {
    e.preventDefault();

    var userId = $('#user-id').val();
    $.ajax({
      type: 'POST',
      url: `/users/unfollow/${userId}`,
      success: function() {
        $('#unfollow').removeClass('btn-primary btn-danger')
          .addClass('btn-dark').html('Follow').attr('id', 'follow');
      },
      error: function(data) {
        console.log(data);
      }
    });
  });

  $(document).on('mouseenter', '#unfollow', function() {
    $(this).removeClass('btn-primary').addClass('btn-danger')
      .html('Unfollow');
  });

  $(document).on('mouseleave', '#unfollow', function() {
    $(this).removeClass('btn-danger').addClass('btn-primary')
      .html('Following');
  });
});
