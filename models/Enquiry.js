var keystone = require('keystone'),
		Types = keystone.Field.Types,
		monitor = require('../components/monitor.js'),
		emitter = monitor.getEmitter(),
		nodeSES = require('node-ses'),
		client = nodeSES.createClient({ key: process.env.SES_KEY, secret: process.env.SES_SECRET });

/**
 * Enquiry Model
 * =============
 */

var Enquiry = new keystone.List('Enquiry', {
	nocreate: true,
	noedit: true
});

Enquiry.add({
	name: { type: Types.Name, required: true },
	email: { type: Types.Email, required: true },
	zipcode: { type: String },
	enquiryType: { type: Types.Select, options: [
		{ value: 'message', label: 'Just leaving a message' },
		{ value: 'question', label: 'I\'ve got a question' },
		{ value: 'other', label: 'Something else...' }
	] },
	message: { type: Types.Markdown, required: true },
	archived: { type: Boolean, default: false, required: true },
	is_notified: { type: Boolean, default: false },
	is_showroom: { type: Boolean, default: false },
	createdAt: { type: Date, default: Date.now }
});

emitter.on('connectionAvailable', function(data) {
	Enquiry.model.find()
		.where('archived', false)
		.exec(function(err, analytics) {
			analytics.forEach(function(record) {
				record.update({ archived: true }, function(err, numAffected) {
					if (err) throw err;
					console.log('Enquiry: ' + numAffected);
				});
			});
		});
});
monitor.start();

Enquiry.schema.pre('save', function(next) {
	this.wasNew = this.isNew;
	next();
});

Enquiry.schema.post('save', function() {
	if (this.wasNew) {
		this.sendNotificationEmailSes();
	}
});

Enquiry.schema.methods.sendNotificationEmail = function(callback) {
	
	if ('function' !== typeof callback) {
		callback = function() {};
	}
	
	var enquiry = this;
	
	keystone.list('User').model.find().where('isAdmin', true).exec(function(err, admins) {
		
		if (err) return callback(err);
		
		new keystone.Email('enquiry-notification').send({
			to: 'nlambert@maxmedia.com',
			from: {
				name: 'Cox Solution Finder',
				email: 'contact@cox-solution-finder.com'
			},
			subject: 'New Enquiry for Cox Solution Finder',
			enquiry: enquiry
		}, callback);
		
	});
	
};

Enquiry.schema.methods.sendNotificationEmailSes = function(callback) {
	
	if ('function' !== typeof callback) {
		callback = function() {};
	}
	console.log('SES Method');
	var enquiry = this;
	
	client.sendemail({
	   to: 'nlambert@maxmedia.com',
	   from: 'nlambert@dev.sfv2.cox.mxmcloud.com',
	   cc: '',
	   bcc: '',
	   subject: 'greetings',
	   message: 'your <b>message</b> goes here',
	   altText: 'plain text'
	}, function (err, data, res) {
		console.log('\x1b[36mData:\n\x1b[0m');
		console.log(data);
	 	console.log('\x1b[36mError:\n\x1b[0m');
	 	console.log(err);
	});
	
};


Enquiry.defaultSort = '-createdAt';
Enquiry.defaultColumns = 'name, email, enquiryType, createdAt';
Enquiry.register();
