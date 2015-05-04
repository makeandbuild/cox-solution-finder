var keystone = require('keystone'),
	Types = keystone.Field.Types,
	nodeSES = require('node-ses'),
	client = nodeSES.createClient({ key: process.env.SES_KEY, secret: process.env.SES_SECRET }),
	sender = process.env.SES_SENDER,
	hostname = process.env.PDOMAIN,
	jade = require('jade');

/**
 * User Model
 * ==========
 */

var User = new keystone.List('User');

User.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
	resetPasswordKey: { type: String, hidden: true },
	wasNew: { type: Boolean, index: true, hidden: true },
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
	isEditor: { type: Boolean, label: 'Can Edit Cox Solution Finder Content', index: true }
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function() {
	return this.isAdmin;
});

User.schema.virtual('canEdit').get(function() {
	return this.isEditor;
});
User.schema.pre('save', function(next) {
	var user = this;
	this.wasNew = this.isNew;
	next();
});

User.schema.post('save', function() {

	var user = this;
	if(user.wasNew) {

		user.resetPasswordKey = keystone.utils.randomString([16,24]);
		user.wasNew = false;

		user.save(function(err) {
			var html = jade.renderFile('templates/emails/forgotten-password.jade', {filename: 'templates/emails/forgotten-password.jade', 
																					username: user.name.full, 
																					host: hostname, 
																					link: '/reset-password/' + user.resetPasswordKey,
																					newUser: true
																					});
		

			client.sendemail({
				to: user.email,
		   		from: sender,
		   		cc: '',
				bcc: '',
				subject: 'CMS EMAIL',
				message: html
			}, function (err, data, res) {
				if(err) {
					console.log(err);
				} else {
					console.log('SUCCESS!');
				}

			});
		});

	}

});

User.schema.methods.resetPassword = function(callback) {

	var user = this;

	user.resetPasswordKey = keystone.utils.randomString([16,24]);


	if ('function' !== typeof callback) {
		callback = function() {};
	}

	user.save(function(err) {

		var html = jade.renderFile('templates/emails/forgotten-password.jade', {filename: 'templates/emails/forgotten-password.jade', 
																				username: user.name.full, 
																				host: hostname, 
																				link: '/reset-password/' + user.resetPasswordKey,
																				newUser: false
																				});
		client.sendemail({
			to: user.email,
	   		from: sender,
	   		cc: '',
			bcc: '',
			subject: 'CMS EMAIL',
			message: html
		}, function (err, data, res) {
			if(err) {
				console.log(err);
				callback(err);
			} else {
				console.log('SUCCESS!');
				callback();
			}

		});
	});

};


/**
 * Registration
 */

User.defaultColumns = 'name, email, isAdmin', 'isEditor';
User.register();
