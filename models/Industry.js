var keystone = require('keystone'),
	Types = keystone.Field.Types,
	Fields = require('./fields/fields'),
	Admin = require('./fields/admin'),
	Variables = require('./fields/variables');

/**
 * Industry Model
 * ==========
 */

var Industry = new keystone.List('Industry', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	track: true
});

Industry.add(

	Admin.headers('settings'),

	{
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
		}
	},

	Admin.headers('content'),

	{
		heading: { type: String, required: true, initial: false, label: "Industry Heading" },
		attribute_one: { type: String, label: "Industry Attribute One" },
		attribute_two: { type: String, label: "Industry Attribute Two" },
		attribute_three: { type: String, label: "Industry Attribute Three" },
		content: { type: Types.Textarea, height: 400, required: true, initial: false, label: "Industry Content" },
		description: { type: String, required: true, initial: false, label: "Industry Description", note: "Text will appear on other pages linking this industry, and not the industry page itself." },
		svg_icon: {
			type: Types.Select,
			label: "Icon",
			options:
				'favorites_star, features_audio, features_building, features_channellisting, features_cloud, features_customization, features_data, features_features, features_mobility, features_networking, features_phone, features_protection, features_safety, features_scalable, features_service, features_signal, features_simple, features_speed, features_sports, features_wifi, industry_education, industry_government, industry_healthcare, industry_hospitality, industry_realestate, industry_residentialcommunities, partners_carriers, partners_resellers, resources_casestudy, resources_infographic, resources_whitepaper, service_internet, service_networking, service_TV, service_voice'
		},
	},

	Admin.headers('media-buffet'),

	{
		media_buffet: {
			video: {
				title: { type: Types.Html,
					wysiwyg: true,
					height:40,
					label: "Media Video: Title",
					note: "1-2 Words. Do not copy and paste text into this field. Make sure there is no extra code besides the desired text. Click the source button to see additional information. Adding extraneous code could cause styling issues in this section."
				},
				video_choice: {
					type: Types.Boolean,
					label: "Enable Video?",
					note: "If not checked, no video will show and the image associated will show without the play icon.",
					default: "false"
				},
				video: {
					type: Types.S3File,
					label: 'Media Video: File MP4',
					note: 'MP4 Only. If no video is uploaded, video will default to the Homepage Hero Video.',
					allowedTypes: ['video/mp4'],
					s3path: 'uploads/videos'
				},
				video_webm: {
					type: Types.S3File,
					label: 'Media Video: File WebM',
					note: 'WebM Only. If no WebM, video may function in all browsers. Also, if no MP4 video will not be shown.',
					allowedTypes: ['video/webm'],
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
					note: "1-2 Words. Do not copy and paste text into this field. Make sure there is no extra code besides the desired text. Click the source button to see additional information. Adding extraneous code could cause styling issues in this section."
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
					note: "1-2 Words. Do not copy and paste text into this field. Make sure there is no extra code besides the desired text. Click the source button to see additional information. Adding extraneous code could cause styling issues in this section."
				},
				content: { type: Types.Markdown,
					wysiwyg: true,
					height:1000,
					label: "Media Story: Content",
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
					note: "1-2 Words. Do not copy and paste text into this field. Make sure there is no extra code besides the desired text. Click the source button to see additional information. Adding extraneous code could cause styling issues in this section."
				},
				featured_image: {
					type: Types.S3File,
					label: 'Media Facts: Factoid Image',
					note: "Upload a 2X Image.",
					s3path: 'uploads/images'
				}
			}
		}
	},

	Admin.headers('resources'),

	{
		resource_one: 	Fields.resource(),
		resource_two: 	Fields.resource(),
		resource_three: Fields.resource(),
		resource_four: 	Fields.resource()
	}
);

Industry.relationship({ ref: 'Service', refPath: ':service', path: ':industry' });


Industry.defaultColumns = 'title, state|20%, heading|20%';
Industry.register();