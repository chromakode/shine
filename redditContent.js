function scrapeThingInfo(thing) {
  var info = {};

	fullnameMatch = thing.attr('class').match(/id-(\w+)/);
	if (!fullnameMatch) {
	  return false;
	}
	info.name = fullnameMatch[1];
	
	info.title = thing.find('a.title').text();

  var entry = thing.find(".entry");
  if (entry.hasClass('likes')) {
    info.likes = true;
  } else if (entry.hasClass('dislikes')) {
    info.likes = false;
  } else {
    info.likes = null;
  }

  info.saved = thing.hasClass('saved');

  info.score = parseInt(thing.find(".score:visible").text());
  
  info.subreddit = thing.find('a.subreddit').text();

  info.num_comments = parseInt(thing.find('.comments').text()) || 0;

  info.permalink = thing.find('.comments').attr('href').match(/.*reddit.com(\/.+)/)[1];

  console.log('Scraped info from page:', info);
  return info;
}

function thingClicked() {
  var info = scrapeThingInfo($(this).parents('.thing'));
  if (info) {
    chrome.extension.sendRequest({action:'thingClick', url:this.href, info:info});
  }
}

$(document).ready(function() {
  const redditScript = 'var reddit';
  console.log('Shine reddit content handler running.');
	$('.thing a.title').click(thingClicked);
  var modhash = $('script:contains('+redditScript+')').text().match(/modhash:\s*'(\w*)'/)[1];
  chrome.extension.sendRequest({action:'modhashUpdate', modhash:modhash});
});
