var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Industry Model
 * ==========
 */

var Industry = new keystone.List('Industry', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	track: true
});

var resource = {
	title: { type: String },
	icon_choice: {
		type: Types.Boolean,
		label: "Use Custom Icon?",
		default: "false",
	},
	svg_icon: {
		type: Types.Select,
		label: "Icon",
		dependsOn: { icon_choice: [false, null, 0, '', '0', 'false', 'null'] },
		options:
			'favorites_star, features_audio, features_building, features_channellisting, features_cloud, features_customization, features_data, features_features, features_mobility, features_networking, features_phone, features_protection, features_safety, features_scalable, features_service, features_signal, features_simple, features_speed, features_sports, features_wifi, industry_education, industry_government, industry_healthcare, industry_hospitality, industry_realestate, industry_residentialcommunities, partners_carriers, partners_resellers, resources_casestudy, resources_infographic, resources_whitepaper, service_internet, service_networking, service_TV, service_voice'
	},
	custom_icon: {
		type: Types.S3File,
		label: "Custom Icon",
		dependsOn: { icon_choice: true },
		s3path: 'uploads/images',
		format: function(icon, file){
			return '<pre>'+JSON.stringify(file, false, 2)+'</pre>'+'<img src="'+file.url+'" style="max-width: 300px">'
		}
	},
	resource_link: { type: String, initial:false },
	description: { type: Types.Textarea, height: 100 }
}

Industry.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	heading: { type: String, required: true, default: 'Example Heading' },
	content: { type: Types.Textarea, height: 400, required: true, default: 'Example Content' },
	icon_choice: {
		type: Types.Boolean,
		label: "Use Custom Icon?",
		default: "false",
	},
	svg_icon: {
		type: Types.Select,
		label: "Icon",
		dependsOn: { icon_choice: [false, null, 0, '', '0', 'false', 'null'] },
		options:
			'favorites_star, features_audio, features_building, features_channellisting, features_cloud, features_customization, features_data, features_features, features_mobility, features_networking, features_phone, features_protection, features_safety, features_scalable, features_service, features_signal, features_simple, features_speed, features_sports, features_wifi, industry_education, industry_government, industry_healthcare, industry_hospitality, industry_realestate, industry_residentialcommunities, partners_carriers, partners_resellers, resources_casestudy, resources_infographic, resources_whitepaper, service_internet, service_networking, service_TV, service_voice'
	},
	custom_icon: {
		type: Types.S3File,
		label: "Custom Icon",
		dependsOn: { icon_choice: true },
		s3path: 'uploads/images',
		format: function(icon, file){
			return '<pre>'+JSON.stringify(file, false, 2)+'</pre>'+'<img src="'+file.url+'" style="max-width: 300px">'
		}
	},
	resource_one: resource,
	resource_two: resource,
	resource_three: resource
});

Industry.relationship({ ref: 'Service', refPath: ':service', path: ':industry' });


Industry.defaultColumns = 'title, state|20%, heading|20%';
Industry.register();



//Just the model for now, more will be added later.