var ed = ed || {};

ed.settings = {
	constants: {
		databaseName: 'employeeDirectory',
		properties: {
			databaseInit: 'databaseInitialized',
			employeeOrderType: 'employeeOrderType',
			firstServiceAttempt: 'firstServiceAttempt',
			fetchImage: 'fetchImage',
			lastUpdate: 'lastUpdate',
			updateInterval: 'updateInterval'
		}
	},
	defaultSettings: {
		fetchImage: true,
		employeeOrderType: 2,
		updateInterval: 4
	},
	imageLocations: {
		employee: 'https://www.somelocation.com/img/user/'
	},
	employeeOrderTypes: {
		1: {id: 1, title: 'First Name', field: 'firstname'},
		2: {id: 2, title: 'Last Name', field: 'lastname'}
	},
	services: {
		getEmployees: 'https://www.somelocation.com/users.json'
	},
	updateIntervals: {
		1: {id: 1, title: '1 Hour', minutes: 60},
		2: {id: 2, title: '3 Hours', minutes: 180},
		3: {id: 3, title: '12 Hours', minutes: 720},
		4: {id: 4, title: '24 Hours', minutes: 1440}
	}
};
