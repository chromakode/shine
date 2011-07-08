var port, shineBar

function ShineOverlay(id) {
  this.id = id
  this._id = '_shine-overlay-'+this.id
  this.init()
}
ShineOverlay.prototype = {
  init: function() {
    this.frame = document.createElement('iframe')
    this.frame.setAttribute('scrolling', 'no')
    this.frame.setAttribute('frameborder', 'no')
    this.overlay = document.createElement('shinebar')
    this.overlay.appendChild(this.frame)
    // FIXME: body may not exist yet
    document.documentElement.appendChild(this.overlay)
  },
  
  resize: function(width, height) {
    this.overlay.style.width = width + 'px'
    this.overlay.style.height = height + 'px'
  },

  visible: false,
  show: function() {
    if (!this.visible) {
      this.visible = true
      this.overlay.style.display = 'block'
    }
  },

  hide: function() {
    if (this.visible) {
      this.visible = false
      this.overlay.style.display = 'none'
    }
  },

  remove: function() {
    this.overlay.parentNode.removeChild(this.overlay)
  },
  
  _display: function(url) {
    this.frame.setAttribute('src', chrome.extension.getURL(url))
  },

  display: function(fullname) {
      if (!this.fullname || this.fullname == fullname) {
        this.fullname = fullname
        this._display('bar.html#'+encodeURIComponent(fullname))
      }
  },

  showSubmit: function() {
    this._display('submit.html#'+encodeURIComponent(window.location.href))
  }
}

var shineBar
function createBar() {
  if (!shineBar) {
    shineBar = new ShineOverlay('bar')
    console.log('Shine bar created.')
  }
  return shineBar
}

function removeBar() {
  if (shineBar) {
    shineBar.remove()
    console.log('Shine bar removed.')
  }
}

window.addEventListener('message', function(e) {
  if (e.origin == chrome.extension.getURL('').slice(0, -1)) {
    var request = JSON.parse(e.data)
    console.log('Message received from bar iframe: ', request)
    if (request.action == 'close') {
      shineBar.hide()
    }
  }
}, false)

port = chrome.extension.connect({name:'overlay'})
port.onMessage.addListener(function(request) {
  switch (request.action) {
    case 'showInfo':
      console.log('Shine showInfo received:', request.fullname)
      createBar().display(request.fullname)
      break
    case 'showSubmit':
      createBar().showSubmit()
      break
  }
})

// Remove any open bars when the extension gets unloaded.
port.onDisconnect.addListener(function() {
  removeBar()
})

console.log('Shine page overlay loaded.')
