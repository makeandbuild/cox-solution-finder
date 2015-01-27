'use strict';

exports.monitor = function(emitter) {

	var emitter = emitter || new require('events').EventEmitter();

	return {

		getEmitter: function() {
			return emitter;
		}

	}
};
