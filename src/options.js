$(document).ready(function() {
  var messages = [
    'greetings, human.',
    'someone is wrong on the internet!',
    'regarding your karma portfolio',
    '[meme regarding narwhals]',
    'help, trapped in an options page'
  ]
  $('.notification-demo > .message').text(randomChoice(messages))

  $('input[type=checkbox]')
    .each(function(i, el) {
      if (localStorage[el.id] == 'true') { $(this).prop('checked', true) }
    })
    .click(function() {
      localStorage[this.id] = $(this).is(':checked')
    })
})
