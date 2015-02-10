var keystone = require('keystone'),
		Types = keystone.Field.Types,
		monitor = require('../components/monitor.js'),
		emitter = monitor.getEmitter();

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
	phone: { type: String },
	enquiryType: { type: Types.Select, options: [
		{ value: 'message', label: 'Just leaving a message' },
		{ value: 'question', label: 'I\'ve got a question' },
		{ value: 'other', label: 'Something else...' }
	] },
	message: { type: Types.Markdown, required: true },
	archived: { type: Boolean, default: false, required: true },
	createdAt: { type: Date, default: Date.now }
});

emitter.on('connectionAvailable', function(data) {
	Enquiry.model.find()
		.where('archived', false)
		.exec(function(err, analyitcs) {
			analyitcs.forEach(function(record) {
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
		this.sendNotificationEmail();
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
			to: admins,
			from: {
				name: 'Cox Solution Finder',
				email: 'contact@cox-solution-finder.com'
			},
			subject: 'New Enquiry for Cox Solution Finder',
			enquiry: enquiry
		}, callback);
		
	});
	
};

Enquiry.defaultSort = '-createdAt';
Enquiry.defaultColumns = 'name, email, enquiryType, createdAt';
Enquiry.register();
