var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Connect Model
 * =============
 */

var Connect = new keystone.List('Connect', {
	autokey: { path: 'slug', from: 'name', unique: true },
	track: true,
	nocreate: true
});

Connect.add({heading:"CONNECT NOTE", note: "NOTE TEXT ALL DAY!"},{
	name: { type: String, required: true, index: true, noedit: true},
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', note: "This page will not show up unless published is chosen", index: true },
	heading: { type: String, initial: false, label: "Connect Page Heading", m_cms: {maxLength: 2}, note: "This page will not show up unless published is chosen"},
	content: { type: Types.Textarea, height: 400, initial: false, label: "Connect Page Content", m_cms: {maxLength: 2}},
	connect_background: {
		type: Types.S3File,
		label: 'Connect Background',
		note: "Upload a 2X Resolution image. Image will be the background for the Connect Page.",
		s3path: 'uploads/images'
	},
});

Connect.register();
