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

require('./logo');