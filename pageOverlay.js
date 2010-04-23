shineOverlay = {
  exists: function() {
    return $("#_shine-overlay").length != 0;
  },

  init: function() {

    var result = $('<div id="_shine-overlay"></div>')
      .append($('<img class="_shine-close" src="'+chrome.extension.getURL('images/close.png')+'" alt="close"/>'))
      .append($('<iframe src="" height="69" width="51" scrolling="no" frameborder="0"></iframe>'))
      .append($('<p class="_shine-body"></p>'))
      .appendTo('body')
      .css('right', -500)
      .hide();
      
    $('#_shine-overlay ._shine-close').click(function() {
      shineOverlay.hide();
    });

    return result;
  },

  display: function(info) {
    if (info) {
      if (!this.info || this.info.fullname != info.fullname) {
        this.info = info;
        $("#_shine-overlay iframe").show().attr('src', 'http://www.reddit.com/static/button/button2.html?width=51&url='+encodeURIComponent(window.location.href)+'&title='+encodeURIComponent(this.info.title));
        $("#_shine-overlay ._shine-body").text(info.title);
      }
    } else {
      this.info = null;
      $("#_shine-overlay iframe").hide();
      $("#_shine-overlay ._shine-body").text("No reddit submission found.");
    }
  },

  show: function() {
    $("#_shine-overlay").show().animate({'right': 0});
  },

  hide: function() {
    $('#_shine-overlay').animate({'right': -500}, function() { $(this).hide() });
  }
}

function onRequest(request, sender, callback) {
  if (request.action == 'showOverlay') {
    shineOverlay.display(request.info);
    shineOverlay.show();
  }
}
chrome.extension.onRequest.addListener(onRequest);
shineOverlay.init();
console.log("Shine page overlay loaded.");
