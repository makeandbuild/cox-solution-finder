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

Connect.add({
	name: { type: String, 
		required: true, 
		index: true, 
		noedit: true
	},
	state: { type: Types.Select, 
		options: 'draft, published, archived', 
		default: 'draft', 
		note: "This page will not show up unless published is chosen", 
		index: true
	},
	heading: { type: String, 
		initial: false, 
		label: "Connect Page Heading", 
		m_cms: { maxLength: 25, showroom: false, companion: true }, 
		note: "Information about this field"
	},
	content: { type: Types.Textarea, 
		height: 400, 
		initial: false, 
		label: "Connect Page Content", 
		note: "Information about this field",
		m_cms: { maxLength: 400, showroom: false, companion: true }
	},
	connect_background: {
		type: Types.S3File,
		label: 'Connect Background',
		allowedTypes: ['image/gif', 'image/jpeg', 'image/png'],
		note: "Upload a 2X Resolution image. Image will be the background for the Connect Page.",
		s3path: 'uploads/images',
		m_cms: { showroom: false, companion: true }
	},
	editor: {
		type: Types.Relationship, 
		ref: 'User'
	},
	checkoutTime: {
		type: Types.Datetime,
		default: Date.now()
	}
});

Connect.schema.methods.updateableFields = function() {
    return 'name, heading, content, connect_background';
}

Connect.register();
