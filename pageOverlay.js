function ShineOverlay(id) {
  this.id = id;
  this._id = '#_shine-overlay-'+this.id;
  this.init();
}
ShineOverlay.prototype = {
  exists: function() {
    return $(this._id).length != 0;
  },

  init: function() {
    this.frame = $('<iframe src="'+chrome.extension.getURL(this.id+'.html')+'" scrolling="no" frameborder="0"></iframe>');
    this.overlay = $('<div id="'+this._id+'" class="_shine-overlay"></div>')
      .append(this.frame)
      .appendTo('body')
      .css('visibility', 'visible');
  },
  
  resize: function(width, height) {
    this.overlay.width(width);
    this.overlay.height(height);
  },

  visible: false,
  show: function() {
    if (!this.visible) {
      this.visible = true;
      this.overlay
        .css({
          'right': (-this.overlay.innerWidth())+'px',
          'visibility': 'visible'})
        .animate({'right': 0});
    }
  },

  hide: function() {
    if (this.visible) {
      this.visible = false;
      this.overlay
        .animate({right:(-this.overlay.innerWidth())+'px'}, $.proxy(function() {
          this.overlay.css('visibility', 'hidden');
        }, this));
    }
  }
}

function onRequest(request, sender, callback) {
  if (request.action == 'showInfo') {
    console.log('Shine showInfo update received:', request.info);
    shineBar.display(request.info, request.loggedIn);
  } else if (request.action == 'showSubmit') {
    shineBar.showSubmit();
  }
}

// Unfortunately, chrome.* is sadly not available to iframes in current versions.
// We'll have to get a little bit creative!
function receiveMessage(event) {
  if (event.origin == chrome.extension.getURL('').slice(0, -1)) {
    var request = JSON.parse(event.data);
    console.log('Message received from bar iframe: ', request);
    if (request.action == 'size') {
      shineBar.resize(request.width, request.height);
      shineBar.show();
    } else if (request.action == 'close') {
      shineBar.hide(true);
    } else if ($.inArray(request.action, ['vote', 'save', 'unsave']) != -1) {
      request.fullname = shineBar.info.name;
	    chrome.extension.sendRequest(request);
    }
  }
}

function addBar(){
  shineBar = new ShineOverlay('bar');
  $.extend(shineBar, {
    _display: function(url) {
      this.frame.show().attr('src', chrome.extension.getURL(url));
      window.setTimeout($.proxy(function() {
        this.frame.height(this.frame.height()+1);
      }, this), 10);
    },

    display: function(info, loggedIn) {
      if (info) {
        if (!this.info || this.info.name == info.name) {
          this.info = info;
          // Another chrome bug prevents us from properly using postMessage on our child iframe, so we resort to another hack:
          // We'll change the height of the iframe ever so slightly (not displayed), and pick up the resize event inside the frame.
          this._display('bar.html#'+encodeURIComponent(JSON.stringify({info:info, loggedIn:loggedIn})));
        }
      } else {
        this.info = null;
        this.frame.hide();
      }
    },

    showSubmit: function() {
      this._display('submit.html#'+encodeURIComponent(window.location.href));
    }
  });
  chrome.extension.onRequest.addListener(onRequest);
  window.addEventListener('message', receiveMessage, false);
  console.log('Shine page overlay loaded.');
}

if($('._shine-overlay').size()==0){
  addBar();
}
