var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Map Model
 * =============
 */

var Map = new keystone.List('Map', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	track: true
});


Map.add({
	title: { 
		type: String, 
		required: true,
		m_cms: { 
			validations: {
				required: true,
				rangelength: [1,30]
			},
			showroom: true, 
			companion: true
		}
	},
	state: { 
		type: Types.Select, 
		options: 'draft, published, archived', 
		default: 'draft', 
		note: "This section will not show up unless published is chosen", 
		index: true 
	},
	map: {
		type: Types.S3File,
		label: 'Map Image',
		allowedTypes: ['image/gif', 'image/jpeg', 'image/png'],
		note: "Upload a 3400px by 1300px image to be the map overlay image. Image should be the map, with text and overlay, with a blurred white background.",
		s3path: 'uploads/images/map_overlays',
		m_cms: { showroom: true, companion: false }
	},
	products: { 
		type: Types.Relationship, 
		label: "Related Products", 
		note: "Choose 3 Products to show up next to the Map Overlay.", 
		ref: 'Product', 
		many: true, 
		initial: false,
		m_cms: { limit: 3, showroom: true, companion: true }
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

Map.schema.methods.updateableFields = function() {
	return 'title, map, products';
}

Map.register();
