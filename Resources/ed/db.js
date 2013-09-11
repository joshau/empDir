Ti.include('/ed/properties.js');
Ti.include('/ed/service.js');
Ti.include('/ed/setting.js'); 

var ed = ed || {};
//var _ = require('employeeDirectory/lib/underscore-min'),_;

ed.network = require('ed/mylib/network');

ed.db = {
	utils: require('ed/mylib/db'),
	implode: function() {
		var db = Ti.Database.open(ed.settings.constants.databaseName);
		
		db.execute('DROP TABLE IF EXISTS Employee;');
		
		db.close();
		
		//Ti.App.Properties.setBool(ed.settings.constants.properties.databaseInit, false);
	},
	init: function(cb, onError) {
		var db = Ti.Database.open(ed.settings.constants.databaseName);
		
		db.execute('CREATE TABLE IF NOT EXISTS Employee (' + 
										'id TEXT, ' +
										'firstname TEXT, ' +
										'lastname TEXT, ' +
										'phone TEXT, ' +
										'mobile TEXT, ' +
										'birthdate TEXT, ' +
										'floor TEXT, ' +
										'email TEXT, ' +
										'title TEXT, ' +
										'startdate TEXT, ' +
										'picture TEXT, ' +
										'[group] TEXT, ' +
										'manager TEXT, ' +
										'[type] INTEGER)');
		
		db.execute('CREATE TABLE IF NOT EXISTS Favorite (' + 
										'id INTEGER PRIMARY KEY, ' +
										'employeeId TEXT, ' +
										'orderIndex INTEGER)');
		
		db.close();
		
		// Mark the DB as initialized
		ed.properties.databaseInitialized.set(true);
				
		//ed.db.refresh(cb, onError);
		Ti.fireEvent('databaseSeeded');			
	},
	purge: function() {
		var db = Ti.Database.open(ed.settings.constants.databaseName);
		
		db.execute('DELETE FROM Favorite;');
		db.execute('DELETE FROM Employee;');
		
		db.close();
	},
	refresh: function(cb, onError) {
		
		if ( !Ti.App.Properties.getBool(ed.settings.constants.properties.databaseInit)) {
			
			ed.db.implode();
			ed.db.init(cb, onError);			
		} else {
			var insertEmployees = function(resultSet) {
				
				var employees = ed.db.employee.findAll();
				
				var db = Ti.Database.open(ed.settings.constants.databaseName);
				var existIndex = -1;
				
				for (var i in resultSet) {
					existIndex = -1;
					for (var j in employees) {
						if (employees[j].id === resultSet[i].id) {
							existIndex = j;
							employees.splice(j, 1);
							break;
						}					
					}
					if (existIndex == -1) {											 
						ed.db.employee.insert(resultSet[i], db);
					}
					else {
						ed.db.employee.update(resultSet[i].id, resultSet[i].firstname, resultSet[i].lastname, 
							resultSet[i].phone, resultSet[i].mobile, resultSet[i].birthdate, resultSet[i].floor, 
							resultSet[i].email, resultSet[i].title, resultSet[i].startdate, resultSet[i].picture, 
							resultSet[i].group, resultSet[i].manager, resultSet[i].type, db);						
					}
				}				
					
				for(i in employees) {
					ed.db.employee.remove(resultSet[i].id, db);					
				}
					
				db.close();
				
				if (cb) { cb() ; }
			};
			
			ed.service.employee.findAll(insertEmployees, onError);
		}
	}
};

