Ti.UI.setBackgroundColor('#fff');

Ti.include('/ed/db.js');
Ti.include('/ed/properties.js');
Ti.include('/ed/setting.js');

var ed = ed || {};

ed.network = ed.network || require('ed/mylib/network');
ed.utils = require('ed/mylib/util');

ed.ui = {
	createTabGroup: function(props) {
		
		var tg1 = Titanium.UI.createTabGroup();
	
		var tFavorites = Titanium.UI.createTab({  
		    icon:'img/tab/star.png',
		    title:'Favorites',	    
		});	
		
		var tEmployee = Titanium.UI.createTab({  
		    icon:'img/tab/man.png',
		    title:'Employees',	    
		});
	
		var tConference = Titanium.UI.createTab({  
		    icon:'img/tab/home.png',
		    title:'Conference',	    
		});
		
		var tSetting = Titanium.UI.createTab({  
		    icon:'img/tab/gear.png',
		    title:'Settings',	    
		});
	
		tFavorites.window = ed.ui.favorite.tableView({
			containingTab: tFavorites,
			title: 'Favorites'
		});
	
		tEmployee.window = ed.ui.employee.tableView(1, {
			containingTab: tEmployee,
			favoriteTab: tFavorites,
			title: 'Employees'
		});
		
		tConference.window = ed.ui.employee.tableView(2, {
			containingTab: tConference,
			favoriteTab: tFavorites,
			title: 'Conference Rooms'
		});
		
		tSetting.window = ed.ui.setting.tableView({
			conferenceTab: tConference,
			containingTab: tSetting,
			employeeTab: tEmployee,			
			title: 'Settings'
		});
		
		tg1.addTab(tFavorites);
		tg1.addTab(tEmployee);
		tg1.addTab(tConference);
		tg1.addTab(tSetting);
		
		tg1.setActiveTab(ed.db.favorite.count() > 0 ? tFavorites : tEmployee);
		
		return tg1;
	},
	utils: require('/ed/mylib/ui')
};

