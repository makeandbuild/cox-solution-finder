var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Service Model
 * ==========
 */

var Service = new keystone.List('Service', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	track: true
});

var resource = {
	title: { type: String },
	svg_icon: {
		type: Types.Select,
		label: "Icon",
		options:
			'favorites_star, features_audio, features_building, features_channellisting, features_cloud, features_customization, features_data, features_features, features_mobility, features_networking, features_phone, features_protection, features_safety, features_scalable, features_service, features_signal, features_simple, features_speed, features_sports, features_wifi, industry_education, industry_government, industry_healthcare, industry_hospitality, industry_realestate, industry_residentialcommunities, partners_carriers, partners_resellers, resources_casestudy, resources_infographic, resources_whitepaper, service_internet, service_networking, service_TV, service_voice'
	},
	resource_link: { type: String, initial:false },
	description: { type: Types.Textarea, height: 100 }
}

Service.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	svg_icon: {
		type: Types.Select,
		label: "Icon",
		options:
			'favorites_star, features_audio, features_building, features_channellisting, features_cloud, features_customization, features_data, features_features, features_mobility, features_networking, features_phone, features_protection, features_safety, features_scalable, features_service, features_signal, features_simple, features_speed, features_sports, features_wifi, industry_education, industry_government, industry_healthcare, industry_hospitality, industry_realestate, industry_residentialcommunities, partners_carriers, partners_resellers, resources_casestudy, resources_infographic, resources_whitepaper, service_internet, service_networking, service_TV, service_voice'
	},
	heading: { type: String, required: true, default: 'Example Heading' },
	content: { type: Types.Textarea, height: 400, required: true, default: 'Example Content' },
	industries: { type: Types.Relationship, ref: 'Industry', required: true, many: true, initial: false },
	resource_one: resource,
	resource_two: resource,
	resource_three: resource
});

Service.defaultColumns = 'title, state|20%, heading|20%';
Service.register();