chrome.extension.sendRequest({action:'queryURL', url:location.href}, function(info) {
  $('<div id="_shine-overlay"></div>')
    .append($('<img class="_shine-close" src="'+chrome.extension.getURL('images/close.png')+'" alt="close"/>'))
    .append($('<iframe src="http://www.reddit.com/static/button/button2.html?width=51&url='+encodeURIComponent(window.location.href)+'&title='+encodeURIComponent(info.title)+'" height="69" width="51" scrolling="no" frameborder="0"></iframe>'))
    .append($('<p class="_shine-body"></p>').text(info.title))
    .appendTo('body')
    .css('right', -500)
    .animate({'right': 0});
  $('#_shine-overlay ._shine-close').click(function() {
    $('#_shine-overlay').animate({'right': -500}, function() { $(this).hide() });
  });
});
