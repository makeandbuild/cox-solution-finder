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

Industry.add({
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
	heading: { type: String, required: true, initial: false, label: "Industry Heading" },
	attribute_one: { type: String, label: "Industry Attribute One" },
	attribute_two: { type: String, label: "Industry Attribute Two" },
	attribute_three: { type: String, label: "Industry Attribute Three" },
	content: { type: Types.Textarea, height: 400, required: true, initial: false, label: "Industry Content" },
	svg_icon: {
		type: Types.Select,
		label: "Icon",
		options:
			'favorites_star, features_audio, features_building, features_channellisting, features_cloud, features_customization, features_data, features_features, features_mobility, features_networking, features_phone, features_protection, features_safety, features_scalable, features_service, features_signal, features_simple, features_speed, features_sports, features_wifi, industry_education, industry_government, industry_healthcare, industry_hospitality, industry_realestate, industry_residentialcommunities, partners_carriers, partners_resellers, resources_casestudy, resources_infographic, resources_whitepaper, service_internet, service_networking, service_TV, service_voice'
	},
	media_buffet: {
		video: {
			title: { type: Types.Html,
				wysiwyg: true,
				height:40,
				label: "Media Video: Title",
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
				label: 'Media Video: File',
				note: 'MP4 Only. If no video is uploaded, video will default to the Homepage Hero Video.',
				allowedTypes: ['video/mp4'],
				s3path: 'uploads/videos'
			},
			background: {
				type: Types.S3File,
				label: 'Media Video: Preview Image',
				note: "Upload a 2X Image to be preview image for the video.",
				s3path: 'uploads/images'
			}
		},
		values: {
			title: { type: Types.Html,
				wysiwyg: true,
				height:40,
				label: "Media Values: Title",
				note: "1-2 Words"
			},
			content: { type: Types.Html,
				wysiwyg: true,
				height:200,
				label: "Media Values: Content",
				note: "Limit to around 150 characters for optimal size."
			}
		},
		story: {
			title: { type: Types.Html,
				wysiwyg: true,
				height:40,
				label: "Media Story: Title",
				note: "1-2 Words"
			},
			content: { type: Types.Html,
				wysiwyg: true,
				height:1000,
				label: "Media Values: Content",
				note: "No set limit for characters. Overflowed content will not be shown. All headers will be dark blue."
			},
			featured_image: {
				type: Types.S3File,
				label: 'Media Story: Featured Image',
				note: "Upload a 2X Image to be the vertically cropped preview image for the article. This image will also display in full in the article modal.",
				s3path: 'uploads/images'
			}

		},
		facts: {
			title: { type: Types.Html,
				wysiwyg: true,
				height:40,
				label: "Media Facts: Title",
				note: "1-2 Words"
			},
			content_choice: {
				type: Types.Boolean,
				label: "Media Facts: Use an image instead of content?",
				default: "false"
			},
			content: { type: Types.Html,
				wysiwyg: true,
				height:400,
				// dependsOn: { content_choice: false },
				label: "Media Facts: Content",
				note: "1 Sentence. Bold content that will use large text, and it will change font size, color, and stay on its own line."
			},
			featured_image: {
				type: Types.S3File,
				// dependsOn: { content_choice: true },
				label: 'Media Facts: Featured Image',
				note: "Upload a 2X Image to be the featured image for a fact in place of content.",
				s3path: 'uploads/images'
			}
		}
	},
	resource_one: resource,
	resource_two: resource,
	resource_three: resource,
	resource_four: resource
});

Industry.relationship({ ref: 'Service', refPath: ':service', path: ':industry' });


Industry.defaultColumns = 'title, state|20%, heading|20%';
Industry.register();