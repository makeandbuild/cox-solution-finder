var keystone = require('keystone');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res),
		locals = res.locals;

	view.on('init', function(next) {

		console.log('111');

		next();

	});

	view.render('admin/index');

};
