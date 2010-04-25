shineOverlay = {
  exists: function() {
    return $('#_shine-overlay').length != 0;
  },

  init: function() {

    var result = $('<div id="_shine-overlay"></div>')
      .append($('<iframe id="_shine-frame" src="bar.html" scrolling="no" frameborder="0"></iframe>'))
      .appendTo('body')
      .hide();

    return result;
  },

  display: function(info) {
    if (info) {
      if (!this.info || this.info.fullname == info.fullname) {
        this.info = info;
        // Another chrome bug prevents us from properly using postMessage on our child iframe, so we resort to another hack:
        // We'll change the height of the iframe ever so slightly (not displayed), and pick up the resize event inside the frame.
        console.log(chrome.extension.getURL('bar.html#'+encodeURIComponent(JSON.stringify(info))));
        $('#_shine-overlay iframe').show().attr('src', chrome.extension.getURL('bar.html#'+encodeURIComponent(JSON.stringify(info))));
        window.setTimeout(function() {
          $('#_shine-overlay iframe').height($('#_shine-overlay iframe').height()+1);
        }, 0);
      }
    } else {
      this.info = null;
      $('#_shine-overlay iframe').hide();
    }
  },

  visible: false,
  show: function() {
    if (!this.visible) {
      this.visible = true;
      $('#_shine-overlay').css('right', (-$('#_shine-overlay').innerWidth())+'px').show().animate({'right': 0});
    }
  },

  hide: function() {
    if (this.visible) {
      this.visible = false;
      $('#_shine-overlay').animate({'right': (-$('#_shine-overlay').innerWidth())+'px'}, function() { $(this).hide() });
    }
  }
}

function onRequest(request, sender, callback) {
  if (request.action == 'showInfo') {
    console.log('Shine showInfo update received:', request.info);
    shineOverlay.display(request.info);
    shineOverlay.show();
  }
}
chrome.extension.onRequest.addListener(onRequest);

// Unfortunately, chrome.* is sadly not available to iframes in current versions.
// We'll have to get a little bit creative!
function receiveMessage(event) {
  if (event.origin == chrome.extension.getURL('').slice(0, -1)) {
    var request = JSON.parse(event.data);
    console.log('Message received from bar iframe: ', request);
    if (request.action == 'size') {
      $('#_shine-overlay').width(request.width+'px');
      $('#_shine-overlay').height(request.height+'px');
    } else if (request.action == 'close') {
      shineOverlay.hide();
    } else if (request.action == 'vote') {
      request.fullname = shineOverlay.info.name;
	    chrome.extension.sendRequest(request);
    }
  }
}
window.addEventListener('message', receiveMessage, false);

shineOverlay.init();
console.log('Shine page overlay loaded.');
