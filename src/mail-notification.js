function expand(text) {
  return unescape(text).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
}

$(document).ready(function() {
  var data = JSON.parse(window.location.hash.substr(1))

  console.log('Received message data:', data)

  $('#mail-image').attr('src', data.image)
  $('#from').html(data.message.author)
  if (data.message.subreddit) {
    $('#r').html('/r/'+data.message.subreddit).addClass('sr')
  } else {
    $('#r').html('private message')
  }
  $('#subject').html(data.message.subject)
  $('#body').html(expand(data.message.body_html))
})
