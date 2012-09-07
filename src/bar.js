var port, fullname, info, loggedIn

function likeDelta(likes) {
  if (likes == true) {
    return 1
  } else if (likes == false) {
    return -1
  } else {
    return 0
  }
}

function vote(likes, shift) {
  info.score += likeDelta(likes) - likeDelta(info.likes)
  info.likes = likes
  update()
  port.postMessage({action:'vote', likes:info.likes})
  // If closeOnVote set, close unless shift is pressed.
  // If unset, close if shift is pressed.
  if (!!localStorage['closeOnVote'] != !!shift) {
    msgJSON({action:'closeByVote'})
  }
}

function toggleSaved() {
  info.saved = !info.saved
  update()
  if (info.saved) {
    port.postMessage({action:'save'})
  } else {
    port.postMessage({action:'unsave'})
  }
}

function update() {
  initButtons()

  $('#title').text(expand(info.title))

  if (loggedIn) {
    $('#bar').removeClass('logged-out').addClass('logged-in')
  } else {
    $('#bar').removeClass('logged-in').addClass('logged-out')
  }

  fitHeight()

  if (info.permalink) {
    $('#title').attr('href', 'http://www.reddit.com'+info.permalink)
  }

  if (info.likes == true) {
    $('#bar').removeClass('disliked').addClass('liked')
  } else if (info.likes == false) {
    $('#bar').removeClass('liked').addClass('disliked')
  } else {
    $('#bar').removeClass('liked disliked')
  }

  if (info.saved == true) {
    $('#bar').addClass('saved')
  } else {
    $('#bar').removeClass('saved')
  }
  $('#save').attr('title', info.saved ? 'Unsave' : 'Save')

  $('#score').text(info.score)
  if (info.subreddit) {
    var subPath = '/r/'+info.subreddit
    $('#subreddit')
      .text(subPath)
      .attr('href', 'http://www.reddit.com'+subPath)
  } else {
    $('#bar').removeClass('subreddit')
  }
  $('#comments span').text(info.num_comments)
}

function initButtons() {
  if (buttonsReady || info._fake) { return }
  $('#comments').attr('href', 'http://www.reddit.com'+info.permalink)

  $('#upvote').click(function(evt) {
    vote(info.likes == true ? null : true, evt.shiftKey)
  })

  $('#downvote').click(function(evt) {
    vote(info.likes == false ? null : false, evt.shiftKey)
  })

  $('#save').click(function() {
    toggleSaved()
  })

  $('#login').click(function () {
    window.open('http://www.reddit.com/login/')
  })

  $('#close').click(function() {
    port.postMessage({action:'close'})
    msgJSON({action:'close'})
  })

  buttonsReady = true
}

$(document).ready(function() {
  $(window).resize(fitHeight)
})

buttonsReady = false
fullname = window.location.hash.substr(1)
port = chrome.extension.connect({name:'bar:'+fullname})
port.onMessage.addListener(function(msg) {
  switch (msg.action) {
    case 'update':
      console.log('Received updated info', msg)
      info = msg.info
      loggedIn = msg.loggedIn
      update()
      break
  }
})
port.postMessage({action:'update', useStored:'true'})
