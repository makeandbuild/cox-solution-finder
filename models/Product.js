var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Product Model
 * ==========
 */

var Product = new keystone.List('Product', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	track: true
});

var section = {
	title: { type: String, requred: true, label: "Feature Title" },
	svg_icon: {
		type: Types.Select,
		label: "Icon",
		options:
			'favorites_star, features_audio, features_building, features_channellisting, features_cloud, features_customization, features_data, features_features, features_mobility, features_networking, features_phone, features_protection, features_safety, features_scalable, features_service, features_signal, features_simple, features_speed, features_sports, features_wifi, industry_education, industry_government, industry_healthcare, industry_hospitality, industry_realestate, industry_residentialcommunities, partners_carriers, partners_resellers, resources_casestudy, resources_infographic, resources_whitepaper, service_internet, service_networking, service_TV, service_voice'
	},
	content: { type: Types.Textarea, label: "Feature Content", height: 200 }
}
var resource = {
	title: { type: String, label: "Resource Title" },
	svg_icon: {
		type: Types.Select,
		label: "Icon",
		options:
			'favorites_star, features_audio, features_building, features_channellisting, features_cloud, features_customization, features_data, features_features, features_mobility, features_networking, features_phone, features_protection, features_safety, features_scalable, features_service, features_signal, features_simple, features_speed, features_sports, features_wifi, industry_education, industry_government, industry_healthcare, industry_hospitality, industry_realestate, industry_residentialcommunities, partners_carriers, partners_resellers, resources_casestudy, resources_infographic, resources_whitepaper, service_internet, service_networking, service_TV, service_voice'
	},
	resource_link: { type: String, initial:false, label: "Resource Linked File", note: "Enter the full url for the item to download. (Example: 'http:/www.example.com/my_file.pdf')" },
	description: { type: Types.Textarea, height: 100, label: "Resource Description" }
}


Product.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', note: "This page will not show up unless published is chosen", index: true },
	industries: { type: Types.Relationship, label: "Linked Industries", ref: 'Industry', required: true, many: true, initial: false },
	services: { type: Types.Relationship, label: "Linked Services", ref: 'Service', required: true, many: true, initial: false },
	video: {
		title: { type: Types.Html,
			wysiwyg: true,
			height:40,
			label: "Hero Video: Title",
			note: "1-2 Words"
		},
		video_choice: {
			type: Types.Boolean,
			label: "Enable Video?",
			note: "If not checked, no video will show and the image associated will show without the play icon.",
			default: "false"
		},
		video: {
			type: Types.S3File,
			label: 'Product Video: File',
			note: 'MP4 Only. If no video is uploaded, video will default to the Homepage Hero Video.',
			allowedTypes: ['video/mp4'],
			s3path: 'uploads/videos'
		},
		background: {
			type: Types.S3File,
			label: 'Product Video: Hero Image',
			note: "Upload a 2X Image to be preview image for the video.",
			s3path: 'uploads/images'
		}
	},
	resource_one: resource,
	resource_two: resource,
	resource_three: resource,
	resource_four: resource,
	
	item_one: section,
	item_two: section,
	item_three: section,
	item_four: section,
	item_five: section
});

Product.defaultColumns = 'title, state|20%';
Product.register();