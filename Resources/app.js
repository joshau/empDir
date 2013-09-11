Ti.include('/ed/db.js');
Ti.include('/ed/ui.js');

if (!Ti.App.Properties.getBool(ed.settings.constants.properties.databaseInit)) {
	ed.db.init();
}	
		
var tgEmployeeDir = ed.ui.createTabGroup();

tgEmployeeDir.open();
