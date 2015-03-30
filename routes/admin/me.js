var keystone = require('keystone');

exports = module.exports = function(req, res) {
  
  var view = new keystone.View(req, res),
    locals = res.locals;
  
  locals.section = 'me';
  locals.page = {};
  locals.page.title = 'Settings - Cox Solution Finder CMS';
  
  view.on('post', { action: 'profile.password' }, function(next) {
  
    if (!req.body.password || !req.body.password_confirm) {
      req.flash('error', 'Please enter a password.');
      return next();
    }
  
    req.user.getUpdateHandler(req).process(req.body, {
      fields: 'password',
      flashErrors: true
    }, function(err) {
    
      if (err) {
        return next();
      }
      
      req.flash('success', 'Your changes have been saved.');
      return next();
    
    });
  
  });
  
  view.render('admin/me');
  
}