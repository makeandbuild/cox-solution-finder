var keystone = require('keystone'),
		Types = keystone.Field.Types,
		monitor = require('../components/monitor.js'),
		emitter = monitor.getEmitter(),
		nodeSES = require('node-ses'),
		client = nodeSES.createClient({ key: process.env.SES_KEY, secret: process.env.SES_SECRET }),
		sender = process.env.SES_SENDER,
		reciever = process.env.SES_RECIEVER,
		EJS = require('ejs'),
		security = require('../components/security.js');

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
	company_population: { type: Types.Select, numeric: true, options: [
		{ value: 1, label: '1-20' },
		{ value: 2, label: '21-99' },
		{ value: 3, label: '100+'}
	] },
	is_customer: { type: Types.Boolean, default: false, label: "Is Customer?" },
	archived: { type: Boolean, default: false, required: true },
	is_notified: { type: Boolean, default: false, label: "Is Notified?" },
	is_showroom: { type: Boolean, default: false, label: "Created with Showroom?" },
	createdAt: { type: Date, default: Date.now },
	industries: { type: String },
	services: { type: String },
	products: { type: String },
	partners: { type: String },
	favorites_count: { type: String },
	showname: {type: String }
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
	if (this.wasNew && this.is_showroom) {
		this.sendNotificationEmailSes();
	}
	if (!this.is_showroom){
		this.sendNotificationEmailSes();
	}
});


//This is not currently being used.
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
	var enquiry = this;
	console.log(enquiry);

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

Enquiry.schema.methods.toCSV = function() {
	var row = []

	row.push(this.name.full);
	row.push(this.email);
	row.push(this.zipcode);
	row.push(this.company_populationLabel);
	row.push(this.is_customer ? "YES" : "NO");
	row.push(this.industries);
	row.push(this.services);
	row.push(this.products);
	row.push(this.partners);
	row.push(this._.createdAt.format());

	return row.map(function(val) {
		return '"' + val + '"';
	}).join(",");
};

Enquiry.CSV_HEADER = '"Name","Email","Zipcode","Company Population","Is Customer","Industries",' +
                     '"Services","Products","Partners","Created At"';

Enquiry.defaultSort = '-createdAt';
Enquiry.defaultColumns = 'name, email, createdAt';
Enquiry.register();
