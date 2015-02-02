'use strict';

exports.Monitor = function(url, delay, cb) {

	var cb = cb || function() {},
			dns = require('dns'),
			events = require('events'),
			emitter = new events.EventEmitter(),
			intervalId = null;
			url = url || 'www.google.com',
			delay = delay || 5000;

	return {

		connected: false,

		getEmitter: function() {
			return emitter;
		},

		start: function() {
			if (intervalId === null) {
				intervalId = setInterval(function() {
					dns.resolve(url, function(err) {
						if (err) {
							this.connected = false;
							console.log(err);
							cb({ 
								status: 'Error! Unable to resolve DNS. Connection Unavailable.',
								target: url
							}, err);
						} else {
							this.connected = true;
							emitter.emit('connectionAvailable', { target: url });
							cb({
								status: 'connectionAvailable',
								target: url
							}, err);
						}

						intervalId = null;
					});
				}, delay);
			}

			status = 'Running';

			return this;
		},

		stop: function() {
			clearInterval(intervalId);
			this.connected = false;

			return this;
		}

	}
};