ed.ui.employee = {
	detailView: function(id, win) {
		var employee = ed.db.employee.getByID(id);
			
		if(typeof employee == 'undefined') {
			return;				
		}
		
		var winEmployee = Ti.UI.createWindow({				
			backgroundColor: '#E8E8E5',				
			title: employee.firstname + ' ' + employee.lastname
		});
		
		var vTableHeader = Ti.UI.createView({
			height: 170,
			width: 'auto'
		});
		
		var vImageBg = Ti.UI.createView({
			backgroundColor: '#fff',
			borderColor: 'gray',
			borderRadius: 5,
			height: 154,
			layout: 'absolute',
			left: 16,
			top: 14,
			width: 104
		});
		
		var vImage = Ti.UI.createImageView({
			borderRadius: 5,
			height: 150,
			layout: 'absolute',
			left: 18,
			top: 16,
			width: 100
		});
		
		var missingImg = '/img/employee/missing.png';
		
		var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + 'img/employee', employee.id + '.jpg');
		vImage.setImage(file.exists() ? file.nativePath : missingImg);						
		
		ed.network.getRemoteImage('/employee', employee.id + '.jpg', employee.picture, ed.properties.fetchImage.get(), function(e) {
			vImage.setImage(e.path || missingImg);
		});
		
		var vInformation = Ti.UI.createView({
			layout: 'vertical',
			left: 132,
			top: 28,
			zindex: 100
		});
					
		var lblOptions = {
			color: '#000',
		  font: { font: 'Helvetica Neue', fontSize:14 },
		  left: 0,
		  shadowColor: '#fff',
		  shadowOffset: {x:0, y:1},
		  textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,			  
		  top: 1,
		  width: 180, height: 'auto'
		};			
		
		var bOptions = {
			bottom: 2,
			height:38,
			left: 130,
			width:180
		};		
		
		var lblName = Ti.UI.createLabel(lblOptions);			
		var lblPosition = Ti.UI.createLabel(lblOptions);					
		var lblLocation = Ti.UI.createLabel(lblOptions);
		
		lblName.font = { font: 'Helvetica Neue', fontSize: 18, fontWeight: 'bold' };			
		lblName.text = employee.firstname + (employee.type == 1 ? ' ' + employee.lastname : '');
		lblPosition.text = employee.title;
		lblLocation.text = employee.floor;				
		
		vInformation.add(lblName);
		vInformation.add(lblPosition);
		vInformation.add(lblLocation);
				
		var bFavorite = Ti.UI.createButton(bOptions);		
			
		bFavorite.title = 'Add Favorite';
		
		if(employee.favorite || ed.db.favorite.count() >= 8) {
			bFavorite.hide();
		}
		else {
			bFavorite.show();
		}
		
		bFavorite.addEventListener('click', function(e) {
			bFavorite.hide();
			ed.db.favorite.insert(employee);
			win.favoriteTab.window.refresh();
		});
			
		vTableHeader.add(vInformation);
		vTableHeader.add(vImageBg);
		vTableHeader.add(vImage);
		vTableHeader.add(bFavorite);
		
		var tvContactData = [];
		var tvrProps = {		
			backgroundColor: 'white',
			classname: 'row',
			height: 40,				
			touchEnabled: true,				
		};
		
		var lblProps = {
			color: '#4682B4',
		  font: { font: 'Helvetica Neue', fontSize:12, fontWeight: 'bold' },
		  left: 20,
		  textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
		  width: 40
		};
		
		var lblPropsData = {
			color: '#000',
		  font: { font: 'Helvetica Neue', fontSize:'auto', fontWeight: 'bold' },
		  left: 75
		};
		
		var tvrContactEmail = Ti.UI.createTableViewRow(tvrProps);
		tvrContactEmail.type = 'mail';
		tvrContactEmail.address = employee.email;
		
		var lblContactEmail = Ti.UI.createLabel(lblProps);
		lblContactEmail.text = 'email';
		
		var lblContactEmailData = Ti.UI.createLabel(lblPropsData);
		lblContactEmailData.text = employee.email;
		
		tvrContactEmail.add(lblContactEmail);
		tvrContactEmail.add(lblContactEmailData);
		
		var tvrContactPhone = Ti.UI.createTableViewRow(tvrProps);
		tvrContactPhone.type = 'phone';
		tvrContactPhone.number = employee.phone;
		
		var lblContactPhone = Ti.UI.createLabel(lblProps);
		lblContactPhone.text = 'work';
		
		var lblContactPhoneData = Ti.UI.createLabel(lblPropsData);
		lblContactPhoneData.text = employee.phone;
		
		tvrContactPhone.add(lblContactPhone);
		tvrContactPhone.add(lblContactPhoneData);
	
		var tvsContact = Ti.UI.createTableViewSection();
		tvsContact.add(tvrContactEmail);
		tvsContact.add(tvrContactPhone);
		
		if (employee.mobile != null) {
			var tvrContactMobile = Ti.UI.createTableViewRow(tvrProps);
			
			tvrContactMobile.type = 'mobile';
			tvrContactMobile.number = employee.phone;
			
			var lblContactMobile = Ti.UI.createLabel(lblProps);
			lblContactMobile.text = 'mobile';
			
			var lblContactMobileData = Ti.UI.createLabel(lblPropsData);
			lblContactMobileData.text = employee.mobile;
			
			tvrContactMobile.add(lblContactMobile);
			tvrContactMobile.add(lblContactMobileData);
			
			tvsContact.add(tvrContactMobile);
		}
		
		tvContactData.push(tvsContact);
		
		var tvContact = Ti.UI.createTableView({
			backgroundColor: 'stripped',
			rowBackgroundColor: 'white',
			style: Ti.UI.iPhone.TableViewStyle.GROUPED
		});						
					
		tvContact.setData(tvContactData);
		
		tvContact.addEventListener('click', function(e) {
			var media = e.rowData;
						
			var stripNumber = function(number) {
				var regexNumber = /^\((\d{3})\)\s*(\d{3})-(\d{4})$/;									
				return number.replace(regexNumber, '$1$2$3');
			}
			
			switch(media.type) {
				case 'mail':
					Ti.Platform.openURL('mailto:' + media.address);
						
					break;
				case 'phone':
					var dialog = Titanium.UI.createOptionDialog({
						options:['Call', 'Cancel'],							
						cancel:1,
						selectedIndex: 0
					});
				
					dialog.addEventListener('click', function(e) {							
						
						switch(e.index) {
							case 0:
								Ti.Platform.openURL('tel:' + stripNumber(media.number));
								break;
						}																					
					});
				
					dialog.show();
										
					break;
					
				case 'mobile':

					var dialog = Titanium.UI.createOptionDialog({
						options:['Call', 'Text', 'Cancel'],
						cancel:2,
						selectedIndex: 0
					});
				
					dialog.addEventListener('click', function(e) {							
						
						switch(e.index) {
							case 0:
								Ti.Platform.openURL('tel:' + stripNumber(media.number));								
								break;
							case 1:
								Ti.Platform.openURL('sms:' + stripNumber(media.number));
								break;
						}																					
					});
				
					dialog.show();
				
					break;
			}
		});
								
		tvContact.headerView = vTableHeader;
		
		winEmployee.add(tvContact);
		
		return winEmployee;
	},
	tableView: function(type, props) {	
		
		var win = Ti.UI.createWindow(props);
		
		var search = Titanium.UI.createSearchBar({
			showCancel:false
		});
		
		search.addEventListener('blur',function(){
			if(Ti.Platform.name === "android"){
				Ti.API.info('Going to hide soft Keyboard as we are shifting focus away from the SearchBar.');
				Ti.UI.Android.hideSoftKeyboard();
			}	
		});
		
		var view = Titanium.UI.createTableView({
			filterAttribute: 'title',
			search: search
		});

		var setData = function() {
			
			var data = [];
			var index = [];
			var e, eData, eFirst;
			
			//Only set header/index on employees.
			var setHeader = (type == 1);
			var setIndex = (type == 1);
			var isEmployeeList = (type == 1);			
			
			var employeeOrderType = ed.properties.employeeOrder.get();
			
			var employees = ed.db.employee.findAll(type, isEmployeeList ? employeeOrderType.field : null);
			
			for (i in employees) {
				e = employees[i];
				
				eData = {
					headerLetter: (!isEmployeeList || employeeOrderType.id == 1) ? e.firstname.toUpperCase()[0] : e.lastname.toUpperCase()[0],
					id: e.id,
					title: e.firstname === null ? e.lastname : e.firstname + (isEmployeeList ? ' ' + e.lastname : '')
				}
								
				//Set new header if not there
				if (setHeader && (data.length == 0 || (data.length && data[data.length - 1].headerLetter != eData.headerLetter))) {
					eData.header = eData.headerLetter;
				}
				
				// Set filter object if doesn't already exist
				if (setIndex && ((index.length == 0 && eData.headerLetter != null) || (index.length && index[index.length - 1].title != eData.headerLetter))) {
					index.push({
						index: data.length,
						title: eData.headerLetter
					});
				}				
				
				data.push(eData);
			}
			
			view.setData(data);
			view.setIndex(index);
		}
				
		var lastUpdatedLabel = Ti.UI.createLabel({			
			bottom:15,			
			color:"#576c89",			
			font:{fontSize:12},
			left:55,
			shadowColor:"#999",
			shadowOffset:{x:0,y:0},
			text:"Last Updated: " + (ed.utils.getDateString(ed.properties.lastUpdate.get()) || 'Never Updated'),
			textAlign:"center",
			width:200, height:"auto"
		});
		
		var setLastUpdatedText = function() {
			
			var currentTime = new Date();
			var currentTimeString = ed.utils.getDateString(currentTime);
			
			ed.properties.lastUpdate.set(currentTime);						
			lastUpdatedLabel.text = "Last Updated: " +  currentTimeString;
		}
		
		if(Ti.Platform.osname === "iphone") {

			var createPullHeader = function() {
			
				var tableHeader = Ti.UI.createView({
					backgroundColor:"#e2e7ed",
					width:320,
					height:60
				});
				
				var arrow = Ti.UI.createView({
					backgroundImage:"/img/whiteArrow.png",
					width:23,
					height:60,
					bottom:10,
					left:20
				});
				
				var statusLabel = Ti.UI.createLabel({
					text:"Pull to reload",
					left:55,
					width:200,
					bottom:30,
					height:"auto",
					color:"#576c89",
					textAlign:"center",
					font:{fontSize:13,fontWeight:"bold"},
					shadowColor:"#999",
					shadowOffset:{x:0,y:0}
				});

				var actInd = Titanium.UI.createActivityIndicator({
					left:20,
					bottom:13,
					width:30,
					height:30
				});
				
				var initiateReload = false;
				var reloading = false;	
				
				var refreshDirectory = function() {
					
					var resetRefreshBar = function() {
						statusLabel.text = "Pull down to refresh...";
						
						actInd.hide();
						arrow.show();
	
						view.setContentInsets({top:0},{animated:true, duration:250});
						
						initiateReload = false;
						reloading = false;
					}
					
					ed.db.refresh(function() {
						
						setData();																	
						setLastUpdatedText();	
						resetRefreshBar();
					}, function() {
												
						resetRefreshBar();
						alert('There was an issue querying the employee data.');
					});
				}
					
				var topLimit = 100;
								
				view.addEventListener('scroll',function(e)	{
			
					var offset = e.contentOffset.y;
					
					if (!initiateReload && offset <= (-1 * topLimit)) {
					
						initiateReload = true;
						var t = Ti.UI.create2DMatrix();						
						t = t.rotate(-180);										
						arrow.animate({transform:t,duration:180});
						statusLabel.text = "Release to refresh...";						
					}
					else if (!initiateReload && offset > (-1 * topLimit) && offset < 0)	{
						
						var t = Ti.UI.create2DMatrix();
						arrow.animate({transform:t,duration:180});
						statusLabel.text = "Pull down to refresh...";
					}
				});
				
				view.addEventListener('scrollEnd',function(e)	{
					if (initiateReload && !reloading) {							
						reloading = true;
						arrow.hide();
						actInd.show();
						statusLabel.text = "Reloading...";						
						arrow.transform = Ti.UI.create2DMatrix();
						view.setContentInsets({top:65});
						view.scrollToTop(-65, {animated:true});
						setTimeout(refreshDirectory, 500);
					}
				});
				
				tableHeader.add(arrow);
				tableHeader.add(statusLabel);
				tableHeader.add(lastUpdatedLabel);
				tableHeader.add(actInd);							
				
				return tableHeader;
			}
			
			view.headerPullView = createPullHeader();					
			
		}
		else {
			
			var button = Ti.UI.createButton({
				title: 'refresh',
				zindex: 100
			});
			
			button.addEventListener('click', function() {
				ed.db.refresh(function() {
					setData();
				});
			});
			
			view.add(button);			
		}				
		
		view.addEventListener('click', function(e) {
			
			if(typeof e.rowData == 'undefined') {
				return;				
			}
			
			var winEmployee = ed.ui.employee.detailView(e.rowData.id, win);
			
			if(typeof winEmployee == 'undefined') {
				return;				
			}
						
			win.containingTab.open(winEmployee,{animated:true});			
		});

		win.add(view);

		var vInit = Ti.UI.createView({
			backgroundColor: '#000',
			borderRadius: 8,
			opacity: 0.7,
			height: 75,
			width:100
		});
		
		var lblInit = Ti.UI.createLabel({
			color: '#fff',
			font: { font: 'Helvetica Neue', fontSize:14, fontWeight: 'bold' },
			text: 'Initializing',
			top: 45
		});
		
		var actInd = Titanium.UI.createActivityIndicator({
			color: '#fff',
			left:35,
			height:30, width:30,
			top: 10		
		});
		
		vInit.add(lblInit);
		vInit.add(actInd);
		
		var vInitHide = function() {
			actInd.hide();
			vInit.hide();
		}
		
		var initApp = function(overlayText, cb) {
			
			lblInit.text = overlayText || 'Updating';
			
			actInd.show();
			vInit.show();
			
			ed.db.refresh(function() {
				
				setData();				
				setLastUpdatedText();					
				vInitHide();
				
				if (cb) { cb(); }
				
			}, function(e) {
				//Ti.API.error(e);
				alert('There was an issue querying the employee data.');
				vInitHide();
				setData();
				
				if (cb) { cb(); }				
			});	
		}
		
		var testUpdate = function() {
			
			var currentDate = new Date();
			var updateDate = ed.properties.lastUpdate.get();						
			
			if (!updateDate)
				return true;
			
			updateDate = new Date(updateDate.getTime() + ed.properties.updateInterval.get().minutes * 60000)	
			
			return currentDate > updateDate;
		}
		
		vInitHide();
		
		win.add(vInit);		

		win.refresh = function() {
			setData();
		}

		if (!ed.properties.firstServiceAttempt.get()) {
			
			initApp('Initializing', function() {
				ed.properties.firstServiceAttempt.set(true);
			});																														
		}
		else {
			if (testUpdate()) {
				initApp('Updating');
			}			
			
			setData();
		}

		Ti.App.addEventListener('resume', function() {
			if (testUpdate()) {										
				initApp('Updating');
			}
		});

		return win;
	}
};

