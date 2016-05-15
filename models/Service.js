var keystone = require('keystone'),
	Types = keystone.Field.Types,
	Fields = require('./fields/fields'),
	Admin = require('./fields/admin'),
	Variables = require('./fields/variables');
/**
 * Service Model
 * ==========
 */

var Service = new keystone.List('Service', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	track: true,
	sortable: true
});

Service.add({
	title: {
		type: String,
		required: true,
		m_cms: {
			validations: {
				required: true,
				rangelength: [1,25]
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
	svg_icon: {
		type: Types.Select,
		label: "Icon",
		options:
			'favorites_star, features_audio, features_building, features_channellisting, features_cloud, features_customization, features_data, features_features, features_mobility, features_networking, features_phone, features_protection, features_safety, features_scalable, features_service, features_signal, features_simple, features_speed, features_sports, features_wifi, industry_education, industry_government, industry_healthcare, industry_hospitality, industry_realestate, industry_residentialcommunities, partners_carriers, partners_resellers, resources_casestudy, resources_infographic, resources_whitepaper, service_internet, service_networking, service_TV, service_voice, industry_Carrier_Services, service_Ethernet, service_Optics, service_Small_Cell, service_Wave_DWDM, service_Wave_Alternative',
		m_cms: { showroom: true, companion: true }
	},
	heading: {
		type: String,
		required: false,
		initial: false,
		label: "Service Heading",
		m_cms: {
			validations: {
				required: true,
				rangelength: [1,200]
			},
			showroom: true,
			companion: true
		}
	},
	content: {
		type: Types.Textarea,
		height: 400,
		required: false,
		initial: false,
		label: "Service Content",
		m_cms: {
			validations: {
				required: true,
				rangelength: [1,1000]
			},
			showroom: true,
			companion: true
		}
	},
	description: {
		type: String,
		required: false,
		initial: false,
		label: "Service Description",
		note: "Text will appear on other pages linking this industry, and not the industry page itself.",
		m_cms: {
			validations: {
				required: true,
				rangelength: [1,150]
			},
			showroom: true,
			companion: true
		}
	},
	industries: {
		type: Types.Relationship,
		ref: 'Industry',
		required: true,
		many: true,
		initial: false,
		label: "Linked Industries",
		note: "Select Industries to associate with this Service by dragging and dropping them. Relevant to showroom and companion.",
		m_cms: { limit: 0, showroom: true, companion: true }
	},
	resource_one: Fields.resource(),
	resource_two: Fields.resource(),
	resource_three: Fields.resource(),
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

Service.defaultColumns = 'title, state, svg_icon, industries|50%, lastEditAt';

Service.schema.methods.updateableFields = function() {
    return 'title, svg_icon, heading, content, description, industries, resource_one.title, resource_one.svg_icon, resource_one.resource_link, resource_one.description, resource_two.title, resource_two.svg_icon, resource_two.resource_link, resource_two.description, resource_three.title, resource_three.svg_icon, resource_three.resource_link, resource_three.description, lastEditAt';
}

Service.register();
