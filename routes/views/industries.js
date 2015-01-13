var keystone = require('keystone'),
  async = require('async');

exports = module.exports = function(req, res) {

  var view = new keystone.View(req, res),
    locals = res.locals;

  // Init locals
  locals.section = 'industries';
  locals.data = {
    industries: []
  };


  // Load the Industries
  view.on('init', function(next) {

    var q = keystone.list('Industry').paginate({
        page: req.query.page || 1,
        perPage: 10,
        maxPages: 10
      })
      .where('state', 'published');

    q.exec(function(err, results) {
      locals.data.industries = results;
      next(err);
    });

  });

  // Render the view
  view.render('industries');

};
