$(function() {
	var deviceName = 'tablet';

	if(document.documentElement.clientWidth >= config.breakpoints.showroom.touch) {
		deviceName = 'touch';
	}

	var data = {
		type: 'stats',
		path: window.location.pathname,
		device: deviceName
	};

	$.ajax({
		    type: "POST",
		    url: "/stats/record.json",
		    contentType: 'application/json',
		    data: JSON.stringify(data)
	});
});
