$(document).ready(function() {
  var data = JSON.parse(window.location.hash.substr(1))

  window.scroll(0, 0)

  console.log('Received message data:', data)

  function expand(text) {
    return unescape(text).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
  }

  $('#mail-image').attr('src', expand(data.image))
  $('#from').html(data.message.author)
  if (data.message.subreddit) {
    $('#r').html('/r/'+data.message.subreddit).addClass('sr')
  } else {
    $('#r').html('private message')
  }
  $('#subject').html(data.message.subject)
  $('#body').html(expand(data.message.body_html))
})
