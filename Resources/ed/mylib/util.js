exports.getDateString = function(date) {
	var localDate = date || new Date();
	
	var month = localDate.getMonth();
	var day = localDate.getDay();
	var year = localDate.getFullYear();
	
	day = day < 10 ? '0' + day : day;
	
	var datestr = month + '/' + day + '/' + year;
	
	var hours = localDate.getHours() <= 12 ? localDate.getHours() : localDate.getHours() - 12;
	var minutes = localDate.getMinutes();
	
	minutes = minutes < 10 ? '0' + minutes : (minutes % 10 == 0 ? minutes + '0' : minutes);
	
	datestr += ' ' + hours + ':' + minutes + (localDate.getHours() < 12 ? ' AM' : ' PM');
	
	return datestr;
}