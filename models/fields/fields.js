var keystone = require('keystone'),
	Types = keystone.Field.Types,
	Variables = require('./variables');


exports.svg_icon = function () {

	return {
		type: Types.Select,
		label: "Icon",
		options: Variables.svg_icons()
	}

};

exports.resource = function () {

	return {
		title: { type: String, label: "Resource Title" },
		svg_icon: {
			type: Types.Select,
			label: "Icon",
			options: Variables.svg_icons()
		},
		resource_type: { type: Types.Boolean, default: false, label: "Is this resource an external link?", note: "Check this box if this is an external link. Do not check the box if the link below is a PDF for download."},
		resource_link: { type: String, initial:false, label: "Resource Linked File", note: "Enter the full url for the item to download. (Example: 'http:/www.example.com/my_file.pdf')" },
		description: { type: Types.Textarea, height: 100, label: "Resource Description" }
	}

};

exports.media_buffet = function (section, types) {

	function modalTitle(type, dependsOnObj) {

		return {
			type: Types.Html,
			wysiwyg: true,
			height:10,
			label: "Media "+type+": Title",
			note: "PLACEHOLDER"
		} 
	};

	function media_item(types, m_cms_grouplabel, m_cms_groupname) {
		var selected_types;
		if (types) { selected_types = types; } else { selected_types = "None, Video, Image, Story"}

		return {
			type: {
				type: Types.Select,
				options: selected_types,
				label: "Media Type",
				note: "Choose",
				m_cms: { group_label: m_cms_grouplabel, group_name: m_cms_groupname }
			},
			thumbnail: {
				type: Types.S3File,
				label: 'Media Thumbnail: Preview Image',
				note: "Upload a 2X Image to be the thumbnail image for the tile.",
				s3path: 'uploads/images',
				m_cms: { group_label: m_cms_grouplabel, group_name: m_cms_groupname }
			},
			video: {
				title: modalTitle('Video'),
				video: {
					type: Types.S3File,
					label: 'Media Video: File MP4',
					note: 'MP4 Only. If no video is uploaded, video will default to the Homepage Hero Video.',
					allowedTypes: ['video/mp4'],
					s3path: 'uploads/videos',
					m_cms: { group_label: m_cms_grouplabel, group_name: m_cms_groupname }
				},
				video_webm: {
					type: Types.S3File,
					label: 'Media Video: File WebM',
					note: 'WebM Only. If no WebM, video may function in all browsers. Also, if no MP4 video will not be shown.',
					allowedTypes: ['video/webm'],
					s3path: 'uploads/videos',
					m_cms: { group_label: m_cms_grouplabel, group_name: m_cms_groupname }
				},
				poster: {
					type: Types.S3File,
					label: 'Media Video: Poster on Video',
					note: "Upload a 2X Image to be preview image for the video.",
					s3path: 'uploads/images',
					m_cms: { group_label: m_cms_grouplabel, group_name: m_cms_groupname }
				}
			},
			image: {
				type: Types.S3File,
				label: 'Media Video: Preview Image',
				note: "Upload a 2X Image to be preview image for the video.",
				s3path: 'uploads/images',
				m_cms: { group_label: m_cms_grouplabel, group_name: m_cms_groupname }
			},
			story: {
				title: modalTitle('Story'),
				content: { type: Types.Markdown,
					wysiwyg: true,
					height:300,
					label: "Media Story: Content",
					note: "No set limit for characters. Overflowed content will not be shown. All headers will be dark blue.",
					m_cms: { group_label: m_cms_grouplabel, group_name: m_cms_groupname }
				},
				featured_image: {
					type: Types.S3File,
					label: 'Media Story: Featured Image',
					note: "Upload a 2X Image to be the Image located in the Article.",
					s3path: 'uploads/images',
					m_cms: { group_label: m_cms_grouplabel, group_name: m_cms_groupname }
				}
			}
		}
	}

	return {

		media_section_one: media_item("None, Video, Image, Story", "Media Section Top Left", "media_section_one"),
		values: {
			title: modalTitle('Values'),
			content: { type: Types.Html,
				wysiwyg: true,
				height:200,
				label: "Media Values: Content",
				note: "Limit to around 150 characters for optimal size."
			}
		},
		facts: {
			title: modalTitle('Facts'),
			featured_image: {
				type: Types.S3File,
				label: 'Media Facts: Factoid Image',
				note: "Upload a 2X Image.",
				s3path: 'uploads/images'
			}
		},
		media_section_two: media_item("None, Video, Image, Story", "Media Section Bottom Right", "media_section_two")
	};

};
