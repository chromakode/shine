$(document).ready(function() {
  $('shinebar iframe').attr('src', chrome.extension.getURL('bar.html') + '#_shine_demo')

  var messages = [
    'greetings, human.',
    'someone is wrong on the internet!',
    'regarding your karma portfolio',
    '[meme regarding narwhals]',
    'help, trapped in an options page'
  ]
  $('.notification-demo > .message').text(randomChoice(messages))

  var prefHandlers = {
    allowHttps: function(name, value, el) {
      if (value) {
        chrome.permissions.request({
          origins: ['https://*/*']
        }, function(granted) {
          prefHandlers.checkbox(name, granted, el)
        })
      } else {
        chrome.permissions.remove({
          origins: ['https://*/*']
        }, function(removed) {
          prefHandlers.checkbox(name, !removed, el)
        })
      }
    },

    checkbox: function(name, value, el) {
      localStorage[name] = value
      $('#contents').toggleClass(name, value)
      $(el).prop('checked', value)
    }
  }

  $('input[type=checkbox]')
    .each(function(i, el) {
      if (localStorage[el.id] == 'true') {
        $(this).prop('checked', true)
        $('#contents').addClass(el.id)
      }
    })
    .click(function() {
      var value = $(this).is(':checked'),
          handler = prefHandlers[this.id] || prefHandlers.checkbox
      handler(this.id, value, this)
    })

  $('#notifyTime')
    .val(localStorage['notifyTime'])
    .change(function() {
      var sec = parseInt($(this).val())
      if (isNaN(sec)) {
        sec = 30
      } else if (sec > 300) {
        sec = 300
      } else if (sec < 10) {
        sec = 10
      }
      localStorage[$(this).attr('id')] = sec
      $('#numSeconds').text(sec)
    })

  $('#numSeconds').text(localStorage['notifyTime'])
})
