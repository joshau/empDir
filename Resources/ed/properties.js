Ti.include('/ed/setting.js');

ed = ed || {};

ed.properties = {
	utils: require('/ed/mylib/property'),
	databaseInitialized: {
		get: function() {
			return ed.properties.utils.getBool(ed.settings.constants.properties.databaseInit, false);
		},
		set: function(val) {
			Ti.App.Properties.setBool(ed.settings.constants.properties.databaseInit, val);
		}
	},
	employeeOrder: {
		get: function() {
			return ed.properties.utils.getObject(ed.settings.constants.properties.employeeOrderType, ed.settings.employeeOrderTypes[ed.settings.defaultSettings.employeeOrderType]);
		},
		set: function(val) {
			Ti.App.Properties.setObject(ed.settings.constants.properties.employeeOrderType, val);
		}
	},
	firstServiceAttempt: {				
		get: function() {
			return ed.properties.utils.getBool(ed.settings.constants.properties.firstServiceAttempt, false);
		},
		set: function(val) {
			Ti.App.Properties.setBool(ed.settings.constants.properties.firstServiceAttempt, val);
		}
	},
	fetchImage: {				
		get: function() {
			return ed.properties.utils.getBool(ed.settings.constants.properties.fetchImage, ed.settings.defaultSettings.fetchImage);
		},
		set: function(val) {
			Ti.App.Properties.setBool(ed.settings.constants.properties.fetchImage, val);
		}
	},
	lastUpdate: {
		get: function() {
			var val = ed.properties.utils.getDouble(ed.settings.constants.properties.lastUpdate, null);
			
			return val ? new Date(val) : val;
		},
		set: function(val) {
			Ti.App.Properties.setDouble(ed.settings.constants.properties.lastUpdate, val.valueOf());
		}
	},
	updateInterval: {
		get: function() {
			return ed.properties.utils.getObject(ed.settings.constants.properties.updateInterval, ed.settings.updateIntervals[ed.settings.defaultSettings.updateInterval]);
		},
		set: function(val) {
			Ti.App.Properties.setObject(ed.settings.constants.properties.updateInterval, val);
		}
	}
}