module.exports = function(keystone, callback) {
  // Initialise Keystone with your project's configuration.
  // See http://keystonejs.com/guide/config for available options
  // and documentation.
  keystone.init({
    'name': 'Cox Solution Finder',
    'brand': 'Cox Solution Finder',

    'less': 'public',
    'static': 'public',
    'favicon': 'public/favicon.ico',
    'views': 'templates/views',
    'view engine': 'jade',

    'emails': 'templates/emails',

    'auto update': true,
    'session': true,
    'auth': true,
    'user model': 'User',
    'cookie secret': 'D[*v8#+B.G?;/T(78Ng1I6W:X%wV9Q)|FN`HAn-`M.<o@H&5KL]#QQTDC~,K1~aT'
  });

  // ENV overrides
  if (process.env.PORT) {
    keystone.set('port', process.env.PORT);
  }

  if (process.env.LISTEN) {
    keystone.set('listen', process.env.LISTEN);
  }

  if (process.env.MONGO_URI) {
    keystone.set('mongo', process.env.MONGO_URI);
    keystone.set('session store', 'mongo');
  }

  if (process.env.S3_BUCKET) {
    keystone.set('s3 config', {
      bucket: process.env.S3_BUCKET,
      key: process.env.S3_KEY,
      secret: process.env.S3_SECRET
    });
  }

  if (process.env.COOKIE_SECRET) {
    keystone.set('cookie secret', process.env.COOKIE_SECRET);
  }

  // Load your project's Models
  keystone.import('models');

  // Setup common locals for your templates. The following are required for the
  // bundled templates and layouts. Any runtime locals (that should be set uniquely
  // for each request) should be added to ./routes/middleware.js
  keystone.set('locals', {
    _: require('underscore'),
    env: keystone.get('env'),
    utils: keystone.utils,
    editable: keystone.content.editable
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

  callback && callback();

  // Start Keystone to connect to your database and initialise the web server
  var port = keystone.get('listen') || keystone.get('port') || 3000;
  keystone.httpServer = keystone.app.listen(port, function() {
    if (keystone.get('logger')) {
      console.log(keystone.get('name') + ' is ready on ' + port);
    }
  });
  keystone.mount();

  // Start the ethernet connection listener
  var sync = require('./components/sync.js').sync,
      emitter = sync.getEmitter(),
      monitor = require('./components/monitor.js').monitor(emitter);

  emitter.on('connectionAvailable', function(e) {
      console.log('Connection Available to ' + e.target +'.');

      // TODO: react to connectionAvailable event
    });
  sync.start();
  
  return keystone;
}