ed.db.employee = {
	findAll: function(type, orderField) {
		
		var getEmployees = function(resultSet) {
		
			var employees = [];
		
			while(resultSet.isValidRow()) {
				
				var employee = {
					id: resultSet.fieldByName('id'),
					firstname: resultSet.fieldByName('firstname'),
					lastname: resultSet.fieldByName('lastname'),
					phone: resultSet.fieldByName('phone'),
					mobile: resultSet.fieldByName('mobile'),
					birthdate: resultSet.fieldByName('birthdate'),
					floor: resultSet.fieldByName('floor'),
					email: resultSet.fieldByName('email'),
					title: resultSet.fieldByName('title'),
					startdate: resultSet.fieldByName('startdate'),
					picture: resultSet.fieldByName('picture'),
					group: resultSet.fieldByName('group'),
					manager: resultSet.fieldByName('manager'),
					type: resultSet.fieldByName('type')
				};
					
				employees.push(employee);
				resultSet.next();
			}
			resultSet.close();
			
			return employees;
		};
		
		return ed.db.utils.execute(ed.settings.constants.databaseName, 
						'SELECT id, firstname, lastname, phone, mobile, birthdate, floor, email, title, startdate, picture, [group], manager, [type] ' +
						'FROM Employee ' + (type ? 'WHERE type = ' + type + ' ' : '') +
						'ORDER BY ' + (orderField || 'firstname')  + ' COLLATE NOCASE ASC;',
						getEmployees);		
	},
	findAllForTable: function(type) {
		
		var getEmployees = function(resultSet) {
		
			var employees = [];
		
			while(resultSet.isValidRow()) {
				
				var employee = {
					id: resultSet.fieldByName('id'),
					hasChild: true
				};
				
				employee.title = resultSet.fieldByName('firstname') === null ? 
					resultSet.fieldByName('lastname') : 
					resultSet.fieldByName('firstname') + ((type && type === 1) ? ' ' + resultSet.fieldByName('lastname') : '');
				
				employees.push(employee);
				resultSet.next();
			}
			resultSet.close();
			
			return employees;
		};
		
		return ed.db.utils.execute(ed.settings.constants.databaseName, 
						'SELECT id, firstname, lastname ' +
						'FROM Employee ' + (type ? 'WHERE type = ' + type + ' ' : '') +
						'ORDER BY firstname ASC;',
						getEmployees);		
	},
	getByID: function(id) {
		
		var getEmployee = function(resultSet) {
			
			var employee;
			
			if (resultSet.isValidRow()) {
				employee = {
					id: resultSet.fieldByName('id'),
					firstname: resultSet.fieldByName('firstname'),
					lastname: resultSet.fieldByName('lastname'),
					phone: resultSet.fieldByName('phone'),
					mobile: resultSet.fieldByName('mobile'),
					birthdate: resultSet.fieldByName('birthdate'),
					floor: resultSet.fieldByName('floor'),
					email: resultSet.fieldByName('email'),
					title: resultSet.fieldByName('title'),
					startdate: resultSet.fieldByName('startdate'),
					picture: resultSet.fieldByName('picture'),
					group: resultSet.fieldByName('group'),
					manager: resultSet.fieldByName('manager'),
					type: resultSet.fieldByName('type'),
					favorite: resultSet.fieldByName('favorite')
				};	
			}
			
			return employee;
		}
		
		return ed.db.utils.execute(ed.settings.constants.databaseName, 
						'SELECT Employee.id, firstname, lastname, phone, mobile, birthdate, floor, email, title, startdate, picture, [group], manager, [type], IFNULL(Favorite.id, 0) AS favorite ' +
						'FROM Employee LEFT OUTER JOIN Favorite ON Employee.id = Favorite.employeeId ' +
						'WHERE Employee.id = \'' + id + '\';',
						getEmployee);
	},
	insert: function(employee, db) {
		
		var localConnection = false;
		
		if(!db) {			
			db = Ti.Database.open(ed.settings.constants.databaseName);
			localConnection = true;
		}
		
		db.execute('INSERT INTO Employee (id, firstname, lastname, phone, mobile, birthdate, floor, email, title, startdate, picture, [group], manager, [type]) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?);', 
			employee.id, 
			employee.firstname, 
			employee.lastname, 
			employee.phone, 
			employee.mobile, 
			employee.birthdate, 
			employee.floor, 
			employee.email, 
			employee.title, 
			employee.startdate,
			employee.picture,
			employee.group,
			employee.manager,
			employee.type);
		
		if(localConnection) {
			db.close();
		}		
	},
	remove: function(id, db) {
		var localConnection = false;
		
		if(!db) {
			db = Ti.Database.open(ed.settings.constants.databaseName);
			localConnection = true;
		}
		
		db.execute('DELETE FROM Favorite WHERE employeeId = ?;', id);		
		db.execute('DELETE FROM Employee WHERE id = ?;', id);
		
		if(localConnection) {
			db.close();
		}	
	},
	update: function(id, firstname, lastname, phone, mobile, birthdate, floor, email, title, startdate, picture, group, manager, type, db) {
		var localConnection = false;
		
		if(!db) {			
			db = Ti.Database.open(ed.settings.constants.databaseName);
			localConnection = true;
		}
		
		db.execute('UPDATE Employee SET firstname = ?, lastname = ?, phone = ?, mobile = ?, birthdate = ?, floor = ?, email = ?, title = ?, startdate = ?, picture = ?, [group] = ?, manager = ?, [type] = ? WHERE id = ?;',  
			firstname, 
			lastname, 
			phone, 
			mobile, 
			birthdate, 
			floor, 
			email, 
			title, 
			startdate,
			picture,
			group,
			manager,
			type,
			id);
		
		if(localConnection) {
			db.close();
		}		
	}
};

