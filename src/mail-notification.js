function expand(text) {
  return unescape(text).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
}

$(document).ready(function() {
  var data = JSON.parse(window.location.hash.substr(1))

  console.log('Received message data:', data)

  $('#mail-image').attr('src', data.image)
  $('#from').text(data.message.author)
  if (data.message.subreddit) {
    $('#r').text('/r/'+data.message.subreddit).addClass('sr')
  } else {
    $('#r').text('private message')
  }
  $('#subject').text(data.message.subject)

  // WARNING: this depends on the CSP to prevent unsafe-inline scripts in the
  // body_html from executing.
  $('#body').html(expand(data.message.body_html))
})