ed.ui.favorite = {
	tableView: function(props) {
		var win = Ti.UI.createWindow(props);
		
		var rowMoved = false;
		
		var tv = Ti.UI.createTableView({
			editable: true,
			moveable:true
		});
		
		var bEdit = Ti.UI.createButton({
			title: 'Edit'
		});
		
		var bDone = Titanium.UI.createButton({
			title:'Done',
			style:Titanium.UI.iPhone.SystemButtonStyle.DONE
		});
	
		bEdit.addEventListener('click', function() {
			win.setLeftNavButton(bDone);
			tv.editing = true;			
		});
		
		bDone.addEventListener('click', function()	{
			win.setLeftNavButton(bEdit);
			tv.editing = false;
			
			if (rowMoved) {
				var rows = tv.data[0].rows;
				
				for (i in rows) { 
					ed.db.favorite.update(rows[i].id, i);
				}
				
				rowMoved = false;
			}
		});
	
		var setData = function() {
			var data = [];			
			var f, fData;
						
			var favorites = ed.db.favorite.findAll();
			
			for(i in favorites) {
				f = favorites[i];
				
				fData = {
					id: f.id,
					employeeId: f.employeeId,
					title: f.firstname === null ? f.lastname : f.firstname + (f.type == 1 ? ' ' + f.lastname : '')
				};
				
				data.push(fData);
			}		 		
			
			tv.setData(data);
		}
	
		tv.addEventListener('click', function(e) {
			if(typeof e.rowData == 'undefined')
				return;				
			
			var winEmployee = ed.ui.employee.detailView(e.rowData.employeeId);
			
			if(typeof winEmployee == 'undefined')
				return;
			
			win.containingTab.open(winEmployee,{animated:true});		
		});
		
		tv.addEventListener('delete', function(e) {
			if(typeof e.rowData == 'undefined')
				return;
			
			ed.db.favorite.remove(e.rowData.id);
		});			
		
		tv.addEventListener('move', function(e) {
			rowMoved = true;
		});
		
		setData();
		
		win.add(tv);
		win.leftNavButton = bEdit;
		win.refresh = function() {
			setData();
		} 
		
		return win;
	}
}

