var keystone = require('keystone'),
	Types = keystone.Field.Types,
	Variables = require('./variables');


exports.svg_icon = function () {

	return {
		type: Types.Select,
		label: "Icon",
		options: Variables.svg_icons(),
		m_cms: { showroom: true, companion: true }
	}

};

exports.state = function () {

	return {
		type: Types.Select,
		options: 'draft, published, archived',
		default: 'draft',
		note: "This page will not show up unless published is chosen",
		index: true
	}

};

exports.resource = function () {

	return {
		title: {
			type: String,
			label: "Resource Title",
			m_cms: {
 				validations: {
					required: true,
					rangelength: [1,75]
				},
				showroom: true,
				companion: true
			}
		},
		svg_icon: {
			type: Types.Select,
			label: "Icon",
			options: Variables.svg_icons(),
			m_cms: {
				showroom: true,
				companion: true
			}
		},
		resource_type: {
			type: Types.Boolean,
			default: false,
			label: "Is this resource an external link?",
			note: "Check this box if this is an external link. Do not check the box if the link below is a PDF for download.",
			m_cms: {
				showroom: false,
				companion: false
			}
		},
		resource_link: {
			type: String,
			initial:false,
			label: "Resource Linked File",
			note: "Enter the full url for the item to download. (Example: 'http:/www.example.com/my_file.pdf')",
			m_cms: {
				validations: {
					required: true,
					rangelength: [1,2000]
				},
				showroom: true,
				companion: true
			}
 		},
		description: {
			type: Types.Textarea,
			height: 100,
			label: "Resource Description",
			m_cms: {
				validations: {
					required: false,
					rangelength: [0,225]
				},
				showroom: true,
				companion: true
			}
		}
	}

};

exports.media_buffet = function () {

	function modalTitle(type) {
		label = "Media Section Title";
		if(type) { label = type + " Section Title"}

		return {
			type: Types.Html,
			wysiwyg: true,
			height:10,
			label: label,
			note: "Enter the two words that form the title to this section. The boxes are in order and labeled with which style they will be. Place one word in each box.",
			m_cms: {
				htmlEditor: false,
				validations: {
					required: true,
					twoFieldHtmlMax: 15
				},
				showroom: true,
				companion: true
			}
		}
	};

	function media_item(types, m_cms_grouplabel, m_cms_groupname) {
		var selected_types;
		if (types) { selected_types = types; } else { selected_types = "None,Video,Image,Story"}

		return {
			title: modalTitle(),
			type: {
				type: Types.Select,
				options: selected_types,
				label: "Media Section Type",
				note: "Choose a type for this section.",
				m_cms: { showroom: true, companion: true, group_label: m_cms_grouplabel, group_name: m_cms_groupname }
			},
			thumbnail: {
				type: Types.S3File,
				label: 'Media Section Thumbnail',
				allowedTypes: ['image/gif', 'image/jpeg', 'image/png'],
				note: "Upload a 2X Image to be the thumbnail image for the tile.",
				s3path: 'uploads/images',
				m_cms: { showroom: true, companion: true, group_label: m_cms_grouplabel, group_name: m_cms_groupname }
			},
			video: {
				video: {
					type: Types.S3File,
					label: 'Media Video: File MP4',
					note: 'MP4 Only. If no video is uploaded, video will default to the Homepage Hero Video.',
					allowedTypes: ['video/mp4'],
					s3path: 'uploads/videos',
					m_cms: { showroom: true, companion: true, group_label: m_cms_grouplabel, group_name: m_cms_groupname }
				},
				video_webm: {
					type: Types.S3File,
					label: 'Media Video: File WebM',
					note: 'WebM Only. If no WebM, video may function in all browsers. Also, if no MP4 video will not be shown.',
					allowedTypes: ['video/webm'],
					s3path: 'uploads/videos',
					m_cms: { showroom: true, companion: true, group_label: m_cms_grouplabel, group_name: m_cms_groupname }
				},
				poster: {
					type: Types.S3File,
					label: 'Media Video: Poster for Video Preview',
					allowedTypes: ['image/gif', 'image/jpeg', 'image/png'],
					note: "Upload a 2X Image to be preview image for the video.",
					s3path: 'uploads/images',
					m_cms: { showroom: true, companion: true, group_label: m_cms_grouplabel, group_name: m_cms_groupname }
				}
			},
			image: {
				type: Types.S3File,
				label: 'Media Image: File',
				allowedTypes: ['image/gif', 'image/jpeg', 'image/png'],
				note: "Upload a 2X Image to be preview image for the video.",
				s3path: 'uploads/images',
				m_cms: { showroom: true, companion: true, group_label: m_cms_grouplabel, group_name: m_cms_groupname }
			},
			story: {
				content: { type: Types.Markdown,
					wysiwyg: true,
					height:300,
					label: "Media Story: Content",
					note: "No set limit for characters. Overflowed content will not be shown. H2 and H3 elements will be dark blue.",
					m_cms: {
						validations: {
							required: true,
							markdownLimit: [1,3000]
						},
						showroom: true,
						companion: true,
						group_label: m_cms_grouplabel,
						group_name: m_cms_groupname
					}
				},
				featured_image: {
					type: Types.S3File,
					label: 'Media Story: Featured Image',
					allowedTypes: ['image/gif', 'image/jpeg', 'image/png'],
					note: "Upload a 2X Image to be the Image located in the Article.",
					s3path: 'uploads/images',
					m_cms: { showroom: true, companion: true, group_label: m_cms_grouplabel, group_name: m_cms_groupname }
				}
			}
		}
	}

	return {

		media_section_one: media_item("None,Video,Image,Story", "Media Section Top Left", "media_section_one"),
		values: {
			title: modalTitle('Values'),
			content: { type: Types.Html,
				wysiwyg: true,
				height:200,
				label: "Media Values: Content",
				note: "Limit to around 150 characters for optimal size.",
				m_cms: {
					htmlEditor: true,
					validations: {
						required: false,
						htmlField: [1,150]
					},
					showroom: true,
					companion: true
				}
			}
		},
		facts: {
			title: modalTitle('Facts'),
			featured_image: {
				type: Types.S3File,
				label: 'Media Facts: Factoid Image',
				allowedTypes: ['image/gif', 'image/jpeg', 'image/png'],
				note: "Upload a 2X Image.",
				s3path: 'uploads/images',
				m_cms: { showroom: true, companion: true }
			}
		},
		media_section_two: media_item("None,Video,Image,Story", "Media Section Bottom Right", "media_section_two")
	};

};
