shineOverlay = {
  exists: function() {
    return $('#_shine-overlay').length != 0;
  },

  init: function() {

    var result = $('<div id="_shine-overlay"></div>')
      .append($('<iframe id="_shine-frame" src="" scrolling="no" frameborder="0"></iframe>'))
      .appendTo('body')
      .hide();

    return result;
  },

  display: function(info) {
    if (info) {
      if (!this.info || this.info.fullname != info.fullname) {
        this.info = info;
        $('#_shine-overlay iframe').show().attr('src', chrome.extension.getURL('bar.html#'+encodeURIComponent(JSON.stringify(info))));
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
  if (request.action == 'showOverlay') {
    shineOverlay.display(request.info);
    shineOverlay.show();
  }
}
chrome.extension.onRequest.addListener(onRequest);


function receiveMessage(event) {
  if (event.origin == chrome.extension.getURL('').slice(0, -1)) {
    var request = JSON.parse(event.data);
    console.log('Message received from bar iframe: ', request);
    if (request.action == 'size') {
      $('#_shine-overlay').width(request.width+'px');
      $('#_shine-overlay').height(request.height+'px');
    } else if (request.action == 'close') {
      shineOverlay.hide();
    }
  }
}
window.addEventListener('message', receiveMessage, false);

shineOverlay.init();
console.log('Shine page overlay loaded.');
