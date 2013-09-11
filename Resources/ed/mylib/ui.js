exports.createYoutubeWebView = function(url, options) {
	var html = '<html><body style="border:0;margin:0;padding:0">' +
			'<iframe width="' + options.width + '" height="' + options.height + 
			'" src="'+ url +'" frameborder="0" allowfullscreen></iframe>' +
			'</body></html>';
			
	var video = Ti.UI.createWebView({
			height: options.height,
			html: html,
			left: options.left,
			top: options.top,
			width: options.width
		});
		
	return video;
}
