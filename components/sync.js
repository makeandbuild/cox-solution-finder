'use strict';

var Sync = function() {
	var events = require('events'),
			emitter = new events.EventEmitter(),
			intervalId = null,
			url = 'www.google.com',		// TODO: set to website url
			delay = 5000;
	
	return {
		getEmitter: function() {
			return emitter;
		},

		start: function() {
			if (intervalId === null) {
				intervalId = setInterval(function() {
					require('dns').resolve(url, function(err) {
						if (err) {
							console.log(err);
						} else {
							emitter.emit('connectionAvailable', { target: url });
						}

						intervalId = null;
					});
				}, delay);
			}

			return this;
		}
		
	};
};

exports.sync = new Sync();