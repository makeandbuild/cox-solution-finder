'use strict';

exports = module.exports = {

	dns: require('dns'),

	events: require('events'),

	connected: false,

	delay: 5000,

	intervalId: null,

	url: 'www.google.com',

	getEmitter: function() {
		if (!this.emitter) {
			this.emitter = new this.events.EventEmitter();
		}

		return this.emitter;
	},

	start: function() {
		var self = this;

		if (self.intervalId === null) {
			self.intervalId = setInterval(function() {
				self.dns.resolve(self.url, function(err) {
					if (err) {
						self.connected = false;
						console.log(err);
					} else {
						self.connected = true;
						self.emitter.emit('connectionAvailable', { target: self.url });
					}

					self.intervalId = null;
				});
			}, this.delay);
		}

		return self;
	},

	stop: function() {
		clearInterval(this.intervalId);
		this.connected = false;

		return this;
	}

};
