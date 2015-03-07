// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').load();

var keystone = require('keystone');

require('./setup')(keystone, function() {
  if (process.env.SOLUTION_MODE == 'showroom') {
    keystone.set('views', 'templates/views/showroom');
  }
});

require('./logo');
