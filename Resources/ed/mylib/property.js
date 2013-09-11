var property = {
	getBool: function(name, defaultValue) {
		var val = Ti.App.Properties.getBool(name);
				
		if (!Ti.App.Properties.hasProperty(name)) {
			val = defaultValue;
			Ti.App.Properties.setBool(name, val);
		}
		
		return val; 
	},
	getDouble: function(name, defaultValue) {
		var val = Ti.App.Properties.getDouble(name);
		
		if (!Ti.App.Properties.hasProperty(name)) {
			val = defaultValue;
			if (val) 
				Ti.App.Properties.setDouble(name, val);
		}
				
		return val;
	},
	getInt: function(name, defaultValue) {
		var val = Ti.App.Properties.getInt(name);
				
		if (!Ti.App.Properties.hasProperty(name)) {
			val = defaultValue;
			Ti.App.Properties.setInt(name, val);
		}
		
		return val;
	},
	getObject: function(name, defaultValue) {
		var val = Ti.App.Properties.getObject(name);
		
		if (!val) {
			val = defaultValue;
			Ti.App.Properties.setObject(name, val);
		}
		
		return val;
	},
	getString: function(name, defaultValue) {
		var val = Ti.App.Properties.getString(name);
		
		if (!val) {
			val = defaultValue;
			Ti.App.Properties.setString(name, val);
		}
		
		return val;
	}
}

exports.getBool = property.getBool;
exports.getDouble = property.getDouble;
exports.getInt = property.getInt; 
exports.getObject = property.getObject;
exports.getString = property.getString; 
