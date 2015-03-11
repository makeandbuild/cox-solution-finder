var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Partners Model
 * ==========
 */

var Partner = new keystone.List('Partner', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	track: true
});

var resource = {
	title: { type: String, label: "Resource Title" },
	svg_icon: {
		type: Types.Select,
		label: "Icon",
		options:
			'favorites_star, features_audio, features_building, features_channellisting, features_cloud, features_customization, features_data, features_features, features_mobility, features_networking, features_phone, features_protection, features_safety, features_scalable, features_service, features_signal, features_simple, features_speed, features_sports, features_wifi, industry_education, industry_government, industry_healthcare, industry_hospitality, industry_realestate, industry_residentialcommunities, partners_carriers, partners_resellers, resources_casestudy, resources_infographic, resources_whitepaper, service_internet, service_networking, service_TV, service_voice'
	},
	resource_type: { type: Types.Boolean, default: false, label: "Is this resource an external link?", note: "Check this box if this is an external link. Do not check the box if the link below is a PDF for download."},
	resource_link: { type: String, initial:false, label: "Resource Linked File", note: "Enter the full url for the item to download. (Example: 'http:/www.example.com/my_file.pdf')" },
	description: { type: Types.Textarea, height: 100, label: "Resource Description" }
}

Partner.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', note: "This page will not show up unless published is chosen", index: true },
	custom_ordered_services: {
		type: Types.Relationship,
		label: "Services",
		ref: 'Service',
		required: true,
		many: true,
		initial: false,
		note: "Choose 3 only."
	},
	heading: { type: String, initial: false, label: "Partner Heading" },
	content: { type: Types.Textarea, height: 400, initial: false, label: "Partner Content" },
	description: { type: String, initial: false, label: "Partner Description", note: "Text will appear on other pages linking this partner, and not the partner page itself." },
	svg_icon: {
		type: Types.Select,
		label: "Icon",
		options:
			'favorites_star, features_audio, features_building, features_channellisting, features_cloud, features_customization, features_data, features_features, features_mobility, features_networking, features_phone, features_protection, features_safety, features_scalable, features_service, features_signal, features_simple, features_speed, features_sports, features_wifi, industry_education, industry_government, industry_healthcare, industry_hospitality, industry_realestate, industry_residentialcommunities, partners_carriers, partners_resellers, resources_casestudy, resources_infographic, resources_whitepaper, service_internet, service_networking, service_TV, service_voice'
	},
	partner_buffet: {
		bigPic: {
			title: { type: Types.Html,
				wysiwyg: true,
				height:40,
				label: "Big Picture: Title",
				note: "1-2 Words. Do not copy and paste text into this field. Make sure there is no extra code besides the desired text. Click the source button to see additional information. Adding extraneous code could cause styling issues in this section."
			},
			featured_image: {
				type: Types.S3File,
				label: 'Big Picture: Image',
				note: "Upload a 2X Image.",
				s3path: 'uploads/images'
			}

		},
		values: {
			title: { type: Types.Html,
				wysiwyg: true,
				height:40,
				label: "Media Values: Title",
				note: "1-2 Words. Do not copy and paste text into this field. Make sure there is no extra code besides the desired text. Click the source button to see additional information. Adding extraneous code could cause styling issues in this section."
			},
			content: { type: Types.Html,
				wysiwyg: true,
				height:200,
				label: "Media Values: Content",
				note: "Limit to around 150 characters for optimal size."
			}
		},
		smallPic: {
			title: { type: Types.Html,
				wysiwyg: true,
				height:40,
				label: "Small Pic: Title",
				note: "1-2 Words. Do not copy and paste text into this field. Make sure there is no extra code besides the desired text. Click the source button to see additional information. Adding extraneous code could cause styling issues in this section."
			},
			featured_image: {
				type: Types.S3File,
				label: 'Small Pic: Image',
				note: "Upload a 2X Image.",
				s3path: 'uploads/images'
			}

		},
		facts: {
			title: { type: Types.Html,
				wysiwyg: true,
				height:40,
				label: "Media Facts: Title",
				note: "1-2 Words. Do not copy and paste text into this field. Make sure there is no extra code besides the desired text. Click the source button to see additional information. Adding extraneous code could cause styling issues in this section."
			},
			featured_image: {
				type: Types.S3File,
				label: 'Media Facts: Factoid Image',
				note: "Upload a 2X Image.",
				s3path: 'uploads/images'
			}
		}
	},
	resource_one: resource,
	resource_two: resource,
	resource_three: resource,
	resource_four: resource
});

Partner.relationship({ ref: 'Service', refPath: ':service', path: ':industry' });


Partner.defaultColumns = 'title, state|20%, heading|20%';
Partner.register();