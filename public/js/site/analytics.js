$(function() {
	var data = {
		type: 'stats',
		path: window.location.pathname
	};

	$.ajax({
		    type: "POST",
		    url: "/stats/record.json",
		    contentType: 'application/json',
		    data: JSON.stringify(data)
	});
});
