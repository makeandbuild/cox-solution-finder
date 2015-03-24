var keystone = require('keystone'),
	Types = keystone.Field.Types,
	client = nodeSES.createClient({ key: process.env.SES_KEY, secret: process.env.SES_SECRET });

/**
 * User Model
 * ==========
 */

var User = new keystone.List('User');

User.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, index: true },
	password: { type: Types.Password, initial: true, required: true }
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

User.schema.methods.resetPassword = function(callback) {
	
	var user = this;
	
	user.resetPasswordKey = keystone.utils.randomString([16,24]);
	
	user.save(function(err) {
		
		if (err) return callback(err);
		
		new keystone.Email('forgotten-password').send({
			user: user,
			link: '/reset-password/' + user.resetPasswordKey,
			subject: 'Reset your Cox Solution Finder CMS Password',
			to: user.email,
			from: {
				name: 'Jeremy Ciccone',
				email: 'jciccone@maxmedia.com'
			}
		}, callback);
		
	});
	
}

Enquiry.schema.methods.sendNotificationEmailSes = function(callback) {

	if ('function' !== typeof callback) {
		callback = function() {};
	}
	var enquiry = this;

	var fs = require('fs');

	//Render HTML template from EJS and send to User
	fs.readFile('templates/emails/custom-email.ejs', 'utf-8', function(err, data) {
	   if(err) {
	   	console.log(err);
	   	 callback(err);
	   } else {
   		var uid = enquiry._id.toString();
   		console.log(uid);
	   	var custom_url = process.env.PDOMAIN + '/personalized/' + security.encrypt(uid);

		var html = EJS.render(data, {url: custom_url});

			client.sendemail({
				to: enquiry.email,
		   		from: sender,
		   		cc: '',
				bcc: '',
				subject: 'Thank you for your interest in Cox Business Solutions',
				message: html
			}, function (err, data, res) {
				if(err) {
					console.log(err);
					callback(err);
				} else {
					console.log('SUCCESS!');
					enquiry.is_notified = true;
					callback();
				}
				// console.log('\x1b[36mData:\n\x1b[0m');
				// console.log(data);
			 	// 	console.log('\x1b[36mError:\n\x1b[0m');
			 	// 	console.log(err);
			});
	   }
	});

};


/**
 * Registration
 */

User.defaultColumns = 'name, email, isAdmin';
User.register();
