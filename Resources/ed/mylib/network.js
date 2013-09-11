
/*
 * Options:
 * 	.async (bool)
 * 	.onerror (callback)
 * 	.timeout (int)
 * 	.type (string)
 * 	.url (string)
*/
exports.requestJson = function(_options, _cb) {
	var client = Ti.Network.createHTTPClient();
	client.setTimeout(_options.timeout);
	client.onerror = _options.onerror;
	client.onload = function() {		
		_cb(JSON.parse(this.responseData));
		client.abort();
	};
	client.open(_options.type, _options.url, _options.async);
	client.send();
};

exports.getRemoteImage = function(directory, filename, url, forceUpdate, cb) {
	var fileObj = {
		filename: filename,
		path: null,
		url: url
	};
	var location = '/img';
	
	var dir = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + location);
	dir.createDirectory();
	
	var dir = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + location + directory);
	dir.createDirectory();
	
	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + location + directory, filename);
	
	var bailOut = function() {
		fileObj.path = file.nativePath;
		cb(fileObj);
	};
	
	if (file.exists() && !forceUpdate) {
		bailOut();
	} 
	else {
		
		if (Ti.Network.getOnline) {
			var client = Ti.Network.createHTTPClient({enableKeepAlive:false});
			client.setTimeout(20000);
			client.onerror = function(e) { 
				Ti.API.error(e); 
				Ti.API.info('HTTP status = ' + this.status);
				
				cb(fileObj);
			};
			client.onload = function() {
				if (this.status == 200) {
					if (! Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + location).exists()) {
						Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + location).createDirectory();
					}
					file.write(this.responseData);
					bailOut();
				}
			};
			client.ondatastream = function() {
				//do something?
			};			
			client.open("GET", url);
			client.send();
		}
		else {
			if (file.exists()) {
				bailOut();
			} 
		}		
	}
};
