exports.execute = function(database, query, _cb) {
	var db = Ti.Database.open(database);		
	var resultSet = db.execute(query);
	
	var result = _cb(resultSet);
	
	db.close();
	return result;
};