ed.db.favorite = {
	count: function(db) {
		var localConnection = false;
		
		if(!db) {
			db = Ti.Database.open(ed.settings.constants.databaseName);
			localConnection = true;
		}
		
		var count = db.execute('SELECT * FROM Favorite;').getRowCount();
		
		if(localConnection) {
			db.close();
		}
		
		return count;	
	},
	findAll: function() {
		
		var getFavorites = function(resultSet) {
		
			var employees = [];
		
			while(resultSet.isValidRow()) {
				
				var employee = {
					id: resultSet.fieldByName('id'),
					employeeId: resultSet.fieldByName('employeeId'),
					firstname: resultSet.fieldByName('firstname'),
					lastname: resultSet.fieldByName('lastname'),
					phone: resultSet.fieldByName('phone'),
					mobile: resultSet.fieldByName('mobile'),
					birthdate: resultSet.fieldByName('birthdate'),
					floor: resultSet.fieldByName('floor'),
					email: resultSet.fieldByName('email'),
					title: resultSet.fieldByName('title'),
					startdate: resultSet.fieldByName('startdate'),
					picture: resultSet.fieldByName('picture'),
					group: resultSet.fieldByName('group'),
					manager: resultSet.fieldByName('manager'),
					type: resultSet.fieldByName('type'),
					orderIndex: resultSet.fieldByName('orderIndex')
				};
					
				employees.push(employee);
				resultSet.next();
			}
			resultSet.close();
			
			return employees;
		};
		
		return ed.db.utils.execute(ed.settings.constants.databaseName, 
						'SELECT Favorite.id, Favorite.employeeID, Favorite.orderIndex, firstname, lastname, phone, mobile, birthdate, floor, email, title, startdate, picture, [group], manager, [type] ' +
						'FROM Employee INNER JOIN Favorite ON Favorite.employeeId = Employee.Id ' +
						'ORDER BY Favorite.orderIndex ASC;',
						getFavorites);
	},
	insert: function(employee, db) {
		var localConnection = false;
		
		if(!db) {
			db = Ti.Database.open(ed.settings.constants.databaseName);
			localConnection = true;
		}
		
		db.execute('INSERT INTO Favorite (employeeId, orderIndex) VALUES (?, (SELECT COUNT(*) FROM Favorite));', 
			employee.id);
		
		if(localConnection) {
			db.close();
		}	
	},
	remove: function(id, db) {
		var localConnection = false;
		
		if(!db) {
			db = Ti.Database.open(ed.settings.constants.databaseName);
			localConnection = true;
		}
		
		db.execute('DELETE FROM Favorite WHERE id = ?;', id);
		
		if(localConnection) {
			db.close();
		}	
	},
	update: function(id, orderIndex, db) {
		var localConnection = false;
		
		if(!db) {
			db = Ti.Database.open(ed.settings.constants.databaseName);
			localConnection = true;
		}
		
		db.execute('UPDATE Favorite SET orderIndex = ? WHERE id = ?;', orderIndex, id);
		
		if(localConnection) {
			db.close();
		}	
	}
};
