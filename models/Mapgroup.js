var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Mapgroup Model
 * =============
 */

var Mapgroup = new keystone.List('Mapgroup', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	track: true
});

var map = {
	map_overlay_enable: {
		type: Types.Boolean,
		label: "Enable the following map overlay? If unchecked, map will not show.",
		default: "false"
	},
	title: {
		type: Types.Text,
		label: "Map Overlay Name"
	},
	map: {
		type: Types.S3File,
		label: 'Map Image',
		note: "Upload a 3400px by 1300px image to be the map overlay image. Image should be the map, with text and overlay, with a blurred white background.",
		s3path: 'uploads/images/map_overlays'
	},
	products: { type: Types.Relationship, label: "Related Products", note: "Choose 3 Products to show up next to the Map Overlay.", ref: 'Product', many: true, initial: false },
}


Mapgroup.add({
	name: { type: String, required: true, index: true, noedit: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', note: "This section will not show up unless published is chosen", index: true },
	map_one: map,
	map_two: map,
	map_three: map,
	map_four: map,
	map_five: map,
	map_six: map
});

Mapgroup.register();
