function thingClicked() {
	var fullnameMatch = $(this).parents('.thing').attr('class').match(/id-(\w+)/);
	if (fullnameMatch) {
		var info = {fullname:fullnameMatch[1]};
		info.title = $(this).text();
	  chrome.extension.sendRequest({action:'thingClick', url:this.href, info:info});
	}
}

$(document).ready(function() {
	$('.thing a.title').click(thingClicked);
});
