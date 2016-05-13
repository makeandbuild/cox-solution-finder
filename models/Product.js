var keystone = require('keystone'),
	Types = keystone.Field.Types,
	Fields = require('./fields/fields');

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
	title: {
		type: String,
		label: "Feature Title",
		m_cms: {
			validations: {
				required: false,
				markdownLimit: [0,50]
			},
			showroom: true,
			companion: true,
			m_group: 'items'
		}
	},
	svg_icon: {
		type: Types.Select,
		label: "Icon",
		options: 'favorites_star, features_audio, features_building, features_channellisting, features_cloud, features_customization, features_data, features_features, features_mobility, features_networking, features_phone, features_protection, features_safety, features_scalable, features_service, features_signal, features_simple, features_speed, features_sports, features_wifi, industry_education, industry_government, industry_healthcare, industry_hospitality, industry_realestate, industry_residentialcommunities, partners_carriers, partners_resellers, resources_casestudy, resources_infographic, resources_whitepaper, service_internet, service_networking, service_TV, service_voice, industry_Carrier_Services, service_Ethernet, service_Optics, service_Small_Cell, service_Wave_DWDM, service_Wave_Alternative',
		m_cms: { showroom: true, companion: true, m_group: 'items' }
	},
	content: {
		type: Types.Textarea,
		label: "Feature Content",
		height: 200,
		m_cms: {
 			validations: {
				required: false,
				markdownLimit: [0,600]
			},
			showroom: true,
			companion: true,
			m_group: 'items'
		}
	}
}

Product.add({
	title: {
		type: String,
		required: true,
		m_cms: {
 			validations: {
				required: true,
				rangelength: [1,40]
			},
			showroom: true,
			companion: true
		}
	},
	state: {
		type: Types.Select,
		options: 'draft, published, archived',
		default: 'draft',
		note: "This page will not show up unless published is chosen",
		index: true
	},
	industries: {
		type: Types.Relationship,
		label: "Linked Industries",
		ref: 'Industry',
		required: true,
		many: true,
		initial: false,
		m_cms: { limit: 0, showroom: true, companion: true },
		note: 'Choose all applicable industries. Relevant to both showroom and companion.'
	},
	services: {
		type: Types.Relationship,
		label: "Linked Services",
		ref: 'Service',
		required: true,
		many: true,
		initial: false,
		m_cms: { limit: 1, showroom: true, companion: true },
		note: 'Choose applicable service for prodcut. Relevant to both showroom and companion.'
	},
	order: {
		type: Types.Number,
		required: true,
		initial: false,
		default: 0,
		label: "Product Order",
		note: "Use this to determine the order the product should appear on a Service page or elsewhere where products are listed. Order is lowest to highest. Example: 0 would be first, followed by 1."
	},
	video: {
		title: {
			type: Types.Html,
			wysiwyg: true,
			height:40,
			label: "Hero Video: Title",
			note: "1-2 Words",
			m_cms: {
				htmlEditor: false,
				validations: {
					required: true,
					twoFieldHtmlMax: 15
				},
				showroom: true,
				companion: true
			}
		},
		video_choice: {
			type: Types.Boolean,
			label: "Enable Video?",
			note: "If not checked, no video will show and the image associated will show without the play icon.",
			default: "false",
			m_cms: { showroom: false, companion: false }
		},
		video: {
			type: Types.S3File,
			label: 'Product Video: File MP4',
			note: 'MP4 Only. If no video is uploaded, video will default to the Homepage Hero Video. Note: If no image is uploaded, no video will show up!',
			allowedTypes: ['video/mp4'],
			s3path: 'uploads/videos',
			m_cms: { showroom: true, companion: true }
		},
		video_webm: {
			type: Types.S3File,
			label: 'Product Video: File WebM',
			note: 'WebM Only. If no WebM, video may function in all browsers. Also, if no MP4 video will not be shown.',
			allowedTypes: ['video/webm'],
			s3path: 'uploads/videos',
			m_cms: { showroom: true, companion: true }
		},
		title_overlay: {
			type: Types.Boolean,
			default: false,
			label: "Use title overlay over the image?",
			note:"This should be used when there is no image content available for this product and the blue generic image is used.",
			m_cms: { showroom: false, companion: false }
		},
		background: {
			type: Types.S3File,
			label: 'Product Video: Hero Image',
			allowedTypes: ['image/gif', 'image/jpeg', 'image/png'],
			note: "Upload a 2X Image to be preview image for the video. This image must be uploaded for the video to be displayed.",
			s3path: 'uploads/images',
			m_cms: { showroom: true, companion: true }
		}
	},
	resource_one: Fields.resource(),
	resource_two: Fields.resource(),
	resource_three: Fields.resource(),
	resource_four: Fields.resource(),

	item_one: section,
	item_two: section,
	item_three: section,
	item_four: section,
	item_five: section,

	editor: {
		type: Types.Relationship,
		ref: 'User'
	},
	checkoutTime: {
		type: Types.Datetime,
		default: Date.now()
	},
	lastEditAt: {
		type: Types.Datetime,
		required:false
	}
});

Product.schema.methods.updateableFields = function() {
	return 'title, industries, services, order, video.title, video.video_choice, video.video, video.video_webm, video.title_overlay, video.background, resource_one.title, resource_one.svg_icon, resource_one.resource_type, resource_one.resource_link, resource_one.description, resource_two.title, resource_two.svg_icon, resource_two.resource_type, resource_two.resource_link, resource_two.description, resource_three.title, resource_three.svg_icon, resource_three.resource_type, resource_three.resource_link, resource_three.description, resource_four.title, resource_four.svg_icon, resource_four.resource_type, resource_four.resource_link, resource_four.description, item_one.title, item_one.svg_icon, item_one.content, item_two.title, item_two.svg_icon, item_two.content, item_three.title, item_three.svg_icon, item_three.content, item_four.title, item_four.svg_icon, item_four.content, item_five.title, item_five.svg_icon, item_five.content, lastEditAt';
}

Product.defaultColumns = 'title, state|20%, lastEditAt';
Product.register();