ed.ui.setting = {
	tableView: function(props) {
				
		var win = Ti.UI.createWindow(props);
		
		var tvsData = [];							
		
		var tvrProps = {
			backgroundColor: 'white',
			classname: 'row',
			height: 40,
			touchEnabled: false
		};
		
		var lblProps = {
			color: '#000',
		  font: { font: 'Helvetica Neue', fontSize:18, fontWeight: 'bold' },
		  left: 10
		};
		
		var lblSelProps = {
			color: '#4682B4',
		  font: { font: 'Helvetica Neue', fontSize:16 },
		  right: 10
		};
		
		var sProps = {
			right: 10
		};
		
		var tvrFetchImage = Ti.UI.createTableViewRow(tvrProps);			
		
		var lrFetchImage = Ti.UI.createLabel(lblProps);
		lrFetchImage.text = 'Fetch Image'; 
		
		var sFetchImage = Ti.UI.createSwitch(sProps);
		sFetchImage.value = ed.properties.fetchImage.get();			
		
		sFetchImage.addEventListener('change', function(e) {
			ed.properties.fetchImage.set(e.value);
		});
			
		tvrFetchImage.add(lrFetchImage);
		tvrFetchImage.add(sFetchImage);
		
		var tvrEmployeeOrder = Ti.UI.createTableViewRow(tvrProps);			
		tvrEmployeeOrder.setTouchEnabled(true);
		tvrEmployeeOrder.hasChild = true;
		
		var lrEmployeeOrder = Ti.UI.createLabel(lblProps);
		lrEmployeeOrder.text = 'Employee Order';
		
		var lrEmployeeOrderSelection = Ti.UI.createLabel(lblSelProps);
		lrEmployeeOrderSelection.text = ed.properties.employeeOrder.get().title;
		
		tvrEmployeeOrder.add(lrEmployeeOrder);
		tvrEmployeeOrder.add(lrEmployeeOrderSelection);
		
		tvrEmployeeOrder.addEventListener('click', function() {
			var wEmpOrder = Ti.UI.createWindow({
				title: 'Employee Order'
			});						
																		
			var currentSelection = ed.properties.employeeOrder.get();
			var data = [];
			var lastRowClicked;							
			var oType;
			
			for(i in ed.settings.employeeOrderTypes) {				
				oType = ed.settings.employeeOrderTypes[i];				
				oType.hasCheck = (oType.id == currentSelection.id);
				
				data.push(oType);				
			}						
			
			var tv = Ti.UI.createTableView({
				backgroundColor: 'stripped',
				rowBackgroundColor: 'white',
				style: Ti.UI.iPhone.TableViewStyle.GROUPED
			});
			
			tv.setData(data);											
			
			tv.addEventListener('click', function(e) {
				var d = e.rowData;
				
				if (lastRowClicked && lastRowClicked !== e.row) {
		    	lastRowClicked.hasCheck = false;
			  }
			  else {
			  	var rows = tv.data[0].rows;
					for (i in rows) {
						rows[i].hasCheck = false;
					}
			  }
				
				ed.properties.employeeOrder.set(ed.settings.employeeOrderTypes[d.id]);
				win.employeeTab.window.refresh();
								
				lrEmployeeOrderSelection.text = d.title;				
				e.row.hasCheck = true;
				
				lastRowClicked = e.row;				
			});
			
			wEmpOrder.add(tv);
			
			win.containingTab.open(wEmpOrder,{animated:true})
		});
		
		var tvrUpdateInterval = Ti.UI.createTableViewRow(tvrProps);			
		tvrUpdateInterval.setTouchEnabled(true);
		tvrUpdateInterval.hasChild = true;
		
		var lrUpdateInterval = Ti.UI.createLabel(lblProps);
		lrUpdateInterval.text = 'Update Interval';
		
		var lrUpdateIntervalSelection = Ti.UI.createLabel(lblSelProps);
		lrUpdateIntervalSelection.text = ed.properties.updateInterval.get().title;
		
		tvrUpdateInterval.add(lrUpdateInterval);
		tvrUpdateInterval.add(lrUpdateIntervalSelection);
		
		tvrUpdateInterval.addEventListener('click', function() {
			var wUpdateInterval = Ti.UI.createWindow({
				title: 'Update Interval'
			});						
																		
			var currentSelection = ed.properties.updateInterval.get();
			var data = [];
			var lastRowClicked;							
			var iType;
						
			for(i in ed.settings.updateIntervals) {
				iType = ed.settings.updateIntervals[i];				
				iType.hasCheck = (iType.id == currentSelection.id);
				
				data.push(iType);				
			}						
			
			var tv = Ti.UI.createTableView({
				backgroundColor: 'stripped',
				rowBackgroundColor: 'white',
				style: Ti.UI.iPhone.TableViewStyle.GROUPED
			});
			
			tv.setData(data);											
			
			tv.addEventListener('click', function(e) {
				var d = e.rowData;
				
				if (lastRowClicked && lastRowClicked !== e.row) {
		    	lastRowClicked.hasCheck = false;
			  }
			  else {
			  	var rows = tv.data[0].rows;
					for (i in rows) {
						rows[i].hasCheck = false;
					}
			  }
								
				ed.properties.updateInterval.set(ed.settings.updateIntervals[d.id]);				
				lrUpdateIntervalSelection.text = d.title;
				e.row.hasCheck = true;
				
				lastRowClicked = e.row;			
			});
			
			wUpdateInterval.add(tv);
			
			win.containingTab.open(wUpdateInterval,{animated:true})
		});

		var tvsSettings = Ti.UI.createTableViewSection();			
		tvsSettings.add(tvrFetchImage);
		tvsSettings.add(tvrEmployeeOrder);
		tvsSettings.add(tvrUpdateInterval);
		
		tvsData.push(tvsSettings);
		
		var tvSettings = Ti.UI.createTableView({
			backgroundColor: 'stripped',
			rowBackgroundColor: 'white',
			style: Ti.UI.iPhone.TableViewStyle.GROUPED
		});
		
		var tvsFooter = Ti.UI.createView({height:65});
		var bDeleteData = Ti.UI.createButtonBar({
			font: {fontSize: 18},
	    labels: ['Delete All Data'],
	    backgroundColor: '#f00',
	    top: 20,
	    style: Titanium.UI.iPhone.SystemButtonStyle.BAR,
	    height: 45,
	    width: '94%'
		});
		
		bDeleteData.addEventListener('click', function() {
			var a = Titanium.UI.createAlertDialog({								
				buttonNames: ['OK','Cancel'],
				cancel: 1,
				message:'Are you sure?',
				title:'Delete All Data'
			});
			
			a.addEventListener('click', function(e) {
				if (e.cancel != e.index) {
					var dir = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + 'img/employee');
					dir.deleteDirectory(true);
					ed.db.purge();
					
					win.employeeTab.window.refresh();				
					win.conferenceTab.window.refresh();
				}
			});
			
			a.show();
			
			setTimeout(function() {
				a.hide();
			}, 3000);
		});
		
		tvsFooter.add(bDeleteData);
		tvSettings.footerView = tvsFooter;		
		
		tvSettings.setData(tvsData);		
		
		win.add(tvSettings);
		
		return win;
	}
};