// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').load();

// Setup for Phusion Passenger
if (typeof(PhusionPassenger) != 'undefined') {
  PhusionPassenger.configure({ autoInstall: false });
}
var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    keystone = require('keystone').connect(mongoose, app);

require('./setup')(keystone, function() {
  if (process.env.SOLUTION_MODE == 'showroom') {
    keystone.set('views', 'templates/views/showroom');
  }
});

// Load your project's Routes

keystone.set('routes', require('./routes'));

// Setup common locals for your emails. The following are required by Keystone's
// default email templates, you may remove them if you're using your own.

keystone.set('email locals', {
	logo_src: '/images/logo-email.gif',
	logo_width: 194,
	logo_height: 76,
	theme: {
		email_bg: '#f9f9f9',
		link_color: '#2697de',
		buttons: {
			color: '#fff',
			background_color: '#2697de',
			border_color: '#1a7cb7'
		}
	}
});

// Setup replacement rules for emails, to automate the handling of differences
// between development a production.

// Be sure to update this rule to include your site's actual domain, and add
// other rules your email templates require.

keystone.set('email rules', [{
	find: '/images/',
	replace: (keystone.get('env') == 'production') ? 'http://www.your-server.com/images/' : 'http://localhost:3000/images/'
}, {
	find: '/keystone/',
	replace: (keystone.get('env') == 'production') ? 'http://www.your-server.com/keystone/' : 'http://localhost:3000/keystone/'
}]);

// Load your project's email test routes

keystone.set('email tests', require('./routes/emails'));

// Configure the navigation bar in Keystone's Admin UI

keystone.set('nav', {
	'enquiries': 'enquiries',
	'users': 'users',
	'industries' : 'industries',
	'services' : 'services',
	'products' : 'products'
});

// Start Keystone to connect to your database and initialise the web server

keystone.start();

// Start the ethernet connection listener
var sync = require('./components/sync.js').sync,
		emitter = sync.getEmitter(),
		monitor = require('./components/monitor.js').monitor(emitter);

emitter.on('connectionAvailable', function(e) {
		console.log('Connection Available to ' + e.target +'.');

		// TODO: react to connectionAvailable event
		console.log(monitor);
	});
sync.start();
