var ed = ed || {};
var _ = require('ed/lib/underscore-min'),_;

ed.network = require('ed/mylib/network');

ed.service = {};

ed.service.employee = {
	findAll: function(callback, error) {
		ed.network.requestJson({
			async: false,
			onerror: error || function(e) { Ti.API.error(e); alert('There was an issue querying the employee data.'); },
			timeout:10000, 
			type:"GET", 
			url:ed.settings.services.getEmployees}, 
			callback);
	}
}